document.addEventListener('DOMContentLoaded', function() {
    const transactionType = sessionStorage.getItem('transactionType');

    if (transactionType) {
        fetch(`http://localhost:3001/api/checkDocument`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionType: transactionType })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.fileName && data.file) {
                const fileNameInput = document.getElementById('file-label');
                const downloadLink = document.getElementById('download-link');
                const fileIcon = document.getElementById('file-icon');

                fileNameInput.value = data.fileName;
                const blob = b64toBlob(data.file, 'application/octet-stream');
                const url = URL.createObjectURL(blob);

                downloadLink.href = url;
                downloadLink.setAttribute('download', data.fileName);

                fileIcon.addEventListener('click', () => downloadLink.click());
                fileNameInput.addEventListener('click', () => downloadLink.click());
            } else {
                alert('Document not found');
            }
        })
        .catch(error => {
            console.error('Error fetching document:', error);
            alert('Error fetching document: ' + error.message);
        });
    } else {
        // alert('Transaction type not found');
        // Call the validation function
        console.log('No Transaction Type Detected');
        validateTransactionType();
    }

    const fileInput = document.querySelector('.file-input');
    const progressFileName = document.getElementById('progress-file-name');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressBar = document.getElementById('progress-bar');
    const errorMessage = document.getElementById('error-message');
    const nextBtn = document.getElementById('next-btn');
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

    let fileName = '';
    let fileContent = '';
    let uploadProgress = 0;

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            fileName = file.name;
            progressFileName.textContent = fileName;

            const reader = new FileReader();
            let progress = 0;
            let progressBar = 0;

            reader.onload = function(e) {
                fileContent = e.target.result;
                // Simulate upload progress
                const interval = setInterval(function() {
                    if (progress < 100) {
                        progress += 1; // Increase progress by 1%
                        progressBar += 20; // Increase progress bar by 20%
                        uploadProgress = progress; // Update the progress
                        updateProgress(progress);
                        updateProgressBarPercentage(progressBar);
                    } else {
                        clearInterval(interval);
                        uploadProgress = 100; // Ensure it ends at 100%
                        updateProgress(100); // Ensure it ends at 100%
                    }
                }, 30); // Update progress every 30ms
            };

            reader.onerror = function(e) {
                console.error('Error reading file:', e);
                alert('Error reading file.');
            };

            reader.readAsDataURL(file);
        }
    });

    function updateProgressBarPercentage(percent) {
        progressBar.style.width = `${percent}%`;
    }

    function updateProgress(percent) {
        progressPercentage.textContent = `${percent}%`;     
    }

    nextBtn.addEventListener('click', function() {
        if (fileName && fileContent && uploadProgress === 100) {
            sessionStorage.setItem('docFileName', fileName);
            sessionStorage.setItem('document', fileContent);
            window.location.href = '../Scheduling Page/SchedulingPage.html';
        } else {
            errorMessage.classList.add('error-show');
            setTimeout(() => {
                errorMessage.classList.remove('error-show');
            }, 3000);
        }
    });

    function b64toBlob(b64Data, contentType='', sliceSize=512) {
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
