document.addEventListener('DOMContentLoaded', () => {
    const transactionCards = document.querySelectorAll('.schoolCard .card');

    transactionCards.forEach(card => {
        card.addEventListener('click', function() {
            const transactionType = this.getAttribute('data-transaction');
            // Store the transaction type in sessionStorage
            sessionStorage.setItem('transactionType', transactionType);
            // Redirect to the scheduling page
            window.location.href = '../Scheduling Page/SchedulingPage.html';
        });
    });
});
