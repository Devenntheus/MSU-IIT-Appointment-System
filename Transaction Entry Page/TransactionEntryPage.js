document.addEventListener('DOMContentLoaded', () => {
    // Clear the transaction type from sessionStorage if it exists
    if (sessionStorage.getItem('transactionType')) {
        sessionStorage.removeItem('transactionType');
        console.log('Removed previous transaction type');
    }

    const transactionCards = document.querySelectorAll('.schoolCard .card');

    transactionCards.forEach(card => {
        card.addEventListener('click', function() {
            const transactionType = this.getAttribute('data-transaction');
            // Store the transaction type in sessionStorage
            sessionStorage.setItem('transactionType', transactionType);
            // Check if the transaction type is "Document Request"
            if (transactionType === "Document Request") {
                // Redirect to the Document Type page
                window.location.href = '../Document Type Page/DocumentTypePage.html';
            } else {
                // Redirect to the required documents page
                window.location.href = '../Required Documents Page/RequiredDocumentsPage.html';
            }
        });
    });
});