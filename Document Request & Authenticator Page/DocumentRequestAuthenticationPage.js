document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('next-btn');
    const authDiplomaCheckbox = document.getElementById('authDiploma');
    const diplomaSection = document.getElementById('diplomaAuthentication');
    const authCertificateCheckbox = document.getElementById('authCertificate');
    const certificateSection = document.getElementById('certificateAuthentication');
    const authTranscriptRecordsCheckbox = document.getElementById('authTranscriptRecords');
    const transcriptRecordsSection = document.getElementById('transcriptRecordsAuthentication');

    // Function to toggle the display of sections based on checkbox state
    function toggleSection(checkbox, section) {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    // Attach event listeners to checkboxes
    toggleSection(authDiplomaCheckbox, diplomaSection);
    toggleSection(authCertificateCheckbox, certificateSection);
    toggleSection(authTranscriptRecordsCheckbox, transcriptRecordsSection);

    nextButton.addEventListener('click', () => {
        // Collecting all the data from inputs and checkboxes
        const purpose = document.getElementById('purpose').value;
        const grades = document.getElementById('grades').value;
        const certificate = document.getElementById('certificate').value;
        const specialRequests = document.getElementById('special-requests').value;

        // Collecting selected checkboxes for Authentication of Document
        const authDocuments = [];
        const authCheckboxes = document.querySelectorAll('.auth-checkbox:checked');
        authCheckboxes.forEach(checkbox => {
            authDocuments.push(checkbox.value);
        });

        // Collecting selected checkboxes for Request for Document
        const requestDocuments = [];
        const requestCheckboxes = document.querySelectorAll('.request-checkbox:checked');
        requestCheckboxes.forEach(checkbox => {
            requestDocuments.push(checkbox.value);
        });

        // Collecting file details and reading file content
        const uploadCertificate = document.getElementById('uploadCertificate').files[0];
        const uploadTranscriptRecords = document.getElementById('uploadTranscriptRecords').files[0];
        const uploadDiploma = document.getElementById('uploadDiploma').files[0];

        const fileReaders = [];
        
        if (uploadCertificate) {
            fileReaders.push(readAndStoreFile(uploadCertificate, 'certificateAuthFileName', 'certificateAuthFileContents'));
        }
        
        if (uploadTranscriptRecords) {
            fileReaders.push(readAndStoreFile(uploadTranscriptRecords, 'transcriptRecordsAuthFileName', 'transcriptRecordsAuthFileContents'));
        }

        if (uploadDiploma) {
            fileReaders.push(readAndStoreFile(uploadDiploma, 'diplomaAuthFileName', 'diplomaAuthFileContents'));
        }

        // Wait for all file readers to complete before storing inputs and redirecting
        Promise.all(fileReaders).then(() => {
            storeInputsAndRedirect(purpose, grades, certificate, specialRequests, authDocuments, requestDocuments);
        }).catch((error) => {
            console.error('Error reading files:', error);
        });
    });

    function readAndStoreFile(file, fileNameKey, fileContentsKey) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileContents = e.target.result;
                sessionStorage.setItem(fileNameKey, file.name);
                sessionStorage.setItem(fileContentsKey, fileContents);
                resolve();
            };
            reader.onerror = function(e) {
                reject(e);
            };
            reader.readAsDataURL(file);
        });
    }

    function storeInputsAndRedirect(purpose, grades, certificate, specialRequests, authDocuments, requestDocuments) {
        // Storing all the data in sessionStorage
        sessionStorage.setItem('purpose', purpose);
        sessionStorage.setItem('grades', grades);
        sessionStorage.setItem('certificate', certificate);
        sessionStorage.setItem('specialRequests', specialRequests);
        sessionStorage.setItem('authDocuments', authDocuments.join(', '));
        sessionStorage.setItem('requestDocuments', requestDocuments.join(', '));

        // Redirect to the next page
        window.location.href = '../Payment Page/PaymentDisplayPage.html';
    }
});

// Function to convert Base64 to Blob
function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const base64Data = b64Data.split(',')[1] || b64Data;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}