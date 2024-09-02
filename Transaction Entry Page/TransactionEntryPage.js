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
            // Display the transaction type in the console
            console.log('Transaction Type:', transactionType);
            // Store the transaction type in sessionStorage
            sessionStorage.setItem('transactionType', transactionType);
            // Redirect to the scheduling page
            window.location.href = '../Scheduling Page/SchedulingPage.html';
        });
    });
});
