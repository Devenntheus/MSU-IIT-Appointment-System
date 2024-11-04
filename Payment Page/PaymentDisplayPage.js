// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Call the validation function
    validateTransactionType();

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
        window.location.href = "../Summary Page/SummaryPage.html"; // Redirect to SummaryPage.html
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
