document.addEventListener('DOMContentLoaded', function () {
    // Retrieve all session values
    const transactionType = sessionStorage.getItem('transactionType');
    const appointmentDate = sessionStorage.getItem('appointmentDate');
    const timeFrom = sessionStorage.getItem('timeFrom');
    const timeTo = sessionStorage.getItem('timeTo');
    const studentId = sessionStorage.getItem('studentId');
    const firstName = sessionStorage.getItem('firstName');
    const middleName = sessionStorage.getItem('middleName');
    const lastName = sessionStorage.getItem('lastName');
    const dob = sessionStorage.getItem('dob');
    const gender = sessionStorage.getItem('gender');
    const age = sessionStorage.getItem('age');
    const department = sessionStorage.getItem('department');
    const course = sessionStorage.getItem('course');
    const email = sessionStorage.getItem('email');
    const mobileNumber = sessionStorage.getItem('mobileNumber');
    const houseStreet = sessionStorage.getItem('houseStreet');
    const barangay = sessionStorage.getItem('barangay');
    const city = sessionStorage.getItem('city');
    const province = sessionStorage.getItem('province');

    // Display retrieved data
    document.getElementById('transaction-type').textContent = transactionType;
    document.getElementById('appointment-date').textContent = appointmentDate;
    document.getElementById('appointment-time').textContent = `${timeFrom} - ${timeTo}`;
    document.getElementById('student-id').textContent = studentId;
    document.getElementById('full-name').textContent = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
    document.getElementById('dob').textContent = dob;
    document.getElementById('gender').textContent = gender;
    document.getElementById('age').textContent = age;
    document.getElementById('course').textContent = course;
    document.getElementById('email').textContent = email;
    document.getElementById('mobile-number').textContent = mobileNumber;
    document.getElementById('house-street').textContent = houseStreet;
    document.getElementById('barangay').textContent = barangay;
    document.getElementById('city').textContent = city;
    document.getElementById('province').textContent = province;

    // Generate appointment ID
    function generateAppointmentID(counter) {
        const date = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '');
        const paddedCounter = String(counter).padStart(3, '0');
        return `APPT${paddedCounter}-${date}`;
    }

    // Retrieve counter from the server or session (for simplicity, assuming counter = 1)
    const appointmentID = generateAppointmentID(1);
    console.log('Generated Appointment ID:', appointmentID);

    // Set up the submit button to send data
    document.querySelector('.submit-button').addEventListener('click', function () {
        const requestData = {
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
            status: 'Pending'
        };

        console.log('Data to be sent:', requestData);

        fetch('http://localhost:3001/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.success) {
                alert(`Appointment submitted successfully! ID: ${data.appointmentID}`);
            } else {
                alert('There was an error submitting the appointment.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});