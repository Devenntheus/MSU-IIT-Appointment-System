document.addEventListener('DOMContentLoaded', function () {
    
    // Call the validation function
    validateTransactionType();

    const cancelButton = document.getElementById('cancel-btn');
    const confirmCancelButton = document.getElementById('confirm-cancel-btn');
    const cancelConfirmationModal = document.getElementById('cancelConfirmationModal');

    cancelButton.addEventListener('click', () => {
        cancelConfirmationModal.style.display = 'block'; // Show the modal
    });

    confirmCancelButton.addEventListener('click', () => {
        sessionStorage.clear();
        console.log('CANCELLED BOOKING: SESSION STORAGE CLEARED');
        window.location.href = '../Transaction Entry Page/TransactionEntryPage.html';
    });


    // Retrieve all session values
    const transactionType = sessionStorage.getItem('transactionType') || 'N/A';
    const documentType = sessionStorage.getItem('documentType') || 'N/A';
    const cert12_16Value = sessionStorage.getItem('Cert1216') || 'N/A';

    // Retrieve session values from Scheduling Page
    const appointmentDate = sessionStorage.getItem('appointmentDate') || 'N/A';
    const timeFrom = sessionStorage.getItem('timeFrom') || 'N/A';
    const timeTo = sessionStorage.getItem('timeTo') || 'N/A';

    // Retrieve session values from Required Documents Page
    const documentFileName = sessionStorage.getItem('docFileName') || 'N/A';
    const documentContents = sessionStorage.getItem('document') || 'N/A';

    // Retrieve session values from Personal Info Page
    const firstName = sessionStorage.getItem('firstName') || 'N/A';
    const middleName = sessionStorage.getItem('middleName') || 'N/A';
    const lastName = sessionStorage.getItem('lastName') || 'N/A';
    const gender = sessionStorage.getItem('gender') || 'N/A';
    const dateOfBirth = sessionStorage.getItem('dob') || 'N/A';
    const age = sessionStorage.getItem('age') || 'N/A';
    const placeOfBirth = sessionStorage.getItem('placeOfBirth') || 'N/A';
    const citizenship = sessionStorage.getItem('citizenship') || 'N/A';
    const email = sessionStorage.getItem('email') || 'N/A';
    const mobileNumber = sessionStorage.getItem('mobileNumber') || 'N/A';
    const whatsAppNumber = sessionStorage.getItem('whatsAppNumber') || 'N/A';
    const telegramNumber = sessionStorage.getItem('telegramNumber') || 'N/A';
    const houseStreet = sessionStorage.getItem('houseStreet') || 'N/A';
    const barangay = sessionStorage.getItem('barangay') || 'N/A';
    const municipalityCity = sessionStorage.getItem('municipalityCity') || 'N/A';
    const province = sessionStorage.getItem('province') || 'N/A';

    // Retrieve session values from Academic Info Page
    const studentID = sessionStorage.getItem('studentId') || 'N/A';
    const collegeDepartment = sessionStorage.getItem('department') || 'N/A';
    const course = sessionStorage.getItem('course') || 'N/A';
    const classification = sessionStorage.getItem('studentAlumni') || 'N/A';
    const dateOfGraduation = sessionStorage.getItem('dateGraduation') || 'N/A';
    const academicDistinction = sessionStorage.getItem('honor') || 'N/A';
    const highschoolGraduated = sessionStorage.getItem('school') || 'N/A';
    const transfereeSchool = sessionStorage.getItem('transfereeSchool') || 'N/A';
    const lastSemesterAttended = sessionStorage.getItem('lastSemAttended') || 'N/A';

    // Retrieve session values from Document Request Page
    const purposeOfRequest = sessionStorage.getItem('purpose') || 'N/A';
    const authenticationOfDocument = sessionStorage.getItem('authDocuments') || 'N/A';  
    const certificateAuthFileName = sessionStorage.getItem('certificateAuthFileName') || 'N/A';
    const certificateAuthFileContent = sessionStorage.getItem('certificateAuthFileContents') || 'N/A';
    const transcriptRecordsAuthFileName = sessionStorage.getItem('transcriptRecordsAuthFileName') || 'N/A';
    const transcriptRecordsAuthFileContents = sessionStorage.getItem('transcriptRecordsAuthFileContents') || 'N/A';
    const diplomaAuthFileName = sessionStorage.getItem('diplomaAuthFileName') || 'N/A';
    const diplomaAuthFileContents = sessionStorage.getItem('diplomaAuthFileContents') || 'N/A';
    const reportGradeSemester = sessionStorage.getItem('grades') || 'N/A';
    const certificateRegistrationSemester = sessionStorage.getItem('certificate') || 'N/A';
    const specialRequestDocumentType = sessionStorage.getItem('requestDocuments') || 'N/A';
    const specialRequestCopies = sessionStorage.getItem('specialRequests') || 'N/A';

    // Display retrieved Transaction/Document Type
    document.getElementById('transaction-type').textContent = transactionType;

    const documentTypeCert12_16 = "Cert. 12.16";
    if(documentType === documentTypeCert12_16){
        document.getElementById('document-type').textContent = documentType + ": " + cert12_16Value;
    } else{
        document.getElementById('document-type').textContent = documentType;
    }
    
    document.getElementById('document-file').textContent = documentFileName;

    // Display retrieved Appointment Schedule
    document.getElementById('appointment-date').textContent = appointmentDate;
    document.getElementById('appointment-time').textContent = `${timeFrom} - ${timeTo}`;

    // Display retrieved Personal Info
    document.getElementById('full-name').textContent = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
    document.getElementById('gender').textContent = gender;
    document.getElementById('date-of-birth').textContent = dateOfBirth;
    document.getElementById('age').textContent = age;
    document.getElementById('place-of-birth').textContent = placeOfBirth;
    document.getElementById('citizenship').textContent = citizenship;

    // Display retrieved Contact Info
    document.getElementById('email').textContent = email;
    document.getElementById('mobile-number').textContent = mobileNumber;
    document.getElementById('whatsapp-number').textContent = whatsAppNumber;
    document.getElementById('telegram-number').textContent = telegramNumber;

    // Display retrieved Address Info
    document.getElementById('house-street').textContent = houseStreet;
    document.getElementById('barangay').textContent = barangay;
    document.getElementById('city').textContent = municipalityCity;
    document.getElementById('province').textContent = province;

    // Display retrieved Academic Info
    document.getElementById('id-number').textContent = studentID;
    document.getElementById('department').textContent = collegeDepartment;
    document.getElementById('course').textContent = course;
    document.getElementById('classification').textContent = classification;
    document.getElementById('date-graduation').textContent = dateOfGraduation;
    document.getElementById('academic-distinction').textContent = academicDistinction;
    document.getElementById('highschool-graduated').textContent = highschoolGraduated;
    document.getElementById('transferee-school').textContent = transfereeSchool;
    document.getElementById('last-sem-attended').textContent = lastSemesterAttended;

    // Display retrieved Document Request
    document.getElementById('purpose').textContent = purposeOfRequest;
    document.getElementById('authentication-of-doc').textContent = authenticationOfDocument;

    // Set up file names based on conditions
    function setFileName(element, fileName, fileContent) {
        if (fileContent && fileContent !== 'N/A') {
            element.href = createBlobUrl(fileContent, 'application/pdf');
            element.textContent = fileName;
            element.download = fileName;
        } else {
            element.textContent = ''; // Do not display N/A if no file is uploaded
        }
    }

    // Call the function for each file
    setFileName(document.getElementById('document-file'), documentFileName, documentContents);
    setFileName(document.getElementById('certificate-registration-file'), certificateAuthFileName, certificateAuthFileContent);
    setFileName(document.getElementById('transcript-records-file'), transcriptRecordsAuthFileName, transcriptRecordsAuthFileContents);
    setFileName(document.getElementById('diploma-file'), diplomaAuthFileName, diplomaAuthFileContents);

    document.getElementById('certificate-registration-sem').textContent = certificateRegistrationSemester;
    document.getElementById('report-grade-sem').textContent = reportGradeSemester;
    document.getElementById('special-req-doc-type').textContent = specialRequestDocumentType;
    document.getElementById('special-req-doc-copies').textContent = specialRequestCopies;

    // Blob URL for the document contents
    function createBlobUrl(base64Content, mimeType) {
        const byteCharacters = atob(base64Content.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        return URL.createObjectURL(blob);
    }

    // Document download links
    const documentFileElement = document.getElementById('document-file');
    const certificateRegistrationFileElement = document.getElementById('certificate-registration-file');
    const transcriptRecordsFileElement = document.getElementById('transcript-records-file');
    const diplomaFileElement = document.getElementById('diploma-file');

    if (documentContents && documentContents !== 'N/A') {
        documentFileElement.href = createBlobUrl(documentContents, 'application/pdf');
        documentFileElement.textContent = documentFileName;
        documentFileElement.download = documentFileName;
    } else {
        documentFileElement.textContent = ''; // Do not display N/A if no file is uploaded
    }

    if (certificateAuthFileContent !== 'N/A') {
        certificateRegistrationFileElement.href = createBlobUrl(certificateAuthFileContent, 'application/pdf');
        certificateRegistrationFileElement.textContent = certificateAuthFileName;
        certificateRegistrationFileElement.download = certificateAuthFileName;
    } else {
        certificateRegistrationFileElement.textContent = 'N/A';
    }

    if (transcriptRecordsAuthFileContents !== 'N/A') {
        transcriptRecordsFileElement.href = createBlobUrl(transcriptRecordsAuthFileContents, 'application/pdf');
        transcriptRecordsFileElement.textContent = transcriptRecordsAuthFileName;
        transcriptRecordsFileElement.download = transcriptRecordsAuthFileName;
    } else {
        transcriptRecordsFileElement.textContent = 'N/A';
    }

    if (diplomaAuthFileContents !== 'N/A') {
        diplomaFileElement.href = createBlobUrl(diplomaAuthFileContents, 'application/pdf');
        diplomaFileElement.textContent = diplomaAuthFileName;
        diplomaFileElement.download = diplomaAuthFileName;
    } else {
        diplomaFileElement.textContent = 'N/A';
    }

    // Generate appointment ID
    function generateAppointmentID(counter) {
        const date = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '');
        const paddedCounter = String(counter).padStart(3, '0');
        return `APPT${paddedCounter}-${date}`;
    }

    // Retrieve counter from the server or session (for simplicity, assuming counter = 1)
    const appointmentID = generateAppointmentID(1);

    const submitButton = document.getElementById('submit-btn');

    submitButton.addEventListener('click', () => {
        const formData = new FormData();

        formData.append('appointmentID', appointmentID);
        formData.append('transactionType', transactionType);
        formData.append('documentType', documentType);

        // Convert and append the requested document
        if (documentContents !== 'N/A') {
            const byteCharacters = atob(documentContents.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
            const documentBlob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
            formData.append('documentFile', documentBlob, documentFileName);
        }

        formData.append('appointmentDate', appointmentDate);
        formData.append('timeFrom', timeFrom);
        formData.append('timeTo', timeTo);

        formData.append('firstName', firstName);
        formData.append('middleName', middleName);
        formData.append('lastName', lastName);
        formData.append('gender', gender);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('age', age);
        formData.append('placeOfBirth', placeOfBirth);
        formData.append('citizenship', citizenship);

        formData.append('email', email);
        formData.append('mobileNumber', mobileNumber);
        formData.append('whatsAppNumber', whatsAppNumber);
        formData.append('telegramNumber', telegramNumber);

        formData.append('houseStreet', houseStreet);
        formData.append('barangay', barangay);
        formData.append('municipalityCity', municipalityCity);
        formData.append('province', province);
        
        formData.append('studentID', studentID);
        formData.append('collegeDepartment', collegeDepartment);
        formData.append('course', course);
        formData.append('classification', classification);
        formData.append('dateOfGraduation', dateOfGraduation);
        formData.append('academicDistinction', academicDistinction);
        formData.append('highschoolGraduated', highschoolGraduated);
        formData.append('transfereeSchool', transfereeSchool);
        formData.append('lastSemesterAttended', lastSemesterAttended);

        formData.append('purposeOfRequest', purposeOfRequest);
        formData.append('authenticationOfDocument', authenticationOfDocument);

        // Convert and append the certificate document
        if (certificateAuthFileContent !== 'N/A') {
            const certByteCharacters = atob(certificateAuthFileContent.split(',')[1]);
            const certByteNumbers = new Array(certByteCharacters.length).fill().map((_, i) => certByteCharacters.charCodeAt(i));
            const certBlob = new Blob([new Uint8Array(certByteNumbers)], { type: 'application/pdf' });
            formData.append('certificateRegistrationFile', certBlob, certificateAuthFileName);
        }

        // Convert and append the transcript document
        if (transcriptRecordsAuthFileContents !== 'N/A') {
            const transcriptByteCharacters = atob(transcriptRecordsAuthFileContents.split(',')[1]);
            const transcriptByteNumbers = new Array(transcriptByteCharacters.length).fill().map((_, i) => transcriptByteCharacters.charCodeAt(i));
            const transcriptBlob = new Blob([new Uint8Array(transcriptByteNumbers)], { type: 'application/pdf' });
            formData.append('transcriptRecordsFile', transcriptBlob, transcriptRecordsAuthFileName);
        }

        // Convert and append the diploma document
        if (diplomaAuthFileContents !== 'N/A') {
            const diplomaByteCharacters = atob(diplomaAuthFileContents.split(',')[1]);
            const diplomaByteNumbers = new Array(diplomaByteCharacters.length).fill().map((_, i) => diplomaByteCharacters.charCodeAt(i));
            const diplomaBlob = new Blob([new Uint8Array(diplomaByteNumbers)], { type: 'application/pdf' });
            formData.append('diplomaFile', diplomaBlob, diplomaAuthFileName);
        }

        formData.append('certificateRegistrationSemester', certificateRegistrationSemester);
        formData.append('reportGradeSemester', reportGradeSemester);
        formData.append('specialRequestDocumentType', specialRequestDocumentType);
        formData.append('specialRequestCopies', specialRequestCopies);
        formData.append('status', 'Pending');

        fetch('http://localhost:3001/api/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.success) {
                alert(`Appointment submitted successfully!`);
            } else {
                alert('There was an error submitting the appointment.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // // Submit button to send data
    // document.querySelector('.submit-button').addEventListener('click', function () {
        
    // });
});

// Function to validate if "transactionType" exists in sessionStorage
function validateTransactionType() {
    if (!sessionStorage.getItem('transactionType')) {
        // Redirect to the transaction entry page if "transactionType" is not found
        window.location.href = '../Transaction Entry Page/TransactionEntryPage.html';
        return;
    }
}

// Function to close the modal
function closeModal() {
    document.getElementById('cancelConfirmationModal').style.display = 'none';
}
