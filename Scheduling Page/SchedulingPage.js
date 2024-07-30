document.addEventListener('DOMContentLoaded', function () {
    const daysContainer = document.querySelector('.days');
    const monthYearDisplay = document.getElementById('monthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    const selectedClass = 'selected';
    const fullyBookedClass = 'fully-booked';
    const availableClass = 'available';
    const blankClass = 'blank';

    let currentDate = new Date();

    const days = [
        { date: 15, status: 'fully-booked' },
        { date: 17, status: 'available' },
        { date: 18, status: 'available' },
        { date: 19, status: 'fully-booked' },
    ];

    function renderCalendar(date) {
        daysContainer.innerHTML = '';
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDay = new Date(year, month, 1).getDay(); // 0 (Sunday) to 6 (Saturday)
        const lastDay = new Date(year, month + 1, 0).getDate();

        monthYearDisplay.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

        // Adjust the start day to Monday (0 -> 6, 1 -> 0, 2 -> 1, ..., 6 -> 5)
        const adjustedFirstDay = (firstDay + 6) % 7;

        // Fill in the blanks for the first week
        for (let i = 0; i < adjustedFirstDay; i++) {
            const blankDay = document.createElement('div');
            blankDay.classList.add(blankClass); // Add class for blank days
            daysContainer.appendChild(blankDay);
        }

        // Add the actual days
        for (let day = 1; day <= lastDay; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;

            // Default to available if not specified
            dayElement.classList.add(availableClass);

            // Apply special classes for pre-defined days
            const specialDay = days.find(d => d.date === day);
            if (specialDay) {
                dayElement.classList.add(specialDay.status);
            }

            dayElement.addEventListener('click', function () {
                if (dayElement.classList.contains(fullyBookedClass)) return;

                document.querySelectorAll('.days div').forEach(el => el.classList.remove(selectedClass));
                dayElement.classList.add(selectedClass);
            });

            daysContainer.appendChild(dayElement);

            // Log the day and weekday to the console
            const dayDate = new Date(year, month, day);
            const weekdayName = dayDate.toLocaleDateString('default', { weekday: 'long' });
            console.log(`Date: ${day}, Weekday: ${weekdayName}`);
        }
    }

    prevMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);
});