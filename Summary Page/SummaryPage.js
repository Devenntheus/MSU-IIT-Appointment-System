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
    const docFileName = sessionStorage.getItem('docFileName');
    const documentContents = sessionStorage.getItem('document');

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
        const formData = new FormData();

        formData.append('appointmentID', appointmentID);
        formData.append('transactionType', transactionType);
        formData.append('appointmentDate', appointmentDate);
        formData.append('timeFrom', timeFrom);
        formData.append('timeTo', timeTo);
        formData.append('firstName', firstName);
        formData.append('middleName', middleName);
        formData.append('lastName', lastName);
        formData.append('dob', dob);
        formData.append('gender', gender);
        formData.append('age', age);
        formData.append('department', department);
        formData.append('course', course);
        formData.append('email', email);
        formData.append('mobileNumber', mobileNumber);
        formData.append('houseStreet', houseStreet);
        formData.append('barangay', barangay);
        formData.append('city', city);
        formData.append('province', province);
        formData.append('status', 'Pending');

        // Convert documentContents from base64 to Blob
        const byteCharacters = atob(documentContents.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const documentBlob = new Blob([byteArray], { type: 'application/pdf' });

        formData.append('document', documentBlob, docFileName);

        fetch('http://localhost:3001/api/submit', {
            method: 'POST',
            body: formData
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