document.addEventListener("DOMContentLoaded", () => {
  const yearsMonthsGrid = document.querySelector(".years-months-grid");
  const daysHoursGrid = document.querySelector(".days-hours-grid");
  const minutesSecondsGrid = document.querySelector(".minutes-seconds-grid");

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentSecond = currentDate.getSeconds();

  // Populate Years and Months grid
  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  for (let i = 0; i <= 12; i++) {
    const label = document.createElement("div");
    label.classList.add("grid-cell", "label");
    label.textContent = monthNames[i];
    if (i === currentMonth + 1) {
      label.classList.add("label-active");
    }
    yearsMonthsGrid.appendChild(label);
  }

  for (let year = 2001; year <= 2050; year++) {
    const yearLabel = document.createElement("div");
    yearLabel.classList.add("grid-cell", "label");
    yearLabel.textContent = year;
    if (year === currentYear) {
      yearLabel.classList.add("label-active");
    }
    yearsMonthsGrid.appendChild(yearLabel);

    for (let month = 0; month < 12; month++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        cell.classList.add("past");
      } else if (year === currentYear && month === currentMonth) {
        cell.classList.add("current");
      }
      yearsMonthsGrid.appendChild(cell);
    }
  }

  // Populate Days and Hours grid
  for (let i = 0; i <= 24; i++) {
    const label = document.createElement("div");
    label.classList.add("grid-cell", "label");
    label.textContent = i === 0 ? "" : `${(i - 1).toString().padStart(2, "0")}`;
    if (i - 1 === currentHour) {
      label.classList.add("label-active");
    }
    daysHoursGrid.appendChild(label);
  }

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayLabel = document.createElement("div");
    dayLabel.classList.add("grid-cell", "label");
    dayLabel.textContent = `${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    // Check if the day is a Monday and add the label-monday class
    const currentDate = new Date(currentYear, currentMonth, day);
    if (currentDate.getDay() === 1) {
      // 1 represents Monday
      dayLabel.classList.add("label-monday");
    }

    if (day === currentDay) {
      dayLabel.classList.add("label-active");
    }
    daysHoursGrid.appendChild(dayLabel);

    for (let hour = 0; hour < 24; hour++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      if (day < currentDay || (day === currentDay && hour < currentHour)) {
        if (hour < 9) {
          cell.classList.add("past-sleep");
        } else {
          cell.classList.add("past");
        }
      } else if (day === currentDay && hour === currentHour) {
        cell.classList.add("current");
      }
      daysHoursGrid.appendChild(cell);
    }
  }

  // Populate Minutes and Seconds grid
  for (let i = 0; i <= 60; i++) {
    const label = document.createElement("div");
    label.classList.add("grid-cell", "label");
  }

  for (let minute = 0; minute < 60; minute++) {
    const minuteLabel = document.createElement("div");
    minuteLabel.classList.add("grid-cell", "label");
    minuteLabel.textContent = minute.toString().padStart(2, "0");
    minuteLabel.id = `minute-label-${minute}`;
    if (minute === currentMinute) {
      minuteLabel.classList.add("label-active");
    }
    minutesSecondsGrid.appendChild(minuteLabel);

    for (let second = 0; second < 60; second++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.id = `cell-${minute}-${second}`;
      cell.classList.add("second");
      // Color passed time green on initial load
      if (
        minute < currentMinute ||
        (minute === currentMinute && second <= currentSecond)
      ) {
        cell.classList.add("past");
      }

      // Mark current cell
      if (minute === currentMinute && second === currentSecond) {
        cell.classList.add("current");
      }

      minutesSecondsGrid.appendChild(cell);
    }
  }

  let lastMinute = currentMinute;
  let lastSecond = currentSecond;

  // Update Minutes and Seconds grid in real-time
  function updateMinutesSeconds() {
    const now = new Date();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // Only update if the time has changed
    if (currentMinute !== lastMinute || currentSecond !== lastSecond) {
      // Remove 'current' class from the previous current cell
      const lastCurrentCell = document.getElementById(
        `cell-${lastMinute}-${lastSecond}`
      );
      if (lastCurrentCell) {
        lastCurrentCell.classList.remove("current");
        lastCurrentCell.classList.add("past");
      }

      // Add 'current' class to the new current cell
      const currentCell = document.getElementById(
        `cell-${currentMinute}-${currentSecond}`
      );
      if (currentCell) {
        currentCell.classList.add("current");
      }

      // If minute changed, update all cells in the new minute to 'past'
      if (currentMinute !== lastMinute) {
        for (let s = 0; s < currentSecond; s++) {
          const cell = document.getElementById(`cell-${currentMinute}-${s}`);
          if (cell) {
            cell.classList.add("past");
          }
        }
      }

      // Update active minute label
      if (currentMinute !== lastMinute) {
        const lastMinuteLabel = document.getElementById(
          `minute-label-${lastMinute}`
        );
        if (lastMinuteLabel) {
          lastMinuteLabel.classList.remove("label-active");
        }
        const currentMinuteLabel = document.getElementById(
          `minute-label-${currentMinute}`
        );
        if (currentMinuteLabel) {
          currentMinuteLabel.classList.add("label-active");
        }
      }

      lastMinute = currentMinute;
      lastSecond = currentSecond;
    }
  }

  // Initial update and set interval for real-time updates
  updateMinutesSeconds();
  setInterval(updateMinutesSeconds, 500);

  // Age counter
  const ageCounter = document.getElementById("age-counter");
  let birthdate = new Date("2001-02-08");
  let endYear = 2050;

  function updateAgeCounter() {
    const currentDate = new Date();
    const ageInYears =
      (currentDate.getTime() - birthdate.getTime()) /
      (365.25 * 24 * 60 * 60 * 1000);
    const ageInDays =
      (currentDate.getTime() - birthdate.getTime()) / (24 * 60 * 60 * 1000);
    ageCounter.textContent = `${ageInYears.toFixed(8)} (${ageInDays.toFixed(
      0
    )} d)`;
  }

  // Initial update
  updateAgeCounter();

  setInterval(updateAgeCounter, 100);

  // Function to save text to storage
  function saveText(key, value) {
    chrome.storage.sync.set({ [key]: value }, function () {
      console.log("Text saved for", key);
    });
  }

  // Function to retrieve text from storage
  function getText(key, callback) {
    chrome.storage.sync.get([key], function (result) {
      callback(result[key] || "(click to edit)"); // Default to '(click to edit)' if no value
    });
  }

  // Function to make text editable
  function makeEditable(element) {
    const input = document.createElement("input");
    input.type = "text";
    input.value =
      element.textContent === "(click to edit)" ? "" : element.textContent;
    input.classList.add("editable-input");

    input.onblur = function () {
      saveAndReplace(element, input);
    };

    input.onkeydown = function (event) {
      if (event.key === "Enter") {
        saveAndReplace(element, input);
      }
    };

    element.parentNode.replaceChild(input, element);
    input.focus();
  }

  // Function to save input and replace with paragraph
  function saveAndReplace(element, input) {
    const newText = input.value.trim() || "(click to edit)";
    saveText(element.id, newText);
    element.textContent = newText;
    input.parentNode.replaceChild(element, input);
  }

  // Initialize editable text elements
  const textElements = [
    "years-months-text",
    "days-hours-text",
    "minutes-seconds-text",
  ];
  textElements.forEach((id) => {
    const element = document.getElementById(id);
    getText(id, (text) => {
      element.textContent = text;
    });
    element.addEventListener("click", () => makeEditable(element));
  });

  const birthdateInput = document.getElementById("birthdate-input");
  const endYearInput = document.getElementById("endyear-input");
  const saveButton = document.getElementById("save-dates");

  birthdateInput.value = "2000-01-01"; // Set initial value
  endYearInput.value = "2050"; // Set initial value

  // Load saved dates from storage
  chrome.storage.sync.get(["birthdate", "endyear"], function (result) {
    if (result.birthdate) {
      birthdate = new Date(result.birthdate);
      birthdateInput.value = result.birthdate;
      updateAgeCounter();
    }
    if (result.endyear) {
      endYear = parseInt(result.endyear);
      endYearInput.value = result.endyear;
    }
    // Regenerate grid after loading dates
    regenerateYearsMonthsGrid();
  });

  // Add save button handler
  saveButton.addEventListener("click", function () {
    const newBirthdate = new Date(birthdateInput.value);
    const newEndYear = parseInt(endYearInput.value);

    if (!isNaN(newBirthdate.getTime()) && !isNaN(newEndYear)) {
      if (
        newEndYear >= newBirthdate.getFullYear() &&
        newEndYear >= 1900 &&
        newEndYear <= 2100
      ) {
        birthdate = newBirthdate;
        endYear = newEndYear;

        chrome.storage.sync.set({
          birthdate: birthdateInput.value,
          endyear: endYear.toString(),
        });

        updateAgeCounter();
        regenerateYearsMonthsGrid();
      } else {
        alert(
          "Please ensure the end year is after the birth year and between 1900 and 2100"
        );
        endYearInput.value = endYear;
      }
    } else {
      alert("Please enter valid dates");
      birthdateInput.value = birthdate.toISOString().split("T")[0];
      endYearInput.value = endYear;
    }
  });

  // Add function to regenerate the years-months grid
  function regenerateYearsMonthsGrid() {
    const yearsMonthsGrid = document.querySelector(".years-months-grid");
    yearsMonthsGrid.innerHTML = ""; // Clear existing grid

    // Re-add month labels
    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    for (let i = 0; i <= 12; i++) {
      const label = document.createElement("div");
      label.classList.add("grid-cell", "label");
      label.textContent = monthNames[i];
      if (i === new Date().getMonth() + 1) {
        label.classList.add("label-active");
      }
      yearsMonthsGrid.appendChild(label);
    }

    // Re-populate years and months
    const startYear = birthdate.getFullYear();
    const currentDate = new Date();

    for (let year = startYear; year <= endYear; year++) {
      const yearLabel = document.createElement("div");
      yearLabel.classList.add("grid-cell", "label");
      yearLabel.textContent = year;
      if (year === currentDate.getFullYear()) {
        yearLabel.classList.add("label-active");
      }
      yearsMonthsGrid.appendChild(yearLabel);

      for (let month = 0; month < 12; month++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        if (
          year < currentDate.getFullYear() ||
          (year === currentDate.getFullYear() && month < currentDate.getMonth())
        ) {
          cell.classList.add("past");
        } else if (
          year === currentDate.getFullYear() &&
          month === currentDate.getMonth()
        ) {
          cell.classList.add("current");
        }
        yearsMonthsGrid.appendChild(cell);
      }
    }
  }
});
