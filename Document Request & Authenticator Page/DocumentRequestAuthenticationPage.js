document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('next-btn');

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
        const uploadFile = document.getElementById('upload').files[0];
        let fileName = "";
        let fileContents = "";

        if (uploadFile) {
            fileName = uploadFile.name;
            const reader = new FileReader();
            reader.onload = function(e) {
                fileContents = e.target.result;

                // Store the file contents as Base64 in sessionStorage
                sessionStorage.setItem('uploadAuthFileContents', fileContents);
                sessionStorage.setItem('uploadAuthFileName', fileName);

                // Proceed with storing other inputs and redirect
                storeInputsAndRedirect(purpose, grades, certificate, specialRequests, authDocuments, requestDocuments);
            }
            reader.readAsDataURL(uploadFile); // Read file as data URL for Base64 encoding
        } else {
            // Proceed with storing other inputs and redirect if no file is uploaded
            storeInputsAndRedirect(purpose, grades, certificate, specialRequests, authDocuments, requestDocuments);
        }
    });

    function storeInputsAndRedirect(purpose, grades, certificate, specialRequests, authDocuments, requestDocuments) {
        // Storing all the data in sessionStorage
        sessionStorage.setItem('purpose', purpose);
        sessionStorage.setItem('grades', grades);
        sessionStorage.setItem('certificate', certificate);
        sessionStorage.setItem('specialRequests', specialRequests);
        sessionStorage.setItem('authDocuments', authDocuments.join(', '));
        sessionStorage.setItem('requestDocuments', requestDocuments.join(', '));

        // Debugging logs
        console.log('Purpose:', purpose);
        console.log('Grades:', grades);
        console.log('Certificate:', certificate);
        console.log('Special Requests:', specialRequests);
        console.log('Authentication Documents:', authDocuments.join(', '));
        console.log('Request Documents:', requestDocuments.join(', '));
        console.log('Upload File Name:', sessionStorage.getItem('uploadAuthFileName')); // corrected key
        console.log('Upload File Contents:', sessionStorage.getItem('uploadAuthFileContents')); // corrected key

        // Redirect to the next page
        window.location.href = '../Summary Page/SummaryPage.html';
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