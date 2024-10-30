const express = require('express');
const sql = require('mssql');
const app = express();
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure body-parser to handle URL-encoded and JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Multer for file upload
const storage = multer.memoryStorage(); // Store files in memory as Buffer objects
const upload = multer({ storage });

const dbConfig = {
    server: '192.168.68.94',
    database: 'MSU-RFID',
    user: 'sa',
    password: 'PASSWORD1!',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

// Connection pool
sql.connect(dbConfig, err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected');
    }
});

// Server endpoint where it check the availability of the selected date and time
app.post('/api/checkAvailability', async (req, res) => {
    const { date } = req.body;

    try {
        // Connect to the database
        await sql.connect(dbConfig);

        // Query to find booked slots for the given date
        const result = await sql.query`
            SELECT app_timeFrom, app_timeTo
            FROM Appointments
            WHERE app_date = ${date}`;

        const bookedSlots = result.recordset.map(row => `${row.app_timeFrom}-${row.app_timeTo}`);

        // Send the list of booked slots
        res.json({ bookedSlots });
    } catch (err) {
        console.error('Error checking availability:', err);
        res.status(500).json({ error: 'Failed to check availability' });
    } finally {
        sql.close();
    }
});

// Server endpoint to check availability for the entire month
app.post('/api/checkMonthAvailability', async (req, res) => {
    const { year, month } = req.body; // month is 1-indexed

    try {
        // Connect to the database
        await sql.connect(dbConfig);

        // Query to find all booked slots for the given month
        const result = await sql.query`
            SELECT app_date, app_timeFrom, app_timeTo
            FROM Appointments
            WHERE YEAR(app_date) = ${year} AND MONTH(app_date) = ${month}`;

        // Organize bookings by date
        const bookings = result.recordset.reduce((acc, row) => {
            const date = row.app_date.toISOString().split('T')[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(`${row.app_timeFrom}-${row.app_timeTo}`);
            return acc;
        }, {});

        // Check if each date in the month is fully booked
        const daysInMonth = new Date(year, month, 0).getDate();
        const monthAvailability = {};

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const bookedSlots = bookings[date] || [];

            // Time slots are 08:00-09:00 to 16:00-17:00 (8 slots)
            const totalSlots = 8;
            const bookedCount = bookedSlots.length;
            const isFullyBooked = bookedCount === totalSlots;
            const isPartiallyBooked = bookedCount >= 4 && bookedCount < totalSlots;

            monthAvailability[date] = { isFullyBooked, isPartiallyBooked };
        }

        res.json(monthAvailability);
    } catch (err) {
        console.error('Error checking month availability:', err);
        res.status(500).json({ error: 'Failed to check month availability' });
    } finally {
        sql.close();
    }
});

app.post('/api/checkDocument', async (req, res) => {
    const transactionType = req.body.transactionType;

    try {
        console.log('Transaction Type:', transactionType); // Log received transaction type

        const pool = await sql.connect(dbConfig); // Ensure the connection pool is used
        const query = `SELECT trans_documentFileName, trans_documentFile FROM TransactionDocuments WHERE trans_type = @transactionType`;
        const request = new sql.Request(pool); // Pass the connection pool to the request
        request.input('transactionType', sql.VarChar, transactionType);

        const result = await request.query(query);
        console.log('Query Result:', result); // Log query result

        if (result.recordset.length > 0) {
            const document = result.recordset[0];
            const documentFileName = document.trans_documentFileName;
            const documentFile = document.trans_documentFile;

            res.json({
                fileName: documentFileName,
                file: documentFile.toString('base64')
            });
        } else {
            console.log('Document not found for transaction type:', transactionType); // Log when no document is found
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to handle form submission and file upload
app.post('/api/submit', upload.single('document'), async (req, res) => {
    const {
        appointmentID,
        transactionType,
        appointmentDate,
        timeFrom,
        timeTo,
        firstName,
        middleName,
        lastName,
        dob,
        gender,
        age,
        department,
        course,
        email,
        mobileNumber,
        houseStreet,
        barangay,
        city,
        province,
        status
    } = req.body;

    const documentContents = req.file;

    try {
        // Connect to the database
        await sql.connect(dbConfig);

        // Prepare the request with parameters
        const request = new sql.Request();
        request.input('appointmentID', sql.VarChar, appointmentID);
        request.input('transactionType', sql.VarChar, transactionType);
        request.input('appointmentDate', sql.Date, appointmentDate);
        request.input('timeFrom', sql.VarChar, timeFrom);
        request.input('timeTo', sql.VarChar, timeTo);
        request.input('firstName', sql.VarChar, firstName);
        request.input('middleName', sql.VarChar, middleName);
        request.input('lastName', sql.VarChar, lastName);
        request.input('dob', sql.Date, dob);
        request.input('gender', sql.VarChar, gender);
        request.input('age', sql.Int, age);
        request.input('department', sql.VarChar, department);
        request.input('course', sql.VarChar, course);
        request.input('email', sql.VarChar, email);
        request.input('mobileNumber', sql.VarChar, mobileNumber);
        request.input('houseStreet', sql.VarChar, houseStreet);
        request.input('barangay', sql.VarChar, barangay);
        request.input('city', sql.VarChar, city);
        request.input('province', sql.VarChar, province);
        request.input('docFileName', sql.VarChar, documentContents.originalname);
        request.input('documentContents', sql.VarBinary, documentContents.buffer);
        request.input('status', sql.VarChar, status);

        // Execute the SQL query with the provided parameters
        await request.query(`
            INSERT INTO Appointments (
                app_ID,
                app_transactionType,
                app_date,
                app_timeFrom,
                app_timeTo,
                app_firstName,
                app_middleName,
                app_lastName,
                app_DOB,
                app_gender,
                app_age,
                app_collegeDepartment,
                app_course,
                app_email,
                app_mobileNumber,
                app_houseStreet,
                app_barangay,
                app_municipalityCity,
                app_province,
                app_docFileName,
                app_document,
                app_status
            ) VALUES (
                @appointmentID,
                @transactionType,
                @appointmentDate,
                @timeFrom,
                @timeTo,
                @firstName,
                @middleName,
                @lastName,
                @dob,
                @gender,
                @age,
                @department,
                @course,
                @email,
                @mobileNumber,
                @houseStreet,
                @barangay,
                @city,
                @province,
                @docFileName,
                @documentContents,
                @status
            )
        `);

        // Send a success response
        res.json({ success: true, appointmentID });
    } catch (err) {
        console.error('Error inserting data:', err);
        // Send an error response
        res.status(500).json({ success: false, error: err.message });
    } finally {
        // Close the database connection
        sql.close();
    }
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));