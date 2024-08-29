const express = require('express');
const sql = require('mssql');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

            // Assuming all time slots are 08:00-09:00 to 16:00-17:00 (8 slots)
            const totalSlots = 8;
            const bookedCount = bookedSlots.length;
            const isFullyBooked = bookedSlots.length === totalSlots;
            const isPartiallyBooked = bookedCount >= 4 && bookedCount < 8;

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

// Server endpoint where it submits the appointment to the registrar
app.post('/api/submit', async (req, res) => {
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
        course,
        email,
        mobileNumber,
        houseStreet,
        barangay,
        city,
        province,
        document,
        docFileName,
        status
    } = req.body;

    try {
        // Connect to the database
        await sql.connect(dbConfig);

        // Insert data into the Appointments table
        await sql.query`
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
                app_course,
                app_email,
                app_mobileNumber,
                app_houseStreet,
                app_barangay,
                app_municipalityCity,
                app_province,
                app_status
            ) VALUES (
                ${appointmentID},
                ${transactionType},
                ${appointmentDate},
                ${timeFrom},
                ${timeTo},
                ${firstName},
                ${middleName},
                ${lastName},
                ${dob},
                ${gender},
                ${age},
                ${course},
                ${email},
                ${mobileNumber},
                ${houseStreet},
                ${barangay},
                ${city},
                ${province},
                ${status}
            )`;

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