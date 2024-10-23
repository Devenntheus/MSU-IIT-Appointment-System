document.addEventListener('DOMContentLoaded', function () {
    const firstNameField = document.getElementById('first-name');
    const lastNameField = document.getElementById('last-name');
    const middleNameField = document.getElementById('middle-name');
    const genderSelect = document.getElementById('gender');

    const dobField = document.getElementById('dob');
    const ageField = document.getElementById('age');
    const placeOfBirthField = document.getElementById('place-of-birth');
    const citizenshipField = document.getElementById('citizenship');

    const emailField = document.getElementById('email');
    const mobileNumberField = document.getElementById('mobile-number');
    const whatsappNumberField = document.getElementById('whatsApp-number');
    const telegramNumberField = document.getElementById('telegram-number');
    
    const houseStreetField = document.getElementById('house-street');
    const barangayField = document.getElementById('barangay');
    const municipalityCityField = document.getElementById('city');
    const provinceField = document.getElementById('province');


    const nextButton = document.getElementById('next');

    const emailError = document.getElementById('error-email');
    const placeOfBirthError = document.getElementById('error-place-of-birth');
    const mobileError = document.getElementById('error-mobile-number');
    const whatsappError = document.getElementById('error-whatsapp-number');
    const telegramError = document.getElementById('error-telegram-number');
    
    // Simple validation pattern: "City/Town, Province"
    const pattern = /^[a-zA-Z\s]+,\s?[a-zA-Z\s]+$/;

    // Phone number validation pattern
    const phonePattern = /^\+63 9\d{2} \d{3} \d{4}$/; // Adjust this regex according to your format

    // Capitalize Words
    function capitalizeWords(input) {
        return input.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    function addCapitalizationListener(field) {
        field.addEventListener('input', function() {
            field.value = capitalizeWords(field.value);
        });
    }

    addCapitalizationListener(firstNameField);
    addCapitalizationListener(lastNameField);
    addCapitalizationListener(middleNameField);

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
    
    addCapitalizationListener(placeOfBirthField);

    // Place of Birth validation
    placeOfBirthField.addEventListener('input', function() {
        const placeOfBirthInput = this.value;
        
        
        if (!pattern.test(placeOfBirthInput)) {
            placeOfBirthError.textContent = "Valid place of birth is required*";
            placeOfBirthError.style.display = 'inline-block';
            placeOfBirthError.style.color = 'red';
            placeOfBirthField.classList.add('error-border');
        } else {
            placeOfBirthError.textContent = ""; // Clear error message if valid
            placeOfBirthError.style.display = 'none';
            placeOfBirthField.classList.remove('error-border');
        }
    });

    addCapitalizationListener(citizenshipField);

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

    // Function to format the input to the required phone number format
    function formatPhoneNumber(value) {
        // Remove everything except digits
        const digits = value.replace(/\D/g, '');

        // Check if input starts with '0'
        if (digits.length === 0) return '+63';
        if (digits[0] === '0' || digits[0] === digits.substring(0)) {
            // If the first digit is 0, replace it with '+63'
            return '+63' + (digits.length > 1 ? digits.substring(1, 2) : '') + ' ';
        }

        let formattedValue = '+';
        if (digits.length >= 1) {
            formattedValue += digits[0]; // Add the first number
        }
        if (digits.length > 1) {
            formattedValue += digits.substring(1, 2) ; // Next three digits (9##)
        }
        if (digits.length >= 2) {
            formattedValue += ' ' + digits.substring(2, 5); // Next three digits (###)
        }
        if (digits.length >= 5) {
            formattedValue += ' ' + digits.substring(5, 8); // Last four digits (####)
        }
        if (digits.length >= 8) {
            formattedValue += ' ' + digits.substring(8, 12); // Last four digits (####)
        }

        return formattedValue.trim();
    }

    // Input event listeners to enforce format
    function setupInputField(field) {
        field.addEventListener('input', function() {
            const currentValue = this.value;
            const formatted = formatPhoneNumber(currentValue);
            this.value = formatted;

            // Set the cursor position
            const cursorPosition = calculateCursorPosition(currentValue, formatted);
            this.setSelectionRange(cursorPosition, cursorPosition);
        });
    }

    // Calculate new cursor position based on input
    function calculateCursorPosition(currentValue, formattedValue) {
        const currentLength = currentValue.replace(/\D/g, '').length;
        const formattedLength = formattedValue.replace(/\D/g, '').length;

        if (currentLength > formattedLength) {
            return formattedValue.length; // Move to the end if deleting digits
        }

        // If typing, adjust cursor position based on formatting
        if (currentLength <= 1) return 4; // After "+63 "
        if (currentLength <= 4) return 8; // After "+63 9## "
        if (currentLength <= 7) return 12; // After "+63 9### "
        return formattedValue.length; // Default to end
    }

    // Setup all phone input fields
    setupInputField(mobileNumberField);
    setupInputField(whatsappNumberField);
    setupInputField(telegramNumberField);
    
     // Live validation for mobile number
     mobileNumberField.addEventListener('input', function () {
        const value = this.value.trim();
        if (value === '') {
            mobileError.textContent = 'Mobile Number is required*';
            mobileError.style.display = 'inline-block';
            this.classList.add('error-border');
        } else if (!phonePattern.test(value)) {
            mobileError.textContent = 'Mobile Number must be in the format +63 9## ### ####*';
            mobileError.style.display = 'inline-block';
            this.classList.add('error-border');
        } else {
            mobileError.textContent = '';
            mobileError.style.display = 'none';
            this.classList.remove('error-border');
        }
    });

    // Live validation for WhatsApp number
    whatsappNumberField.addEventListener('input', function () {
        const value = this.value.trim();
        if (!phonePattern.test(value)) {
            whatsappError.textContent = 'Valid whatsapp number is required*';
            whatsappError.style.display = 'inline-block';
            this.classList.add('error-border');
        }
    });

    // Live validation for Telegram number
    telegramNumberField.addEventListener('input', function () {
        const value = this.value.trim();
        if (!phonePattern.test(value)) {
            telegramError.textContent = 'Valid telegram number is required*';
            telegramError.style.display = 'inline-block';
            this.classList.add('error-border');
        }
    });

    addCapitalizationListener(houseStreetField);
    addCapitalizationListener(barangayField);
    addCapitalizationListener(municipalityCityField);
    addCapitalizationListener(provinceField);

    nextButton.addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Clear previous error messages and borders
        document.querySelectorAll('.error-message').forEach(elem => elem.textContent = '');
        document.querySelectorAll('.error-border').forEach(elem => elem.classList.remove('error-border'));

        // Get form values
        const firstNameValue = firstNameField.value.trim();
        const middleNameValue = middleNameField.value.trim();
        const lastNameValue = lastNameField.value.trim();
        const genderValue = genderSelect.value.trim();

        const dobValue = dobField.value.trim();
        const ageValue = ageField.value.trim();
        const placeOfBirthValue = placeOfBirthField.value.trim();
        const citizenshipValue = citizenshipField.value.trim();

        const emailValue = emailField.value.trim();
        const mobileNumberValue = mobileNumberField.value.trim();
        const whatsAppNumberValue = whatsappNumberField.value.trim();
        const telegramNumberValue = telegramNumberField.value.trim();

        const houseStreetValue = houseStreetField.value.trim();
        const barangayValue = barangayField.value.trim();
        const municipalityCityValue = municipalityCityField.value.trim();
        const provinceValue = provinceField.value.trim();

        // Form validation
        let isValid = true;

        // Validate fields
        if (firstNameValue === '') {
            document.getElementById('error-first-name').textContent = 'First Name is required*';
            document.getElementById('error-first-name').style.display = 'inline-block';
            isValid = false;
        }
        
        if (lastNameValue === '') {
            document.getElementById('error-last-name').textContent = 'Last Name is required*';
            document.getElementById('error-last-name').style.display = 'inline-block';
            isValid = false;
        }

        if (middleNameValue === '') {
            document.getElementById('error-middle-name').textContent = 'Middle Name is required*';
            document.getElementById('error-middle-name').style.display = 'inline-block';
            isValid = false;
        }

        if (genderValue === 'default') {
            document.getElementById('error-gender').textContent = 'Gender is required*';
            document.getElementById('error-gender').style.display = 'inline-block';
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

        if (placeOfBirthValue === '' || !pattern.test(placeOfBirthValue)) {
            document.getElementById('error-place-of-birth').textContent = 'Valid place of birth is required*';
            document.getElementById('error-place-of-birth').style.display = 'inline-block';
            isValid = false;
        }

        if (citizenshipValue === '') {
            document.getElementById('error-citizenship').textContent = 'Citizenship is required*';
            document.getElementById('error-citizenship').style.display = 'inline-block';
            isValid = false;
        }


        
        if (emailValue === '' || !isValidEmail(emailValue)) {
            document.getElementById('error-email').textContent = 'Valid email is required*';
            document.getElementById('error-email').style.display = 'inline-block';
            isValid = false;
        }

        if (mobileNumberValue === '') {
            document.getElementById('error-mobile-number').textContent = 'Mobile Number is required*';
            document.getElementById('error-mobile-number').style.display = 'inline-block';
            isValid = false;
        }

        // Validate mobile number format
        if (!phonePattern.test(mobileNumberField.value.trim())) {
            mobileError.textContent = 'Valid mobile number is required*';
            mobileError.style.display = 'inline-block';
            mobileNumberField.classList.add('error-border');
            isValid = false;
        }

        if (houseStreetValue === '') {
            document.getElementById('error-house-street').textContent = 'House/Street is required*';
            document.getElementById('error-house-street').style.display = 'inline-block';
            isValid = false;
        }
        if (barangayValue === '') {
            document.getElementById('error-barangay').textContent = 'Barangay is required*';
            document.getElementById('error-barangay').style.display = 'inline-block';
            isValid = false;
        }
        if (municipalityCityValue === '') {
            document.getElementById('error-city').textContent = 'Municipality/City is required*';
            document.getElementById('error-city').style.display = 'inline-block';
            isValid = false;
        }
        if (provinceValue === '') {
            document.getElementById('error-province').textContent = 'Province is required*';
            document.getElementById('error-province').style.display = 'inline-block';
            isValid = false;
        }

        if (isValid) {
            // Store values in session storage
            sessionStorage.setItem('firstName', firstNameValue);
            sessionStorage.setItem('middleName', middleNameValue);
            sessionStorage.setItem('lastName', lastNameValue);
            sessionStorage.setItem('gender', genderValue);

            sessionStorage.setItem('dob', dobValue);
            sessionStorage.setItem('age', ageValue);
            sessionStorage.setItem('placeOfBirth', placeOfBirthValue);
            sessionStorage.setItem('citizenship', citizenshipValue);
            
            sessionStorage.setItem('email', emailValue);
            sessionStorage.setItem('mobileNumber', mobileNumberValue);
            sessionStorage.setItem('whatsAppNumber', whatsAppNumberValue);
            sessionStorage.setItem('telegramNumber', telegramNumberValue);

            sessionStorage.setItem('houseStreet', houseStreetValue);
            sessionStorage.setItem('barangay', barangayValue);
            sessionStorage.setItem('municipalityCity', municipalityCityValue);
            sessionStorage.setItem('province', provinceValue);

            // Redirect to Required Document Page
            window.location.href = '../Summary Page/SummaryPage.html';
        }
    });
});

