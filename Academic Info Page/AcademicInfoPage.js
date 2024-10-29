document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");
    // Get form fields
    const studentNumberField = document.getElementById('student-number');
    const departmentSelect = document.getElementById('filter-college-department');
    const courseSelect = document.getElementById('filter-course');
    const studentAlumniSelect = document.getElementById('student-alumni');
    const dateGraduationField = document.getElementById('date-graduation');
    const honorField = document.getElementById('honor-academic-distinction');
    const schoolField = document.getElementById('school');
    const transfereeField = document.getElementById('transferee-school');
    const lastSemAttendedField = document.getElementById('last-semester-attended');
    const nextButton = document.getElementById('next');

    // Capitalize Words function
    function capitalizeWords(input) {
        return input.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Add capitalization listener only if the field exists
    function addCapitalizationListener(field) {
        if (field) {
            field.addEventListener('input', function () {
                field.value = capitalizeWords(field.value);
                console.log(`Capitalized input in field: ${field.id} -> ${field.value}`);
            });
        } else {
            console.warn(`Field not found: ${field}`);
        }
    }

    addCapitalizationListener(honorField);
    addCapitalizationListener(schoolField);
    addCapitalizationListener(transfereeField);
    addCapitalizationListener(lastSemAttendedField);

    departmentSelect.addEventListener('change', function() {
        const selectedDepartment = this.value;
        console.log(`Department changed to: ${selectedDepartment}`);
        updateCourses(selectedDepartment);
    });

    function updateCourses(department) {
        courseSelect.innerHTML = '<option value="default">- - - Select Course - - -</option>';
        if (departmentCourses[department]) {
            departmentCourses[department].forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                courseSelect.appendChild(option);
            });
            console.log(`Courses updated for department: ${department}`);
        } else {
            console.warn(`No courses found for department: ${department}`);
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


        // Get form values safely
        const studentNumber = studentNumberField.value.trim();
        const department = departmentSelect.value.trim();
        const course = courseSelect.value.trim();
        const studentAlumni = studentAlumniSelect.value.trim();

        const dateGraduation = dateGraduationField.value.trim();
        const honor = honorField.value.trim();
        const school = schoolField.value.trim();
        
        const transfereeSchool = transfereeField.value.trim();
        const lastSemAttended = lastSemAttendedField.value.trim();

        console.log({
            studentNumber,
            department,
            course,
            studentAlumni,
            dateGraduation,
            honor,
            school,
            transfereeSchool,
            lastSemAttended
        });

        // Form validation
        let isValid = true;

        // Validate each required field and display appropriate error messages
        if (studentNumber === '') {
            document.getElementById('error-student-number').textContent = 'Student ID Number is required*';
            document.getElementById('error-student-number').style.display = 'inline-block';
            isValid = false;
        }
        if (department === 'default') {
            document.getElementById('error-department').textContent = 'Department is required*';
            document.getElementById('error-department').style.display = 'inline-block';
            isValid = false;
        }
        if (course === 'default') {
            document.getElementById('error-course').textContent = 'Course is required*';
            document.getElementById('error-course').style.display = 'inline-block';
            isValid = false;
        }
        if (studentAlumni === 'default') {
            document.getElementById('error-student-alumni').textContent = 'Classification is required*';
            document.getElementById('error-student-alumni').style.display = 'inline-block';
            isValid = false;
        }
        if (dateGraduation === '') {
            document.getElementById('error-date-graduation').textContent = 'Date of Graduation is required*';
            document.getElementById('error-date-graduation').style.display = 'inline-block';
            isValid = false;
        }

        if (honor === '') {
            document.getElementById('error-honor-academic-distinction').textContent = 'Honor / Academic Distinction is required*';
            document.getElementById('error-honor-academic-distinction').style.display = 'inline-block';
            isValid = false;
        }

        if (school === '') {
            document.getElementById('error-school').textContent = 'School Graduated is required*';
            document.getElementById('error-school').style.display = 'inline-block';
            isValid = false;
        }
        // If valid, store values in session storage and redirect
        if (isValid) {
            sessionStorage.setItem('studentId', studentNumber);
            sessionStorage.setItem('department', department);
            sessionStorage.setItem('course', course);
            sessionStorage.setItem('studentAlumni', studentAlumni);
            sessionStorage.setItem('dateGraduation', dateGraduation);
            sessionStorage.setItem('honor', honor);
            sessionStorage.setItem('school', school);
            sessionStorage.setItem('transfereeSchool', transfereeSchool);
            sessionStorage.setItem('lastSemAttended', lastSemAttended);

            // Redirect to SummaryPage.html
            window.location.href = '../Document Request & Authenticator Page/DocumentRequestAuthenticationPage.html';
        } else {
            console.log("Form validation failed");
        }
    });
});
