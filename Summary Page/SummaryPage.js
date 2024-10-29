document.addEventListener('DOMContentLoaded', function () {
    
    // Retrieve all session values
    const transactionType = sessionStorage.getItem('transactionType') || 'N/A';
    const documentType = sessionStorage.getItem('documentType') || 'N/A';
    const cert12_16Value = sessionStorage.getItem('Cert1216') || 'N/A';

    // Retrieve session values from Scheduling Page
    const appointmentDate = sessionStorage.getItem('appointmentDate') || 'N/A';
    const timeFrom = sessionStorage.getItem('timeFrom') || 'N/A';
    const timeTo = sessionStorage.getItem('timeTo') || 'N/A';

    // Retrieve session values from Required Documents Page
    const docFileName = sessionStorage.getItem('docFileName') || 'N/A';
    const documentContents = sessionStorage.getItem('document') || 'N/A';

    // Retrieve session values from Personal Info Page
    const firstName = sessionStorage.getItem('firstName') || 'N/A';
    const middleName = sessionStorage.getItem('middleName') || 'N/A';
    const lastName = sessionStorage.getItem('lastName') || 'N/A';
    const gender = sessionStorage.getItem('gender') || 'N/A';
    const dob = sessionStorage.getItem('dob') || 'N/A';
    const age = sessionStorage.getItem('age') || 'N/A';
    const placeOfBirth = sessionStorage.getItem('placeOfBirth') || 'N/A';
    const citizenship = sessionStorage.getItem('citizenship') || 'N/A';
    const email = sessionStorage.getItem('email') || 'N/A';
    const mobileNumber = sessionStorage.getItem('mobileNumber') || 'N/A';
    const whatsAppNumber = sessionStorage.getItem('whatsAppNumber') || 'N/A';
    const telegramNumber = sessionStorage.getItem('telegramNumber') || 'N/A';
    const houseStreet = sessionStorage.getItem('houseStreet') || 'N/A';
    const barangay = sessionStorage.getItem('barangay') || 'N/A';
    const city = sessionStorage.getItem('municipalityCity') || 'N/A';
    const province = sessionStorage.getItem('province') || 'N/A';

    // Retrieve session values from Document Request Page
    const purpose = sessionStorage.getItem('purpose') || 'N/A';
    const grades = sessionStorage.getItem('grades') || 'N/A';
    const certificate = sessionStorage.getItem('certificate') || 'N/A';
    const specialRequests = sessionStorage.getItem('specialRequests') || 'N/A';
    const authDocuments = sessionStorage.getItem('authDocuments') || 'N/A';
    const requestDocuments = sessionStorage.getItem('requestDocuments') || 'N/A';
    const uploadFileName = sessionStorage.getItem('uploadAuthFileName') || 'N/A';
    const uploadFileContents = sessionStorage.getItem('uploadAuthFileContents') || 'N/A';

    // Display retrieved Transaction/Document Type
    document.getElementById('transaction-type').textContent = transactionType;
    document.getElementById('document-type').textContent = documentType;
    document.getElementById('document-file').textContent = docFileName;

    // Display retrieved Appointment Schedule
    document.getElementById('appointment-date').textContent = appointmentDate;
    document.getElementById('appointment-time').textContent = `${timeFrom} - ${timeTo}`;

    // Display retrieved Personal Info
    document.getElementById('full-name').textContent = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
    document.getElementById('gender').textContent = gender;
    document.getElementById('dob').textContent = dob;
    document.getElementById('age').textContent = age;
    document.getElementById('pob').textContent = placeOfBirth;
    document.getElementById('citizenship').textContent = citizenship;

    // Display retrieved Contact Info
    document.getElementById('email').textContent = email;
    document.getElementById('mobile-number').textContent = mobileNumber;
    document.getElementById('whatsapp-number').textContent = whatsAppNumber;
    document.getElementById('telegram-number').textContent = telegramNumber;

    // Display retrieved Address Info
    document.getElementById('house-street').textContent = houseStreet;
    document.getElementById('barangay').textContent = barangay;
    document.getElementById('city').textContent = city;
    document.getElementById('province').textContent = province;

    // Display retrieved Document Request
    document.getElementById('purpose').textContent = purpose;
    document.getElementById('auth-doc-type').textContent = requestDocuments;
    document.getElementById('auth-doc-file').textContent = uploadFileName;
    document.getElementById('certificate-registration').textContent = certificate;
    document.getElementById('report-grade').textContent = grades;
    document.getElementById('special-req-doc-type').textContent = authDocuments;
    document.getElementById('special-req-doc-copies').textContent = specialRequests;

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