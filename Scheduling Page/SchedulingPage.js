document.addEventListener('DOMContentLoaded', function () {
    const selectedDateInput = document.getElementById('selected-date');
    const selectedTimeFromInput = document.getElementById('selected-time-from');
    const selectedTimeToInput = document.getElementById('selected-time-to');
    const nextBtn = document.getElementById('next-btn');

    // Calendar and time selection logic
    const daysContainer = document.querySelector('.days');
    const monthYearDisplay = document.getElementById('monthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date();
    let selectedDate = null;

    function renderCalendar(date) {
        daysContainer.innerHTML = '';
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        monthYearDisplay.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

        const adjustedFirstDay = (firstDay + 6) % 7;

        for (let i = 0; i < adjustedFirstDay; i++) {
            const blankDay = document.createElement('div');
            blankDay.classList.add('blank');
            daysContainer.appendChild(blankDay);
        }

        for (let day = 1; day <= lastDay; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;

            const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            // Automatically select today's date
            if (
                day === currentDate.getDate() &&
                month === currentDate.getMonth() &&
                year === currentDate.getFullYear()
            ) {
                dayElement.classList.add('selected');
                selectedDate = formattedDate;
                selectedDateInput.value = formattedDate;

                checkAvailability(formattedDate); // Automatically check availability for today's date
            }

            dayElement.addEventListener('click', function () {
                if (dayElement.classList.contains('fully-booked')) return;

                document.querySelectorAll('.days div').forEach(el => el.classList.remove('selected'));
                dayElement.classList.add('selected');

                selectedDate = formattedDate;
                selectedDateInput.value = formattedDate;

                checkAvailability(formattedDate); // Check availability when a date is selected
            });

            daysContainer.appendChild(dayElement);
        }
    }

    function checkAvailability(date) {
        fetch(`http://localhost:3001/api/checkAvailability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date })
        })
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll('.times label').forEach(label => {
                const timeRange = label.querySelector('input').value.split('-');
                const timeSlot = `${timeRange[0]}-${timeRange[1]}`;

                const statusSpan = label.querySelector('span');
                if (data.bookedSlots.includes(timeSlot)) {
                    label.querySelector('input').disabled = true;
                    statusSpan.textContent = 'Fully Booked';
                    statusSpan.className = 'fully-booked';
                } else {
                    label.querySelector('input').disabled = false;
                    statusSpan.textContent = 'Available';
                    statusSpan.className = 'available';
                }
            });
        })
        .catch(error => {
            console.error('Error fetching availability:', error);
        });
    }

    document.querySelectorAll('.times input[name="time"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const timeRange = this.value.split('-');
            selectedTimeFromInput.value = timeRange[0];
            selectedTimeToInput.value = timeRange[1];
        });
    });

    prevMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate); // Render calendar with today's date auto-selected

    nextBtn.addEventListener('click', function () {
        sessionStorage.setItem('appointmentDate', selectedDate);
        sessionStorage.setItem('timeFrom', selectedTimeFromInput.value);
        sessionStorage.setItem('timeTo', selectedTimeToInput.value);

        window.location.href = '../Personal & Contact Info Page/PersonalContactInfoPage.html';
    });

    document.getElementById('cancel-btn').addEventListener('click', function () {
        window.location.href = 'HomePage.html';
    });
});