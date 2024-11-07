document.addEventListener('DOMContentLoaded', () => {
    // Call the validation function
    validateTransactionType();

    const nextButton = document.getElementById('next-btn');
    const cancelButton = document.getElementById('cancel-btn');
    const confirmCancelButton = document.getElementById('confirm-cancel-btn');
    const cancelConfirmationModal = document.getElementById('cancelConfirmationModal');

    const authDiplomaCheckbox = document.getElementById('authDiploma');
    const diplomaSection = document.getElementById('diplomaAuthentication');
    const authCertificateCheckbox = document.getElementById('authCertificate');
    const certificateSection = document.getElementById('certificateAuthentication');
    const authTranscriptRecordsCheckbox = document.getElementById('authTranscriptRecords');
    const transcriptRecordsSection = document.getElementById('transcriptRecordsAuthentication');

    const errorMessages = {
        certificate: 'Please upload a certificate file.',
        transcript: 'Please upload a transcript file.',
        diploma: 'Please upload a diploma file.'
    };

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

    cancelButton.addEventListener('click', () => {
        cancelConfirmationModal.style.display = 'block'; // Show the modal
    });

    confirmCancelButton.addEventListener('click', () => {
        sessionStorage.clear();
        console.log('CANCELLED BOOKING: SESSION STORAGE CLEARED');
        window.location.href = '../Transaction Entry Page/TransactionEntryPage.html';
    });

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

        let isValid = true;

        // Validate upload certificate
        if (authCertificateCheckbox.checked && !uploadCertificate) {
            document.getElementById('error-upload-certificate').innerText = errorMessages.certificate;
            document.getElementById('error-upload-certificate').style.visibility = 'visible';
            isValid = false;
        } else {
            document.getElementById('error-upload-certificate').innerText = '';
            document.getElementById('error-upload-certificate').style.visibility = 'hidden';
        }

        // Validate upload transcript
        if (authTranscriptRecordsCheckbox.checked && !uploadTranscriptRecords) {
            document.getElementById('error-upload-transcript').innerText = errorMessages.transcript;
            document.getElementById('error-upload-transcript').style.visibility = 'visible';
            isValid = false;
        } else {
            document.getElementById('error-upload-transcript').innerText = '';
            document.getElementById('error-upload-transcript').style.visibility = 'hidden';
        }

        // Validate upload diploma
        if (authDiplomaCheckbox.checked && !uploadDiploma) {
            document.getElementById('error-upload-diploma').innerText = errorMessages.diploma;
            document.getElementById('error-upload-diploma').style.visibility = 'visible';
            isValid = false;
        } else {
            document.getElementById('error-upload-diploma').innerText = '';
            document.getElementById('error-upload-diploma').style.visibility = 'hidden';
        }

        if (isValid) {
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
        }
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