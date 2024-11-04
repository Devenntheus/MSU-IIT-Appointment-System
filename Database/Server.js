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
    server: 'VENNZLAPTOP',
    database: 'MSU-RFID',
    user: 'Umbraven',
    password: 'Crow07k#2117',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

// Connection pool
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Database connected');
        return pool;
    })
    .catch(err => console.error('Database connection failed:', err));

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

app.post('/api/submit', upload.any(), async (req, res) => {
    try {
        const pool = await poolPromise; // Use the pool for the connection
        const request = pool.request(); // Create a new request object

        const formData = req.body;
        const files = req.files;

        // Add input parameters
        request.input('app_ID', sql.VarChar, formData.appointmentID);
        request.input('app_transactionType', sql.VarChar, formData.transactionType);
        request.input('app_documentType', sql.VarChar, formData.documentType);
        request.input('app_date', sql.Date, formData.appointmentDate);
        request.input('app_timeFrom', sql.VarChar, formData.timeFrom);
        request.input('app_timeTo', sql.VarChar, formData.timeTo);
        request.input('app_firstName', sql.VarChar, formData.firstName);
        request.input('app_middleName', sql.VarChar, formData.middleName);
        request.input('app_lastName', sql.VarChar, formData.lastName);
        request.input('app_dateOfBirth', sql.Date, formData.dateOfBirth);
        request.input('app_age', sql.Int, formData.age);
        request.input('app_gender', sql.VarChar, formData.gender);
        request.input('app_placeOfBirth', sql.VarChar, formData.placeOfBirth);
        request.input('app_citizenship', sql.VarChar, formData.citizenship);
        request.input('app_email', sql.VarChar, formData.email);
        request.input('app_mobileNumber', sql.VarChar, formData.mobileNumber);
        request.input('app_whatsAppNumber', sql.VarChar, formData.whatsAppNumber);
        request.input('app_telegramNumber', sql.VarChar, formData.telegramNumber);
        request.input('app_houseStreet', sql.VarChar, formData.houseStreet);
        request.input('app_barangay', sql.VarChar, formData.barangay);
        request.input('app_municipalityCity', sql.VarChar, formData.municipalityCity);
        request.input('app_province', sql.VarChar, formData.province);
        request.input('app_studentIdNumber', sql.VarChar, formData.studentID);
        request.input('app_collegeDepartment', sql.VarChar, formData.collegeDepartment);
        request.input('app_course', sql.VarChar, formData.course);
        request.input('app_classification', sql.VarChar, formData.classification);
        request.input('app_dateOfGraduation', sql.Date, formData.dateOfGraduation);
        request.input('app_academicDistinction', sql.VarChar, formData.academicDistinction);
        request.input('app_highschoolGraduated', sql.VarChar, formData.highschoolGraduated);
        request.input('app_transfereeSchool', sql.VarChar, formData.transfereeSchool);
        request.input('app_lastSemesterAttended', sql.VarChar, formData.lastSemesterAttended);
        request.input('app_purposeOfRequest', sql.VarChar, formData.purposeOfRequest);
        request.input('app_authenticationOfDocument', sql.VarChar, formData.authenticationOfDocument);
        request.input('app_certificateRegistrationSemester', sql.VarChar, formData.certificateRegistrationSemester);
        request.input('app_reportGradeSemester', sql.VarChar, formData.reportGradeSemester);
        request.input('app_specialRequestDocumentType', sql.VarChar, formData.specialRequestDocumentType);
        request.input('app_specialRequestCopies', sql.VarChar, formData.specialRequestCopies);
        request.input('app_status', sql.VarChar, 'Pending');

        // Initialize flags for files
        let hasDocumentFile = false;
        let hasCertificateFile = false;
        let hasTranscriptFile = false;
        let hasDiplomaFile = false;

        // Add input parameters for files only if they exist
        if (files && files.length > 0) {
            files.forEach(file => {
                if (file.fieldname === 'documentFile') {
                    if (!hasDocumentFile) {
                        request.input('app_documentFileName', sql.VarChar, file.originalname);
                        request.input('app_document', sql.VarBinary, file.buffer);
                        hasDocumentFile = true; // Mark as added
                    }
                } else if (file.fieldname === 'certificateRegistrationFile') {
                    if (!hasCertificateFile) {
                        request.input('app_authCertificateFileName', sql.VarChar, file.originalname);
                        request.input('app_authCertificateDocument', sql.VarBinary, file.buffer);
                        hasCertificateFile = true; // Mark as added
                    }
                } else if (file.fieldname === 'transcriptRecordsFile') {
                    if (!hasTranscriptFile) {
                        request.input('app_authTranscriptRecordsFileName', sql.VarChar, file.originalname);
                        request.input('app_authTranscriptRecordsDocument', sql.VarBinary, file.buffer);
                        hasTranscriptFile = true; // Mark as added
                    }
                } else if (file.fieldname === 'diplomaFile') {
                    if (!hasDiplomaFile) {
                        request.input('app_authDiplomaFileName', sql.VarChar, file.originalname);
                        request.input('app_authDiplomaDocument', sql.VarBinary, file.buffer);
                        hasDiplomaFile = true; // Mark as added
                    }
                }
            });
        }

        // Set default values for parameters that are not set
        if (!hasCertificateFile) {
            request.input('app_authCertificateFileName', sql.VarChar, null);
            request.input('app_authCertificateDocument', sql.VarBinary, null); 
        }
        if (!hasTranscriptFile) {
            request.input('app_authTranscriptRecordsFileName', sql.VarChar, null);
            request.input('app_authTranscriptRecordsDocument', sql.VarBinary, null);
        }
        if (!hasDiplomaFile) {
            request.input('app_authDiplomaFileName', sql.VarChar, null);
            request.input('app_authDiplomaDocument', sql.VarBinary, null);
        }

        // Insert data into the database
        await request.query(`
            INSERT INTO Appointments (
                app_ID, app_transactionType, app_documentType, app_date, app_timeFrom, app_timeTo,
                app_firstName, app_middleName, app_lastName, app_dateOfBirth, app_age, app_gender,
                app_placeOfBirth, app_citizenship, app_email, app_mobileNumber, app_whatsAppNumber,
                app_telegramNumber, app_houseStreet, app_barangay, app_municipalityCity, app_province,
                app_studentIdNumber, app_collegeDepartment, app_course, app_classification, app_dateOfGraduation,
                app_academicDistinction, app_highschoolGraduated, app_transfereeSchool, app_lastSemesterAttended,
                app_purposeOfRequest, app_authenticationOfDocument, app_documentFileName, app_document,
                app_authCertificateFileName, app_authCertificateDocument, app_authTranscriptRecordsFileName,
                app_authTranscriptRecordsDocument, app_authDiplomaFileName, app_authDiplomaDocument,
                app_certificateRegistrationSemester, app_reportGradeSemester, app_specialRequestDocumentType,
                app_specialRequestCopies, app_status
            ) VALUES (
                @app_ID, @app_transactionType, @app_documentType, @app_date, @app_timeFrom, @app_timeTo,
                @app_firstName, @app_middleName, @app_lastName, @app_dateOfBirth, @app_age, @app_gender,
                @app_placeOfBirth, @app_citizenship, @app_email, @app_mobileNumber, @app_whatsAppNumber,
                @app_telegramNumber, @app_houseStreet, @app_barangay, @app_municipalityCity, @app_province,
                @app_studentIdNumber, @app_collegeDepartment, @app_course, @app_classification, @app_dateOfGraduation,
                @app_academicDistinction, @app_highschoolGraduated, @app_transfereeSchool, @app_lastSemesterAttended,
                @app_purposeOfRequest, @app_authenticationOfDocument, @app_documentFileName, @app_document,
                @app_authCertificateFileName, @app_authCertificateDocument, @app_authTranscriptRecordsFileName,
                @app_authTranscriptRecordsDocument, @app_authDiplomaFileName, @app_authDiplomaDocument, 
                @app_certificateRegistrationSemester, @app_reportGradeSemester, @app_specialRequestDocumentType,
                @app_specialRequestCopies, @app_status
            )
        `);

        res.status(200).json({ success: true, message: 'Data submitted successfully' });
    } catch (error) {
        console.error('Error inserting data into the database:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));