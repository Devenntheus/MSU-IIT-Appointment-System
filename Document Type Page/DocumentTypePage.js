document.addEventListener('DOMContentLoaded', () => {
    // Call the validation function
    validateTransactionType();

    // Clear previous document types and input value from sessionStorage if they exist
    if (sessionStorage.getItem('documentType')) {
        sessionStorage.removeItem('documentType');
        console.log('Removed previous document type');
    }
    if (sessionStorage.getItem('Cert1216')) {
        sessionStorage.removeItem('Cert1216');
        console.log('Removed previous Cert. 12.16 value');
    }

    const nextButton = document.getElementById('next-btn');
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
    
    nextButton.addEventListener('click', () => {
        const selectedDocumentTypes = [];
        const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
        
        checkboxes.forEach(checkbox => {
            selectedDocumentTypes.push(checkbox.value);
        });
        
        // Get the value of the Cert. 12.16 input field
        const cert12_16Value = document.getElementById('cert-12-16').value.trim();

        // Add default "Cert. 12.16" if no checkbox is selected
        if (selectedDocumentTypes.length === 0) {
            selectedDocumentTypes.push("Cert. 12.16");
        }
        
        // Include Cert. 12.16 in the selected document types if it has a value
        if (cert12_16Value) {
            selectedDocumentTypes.push(cert12_16Value);
        } else {
            const errorMessage = document.getElementById('error-school-address');
            errorMessage.textContent = 'Please provide the name and address of the requesting school.';
            errorMessage.style.visibility = 'visible';
            return;
        }
        
        // Create a string from the selected document types
        const documentType = selectedDocumentTypes.join(', ');

        // Store the document type in sessionStorage
        sessionStorage.setItem('documentType', documentType);
        
        // Store the Cert. 12.16 input value in sessionStorage
        sessionStorage.setItem('Cert1216', cert12_16Value);
        
        // Redirect to the scheduling page
        window.location.href = '../Required Documents Page/RequiredDocumentsPage.html';
    });
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