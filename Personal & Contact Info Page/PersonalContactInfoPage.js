document.addEventListener('DOMContentLoaded', function () {
    const firstName = document.getElementById('first-name');
    const middleName = document.getElementById('middle-name');
    const lastName = document.getElementById('last-name');
    const dobField = document.getElementById('dob');
    const ageField = document.getElementById('age');
    const emailField = document.getElementById('email');
    const emailError = document.getElementById('error-email');
    const departmentSelect = document.getElementById('filter-college-department');
    const courseSelect = document.getElementById('filter-course');
    const nextButton = document.getElementById('next');

    // Capitalize Words
    function capitalizeWords(input) {
        return input.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    function addCapitalizationListener(field) {
        field.addEventListener('input', function() {
            field.value = capitalizeWords(field.value);
        });
    }

    addCapitalizationListener(firstName);
    addCapitalizationListener(middleName);
    addCapitalizationListener(lastName);

    // Display calculated age
    dobField.addEventListener('change', function() {
        const dob = new Date(dobField.value);
        const age = calculateAge(dob);
        ageField.value = age;
    });

    // Calculations
    function calculateAge(dob) {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();
        
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        return age;
    }

    // Live validation for the email
    emailField.addEventListener('input', function() {
        if (!isValidEmail(emailField.value.trim())) {
            emailError.textContent = 'Valid email is required*';
            emailError.style.display = 'inline-block';
            emailField.classList.add('error-border');
        } else {
            emailError.textContent = '';
            emailError.style.display = 'none';
            emailField.classList.remove('error-border');
        }
    });
    
    // Email Format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    departmentSelect.addEventListener('change', function() {
        const selectedDepartment = this.value;
        updateCourses(selectedDepartment);
    });

    function updateCourses(department) {
        courseSelect.innerHTML = '<option value="default">- - - Select Course - - -</option>'; // Reset options

        if (departmentCourses[department]) {
            departmentCourses[department].forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                courseSelect.appendChild(option);
            });
        }
    }

    const departmentCourses = {
        'College of Arts & Social Sciences': [
            'GENERAL EDUCATION PROGRAM',
            'BACHELOR OF ARTS IN ENGLISH',
            'BACHELOR OF SCIENCE IN PSYCHOLOGY',
            'BACHELOR OF ARTS IN FILIPINO',
            'BACHELOR OF ARTS IN HISTORY',
            'BACHELOR OF ARTS IN POLITICAL SCIENCE'
        ],
        'Engineering': [
            'DIPLOMA IN CHEMICAL ENGINEERING TECHNOLOGY',
            'BACHELOR OF SCIENCE IN CIVIL ENGINEERING',
            'BACHELOR OF SCIENCE IN CERAMICS ENGINEERING',
            'BACHELOR OF SCIENCE IN CHEMICAL ENGINEERING',
            'BACHELOR OF SCIENCE IN COMPUTER ENGINEERING',
            'BACHELOR OF SCIENCE IN ELECTRONICS & COMMUNICATIONS ENGINEERING',
            'BACHELOR OF SCIENCE IN ELECTRICAL ENGINEERING',
            'BACHELOR OF SCIENCE IN MINING ENG\'G.',
            'BACHELOR OF SCIENCE IN ENVIRONMENTAL ENGINEERING TECHNOLOGY',
            'BACHELOR OF SCIENCE IN MECHANICAL ENGINEERING',
            'BACHELOR OF SCIENCE METALLURGICAL ENGINEERING'
        ],
        'College of Science & Mathematics': [
            'BACHELOR OF SCIENCE IN BIOLOGY (BOTANY)',
            'BACHELOR OF SCIENCE IN CHEMISTRY',
            'BACHELOR OF SCIENCE IN MATHEMATICS',
            'BACHELOR OF SCIENCE IN PHYSICS',
            'BACHELOR OF SCIENCE IN BIOLOGY (ZOOLOGY)',
            'BACHELOR OF SCIENCE IN BIOLOGY (MARINE)',
            'BACHELOR OF SCIENCE IN BIOLOGY (GENERAL)',
            'BACHELOR OF SCIENCE IN STATISTICS'
        ],
        'College of Science & Mathematics Graduate Programs': [
            'MASTER OF SCIENCE IN PHYSICS',
            'MASTER OF SCIENCE IN MARINE BIOLOGY',
            'DOCTOR OF PHILOSOPHY IN CHEMISTRY',
            'MASTER OF SCIENCE IN MATHEMATICS',
            'MASTER OF SCIENCE IN CHEMISTRY',
            'MASTER OF SCIENCE IN ENVIRONMENTAL SCIENCE',
            'MASTER OF SCIENCE IN BIOLOGY',
            'MASTER OF PHYSICS',
            'DOCTOR OF PHILOSOPHY IN MATHEMATICS',
            'MASTER OF MATHEMATICS',
            'MASTER OF APPLIED STATISTICS',
            'DOCTOR OF PHILOSOPHY IN PHYSICS',
            'DOCTOR OF PHILOSOPHY MAJOR IN BIOLOGY',
            'MASTER OF SCIENCE IN STATISTICS'
        ],
        'College of Education': [
            'BACHELOR OF SECONDARY EDUCATION (BIOLOGY)',
            'BACHELOR OF SCIENCE IN INDUSTRIAL EDUCATION (DRAFTING)',
            'BACHELOR OF SECONDARY EDUCATION (CHEMISTRY)',
            'BACHELOR OF SECONDARY EDUCATION (PHYSICS)',
            'BACHELOR OF SECONDARY EDUCATION (MATHEMATICS)',
            'BACHELOR OF SECONDARY EDUCATION (MAPEH)',
            'CERTIFICATE PROGRAM FOR TEACHERS',
            'BACHELOR OF SECONDARY EDUCATION (TLE)',
            'BACHELOR OF SECONDARY EDUCATION (GENERAL SCIENCE)',
            'BACHELOR OF ELEMENTARY EDUCATION (ENGLISH)',
            'BACHELOR OF ELEMENTARY EDUCATION (SCIENCE AND HEALTH)',
            'BACHELOR OF SCIENCE IN TECHNOLOGY TEACHER EDUCATION (INDUSTRIAL TECH)',
            'BACHELOR OF SCIENCE IN TECHNOLOGY TEACHER EDUCATION (DRAFTING TECH)'
        ],
        'College of Business Administration & Accountancy': [
            'BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION (BUSINESS ECONOMICS)',
            'BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION (ECONOMICS)',
            'BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION (ENTREPRENEURIAL MARKETING)',
            'BACHELOR OF SCIENCE IN HOTEL AND RESTAURANT MANAGEMENT',
            'BACHELOR OF SCIENCE IN ACCOUNTANCY'
        ],
        'School of Computer Studies': [
            'DIPLOMA IN ELECTRONICS ENGINEERING TECH (COMPUTER ELECTRONICS)',
            'BACHELOR OF SCIENCE IN INFORMATION SYSTEMS',
            'BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY',
            'DIPLOMA IN ELECTRONICS TECHNOLOGY',
            'DIPLOMA IN ELECTRONICS ENGINEERING TECH (COMMUNICATION ELECTRONICS)',
            'BACHELOR OF SCIENCE IN COMPUTER SCIENCE',
            'BACHELOR OF SCIENCE IN ELECTRONICS AND COMPUTER TECHNOLOGY (EMBEDDED SYSTEMS)',
            'BACHELOR OF SCIENCE IN ELECTRONICS AND COMPUTER TECHNOLOGY (COMMUNICATIONS SYSTEM)'
        ],
        'School of Engineering Technology': [
            'DIPLOMA IN INDUSTRIAL AUTOMATION MAINTENANCE TECHOLOGY',
            'DIPLOMA IN AUTOMOTIVE ENGINEERING TECHNOLOGY',
            'DIPLOMA IN ELECTRICAL ENGINEERING TECHNOLOGY',
            'DIPLOMA IN MECHANICAL ENGINEERING TECHNOLOGY',
            'DIPLOMA IN CIVIL ENGINEERING TECHNOLOGY',
            'BACHELOR OF SCIENCE IN INDUSTRIAL AUTOMATION & MECHATRONICS',
            'MATERIAL SCIENCE & ENGINEERING TECHNOLOGY',
            'BACHELOR OF SCIENCE IN ENGINEERING TECHNOLOGY MANAGEMENT',
            'DIPLOMA IN INDUSTRIAL AUTOMATION & CONTROL ENGINEERING TECHNOLOGY',
            'DIPLOMA IN HEATING, VENTILATING, AIR-CONDITIONING & REFRIGERATION ENGINEERING TECHNOLOGY'
        ],
        'College of Nursing': [
            'BACHELOR OF SCIENCE IN NURSING'
        ],
        'School of Graduate Studies': [
            'MASTER OF SCIENCE IN ELECTRICAL ENGINEERING',
            'DOCTOR IN SUSTAINABLE DEVELOPMENT STUDIES',
            'MASTER OF SCIENCE IN INFORMATION TECHNOLOGY',
            'MASTER OF SCIENCE IN MECHANICAL ENGINEERING',
            'MASTER OF SCIENCE IN MATERIALS SCIENCE AND ENGINEERING',
            'MASTER OF SCIENCE IN PHYSICAL EDUCATION',
            'DOCTOR OF PHILOSOPHY IN SCIENCE EDUCATION',
            'DOCTOR OF PHILOSOPHY IN FILIPINO',
            'DOCTOR OF PHILOSOPHY IN LANGUAGE STUDIES',
            'MASTER OF ARTS IN ENGLISH LANGUAGE STUDIES',
            'MASTER OF ARTS IN EDUCATION (GUIDANCE AND COUNSELING)',
            'MASTER OF ARTS IN FILIPINO',
            'MASTER OF ARTS IN SOCIOLOGY',
            'MASTER IN BUSINESS MANAGEMENT',
            'MASTER IN HISTORY',
            'MASTER IN SUSTAINABLE DEVELOPMENT STUDIES',
            'MASTER IN INFORMATION TECHNOLOGY',
            'MASTER OF ENGINEERING',
            'MASTER OF PUBLIC ADMINISTRATION',
            'MASTER OF SCIENCE IN COMPUTER APPLICATIONS',
            'MASTER OF SCIENCE IN CIVIL ENGINEERING',
            'DOCTOR OF ENGINEERING',
            'MASTER OF SCIENCE EDUCATION',
            'MASTER OF SCIENCE IN COMPUTER SCIENCE'
        ]
    };

    nextButton.addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Clear previous error messages and borders
        document.querySelectorAll('.error-message').forEach(elem => elem.textContent = '');
        document.querySelectorAll('.error-border').forEach(elem => elem.classList.remove('error-border'));

        // Get form values
        const studentId = document.getElementById('student-id').value.trim();
        const firstNameValue = firstName.value.trim();
        const middleNameValue = middleName.value.trim();
        const lastNameValue = lastName.value.trim();
        const dobValue = dobField.value.trim();
        const ageValue = ageField.value.trim();
        const genderValue = document.getElementById('gender').value.trim();
        const departmentValue = departmentSelect.value.trim();
        const courseValue = courseSelect.value.trim();
        const emailValue = emailField.value.trim();
        const mobileNumber = document.getElementById('mobile-number').value.trim();
        const houseStreet = document.getElementById('house-street').value.trim();
        const barangay = document.getElementById('barangay').value.trim();
        const city = document.getElementById('city').value.trim();
        const province = document.getElementById('province').value.trim();

        // Form validation
        let isValid = true;

        // Validate fields
        if (studentId === '') {
            document.getElementById('error-id-number').textContent = 'Student ID is required*';
            document.getElementById('error-id-number').style.display = 'inline-block';
            isValid = false;
        }
        if (firstNameValue === '') {
            document.getElementById('error-first-name').textContent = 'First Name is required*';
            document.getElementById('error-first-name').style.display = 'inline-block';
            isValid = false;
        }
        if (middleNameValue === '') {
            document.getElementById('error-middle-name').textContent = 'Middle Name is required*';
            document.getElementById('error-middle-name').style.display = 'inline-block';
            isValid = false;
        }
        if (lastNameValue === '') {
            document.getElementById('error-last-name').textContent = 'Last Name is required*';
            document.getElementById('error-last-name').style.display = 'inline-block';
            isValid = false;
        }
        if (dobValue === '') {
            document.getElementById('error-dob').textContent = 'Date of Birth is required*';
            document.getElementById('error-dob').style.display = 'inline-block';
            isValid = false;
        }
        if (ageValue === '' || isNaN(ageValue)) {
            document.getElementById('error-age').textContent = 'Age is required and must be a number*';
            document.getElementById('error-age').style.display = 'inline-block';
            isValid = false;
        }
        if (genderValue === 'default') {
            document.getElementById('error-gender').textContent = 'Gender is required*';
            document.getElementById('error-gender').style.display = 'inline-block';
            isValid = false;
        }
        if (emailValue === '' || !isValidEmail(emailValue)) {
            document.getElementById('error-email').textContent = 'Valid email is required*';
            document.getElementById('error-email').style.display = 'inline-block';
            isValid = false;
        }
        if (departmentValue === 'default') {
            document.getElementById('error-department').textContent = 'Department is required*';
            document.getElementById('error-department').style.display = 'inline-block';
            isValid = false;
        }
        if (courseValue === 'default') {
            document.getElementById('error-course').textContent = 'Course is required*';
            document.getElementById('error-course').style.display = 'inline-block';
            isValid = false;
        }
        if (mobileNumber === '') {
            document.getElementById('error-mobile-number').textContent = 'Mobile Number is required*';
            document.getElementById('error-mobile-number').style.display = 'inline-block';
            isValid = false;
        }
        if (houseStreet === '') {
            document.getElementById('error-house-street').textContent = 'House/Street is required*';
            document.getElementById('error-house-street').style.display = 'inline-block';
            isValid = false;
        }
        if (barangay === '') {
            document.getElementById('error-barangay').textContent = 'Barangay is required*';
            document.getElementById('error-barangay').style.display = 'inline-block';
            isValid = false;
        }
        if (city === '') {
            document.getElementById('error-city').textContent = 'City is required*';
            document.getElementById('error-city').style.display = 'inline-block';
            isValid = false;
        }
        if (province === '') {
            document.getElementById('error-province').textContent = 'Province is required*';
            document.getElementById('error-province').style.display = 'inline-block';
            isValid = false;
        }

        if (isValid) {
            // Store values in session storage
            sessionStorage.setItem('studentId', studentId);
            sessionStorage.setItem('firstName', firstNameValue);
            sessionStorage.setItem('middleName', middleNameValue);
            sessionStorage.setItem('lastName', lastNameValue);
            sessionStorage.setItem('dob', dobValue);
            sessionStorage.setItem('gender', genderValue);
            sessionStorage.setItem('age', ageValue);
            sessionStorage.setItem('department', departmentValue);
            sessionStorage.setItem('course', courseValue);
            sessionStorage.setItem('email', emailValue);
            sessionStorage.setItem('mobileNumber', mobileNumber);
            sessionStorage.setItem('houseStreet', houseStreet);
            sessionStorage.setItem('barangay', barangay);
            sessionStorage.setItem('city', city);
            sessionStorage.setItem('province', province);

            // Redirect to Required Document Page
            window.location.href = '../Required Documents Page/RequiredDocumentsPage.html';
        }
    });
});