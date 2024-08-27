document.addEventListener('DOMContentLoaded', function () {
    // Event listener for the 'Next' button
    document.querySelector('.next-button').addEventListener('click', function () {
        // Get form values
        const studentId = document.getElementById('student-id').value;
        const firstName = document.getElementById('first-name').value;
        const middleName = document.getElementById('middle-name').value;
        const lastName = document.getElementById('last-name').value;
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        const age = document.getElementById('age').value;
        const course = document.getElementById('course').value;
        const email = document.getElementById('email').value;
        const mobileNumber = document.getElementById('mobile-number').value;
        const houseStreet = document.getElementById('house-street').value;
        const barangay = document.getElementById('barangay').value;
        const city = document.getElementById('city').value;
        const province = document.getElementById('province').value;

        // Store values in session storage
        sessionStorage.setItem('studentId', studentId);
        sessionStorage.setItem('firstName', firstName);
        sessionStorage.setItem('middleName', middleName);
        sessionStorage.setItem('lastName', lastName);
        sessionStorage.setItem('dob', dob);
        sessionStorage.setItem('gender', gender);
        sessionStorage.setItem('age', age);
        sessionStorage.setItem('course', course);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('mobileNumber', mobileNumber);
        sessionStorage.setItem('houseStreet', houseStreet);
        sessionStorage.setItem('barangay', barangay);
        sessionStorage.setItem('city', city);
        sessionStorage.setItem('province', province);

        // Redirect to SummaryPage.html
        window.location.href = '../Summary Page/SummaryPage.html';
    });
});