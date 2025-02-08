document.getElementById("book-now-button").addEventListener("click", function () {
    document.getElementById("booking-modal").style.display = "block";
    document.body.classList.add("overflow-hidden");
  });

  const buttons = document.querySelectorAll(".vip__button");

  buttons.forEach(button => {  // Додаємо обробник події для кожної кнопки
    button.addEventListener("click", function() {
      this.textContent = `book by number in contact`;
    });
  });

  const mainHall = document.querySelector(".main__hall");
  let selectedComputers = 0;
  let totalPrice = 0;
  
  for (let i = 1; i <= 40; i++) {
      const btn = document.createElement("button");
      btn.classList.add("sets");
      btn.textContent = i;
      btn.setAttribute('data-price', 2);
      btn.setAttribute('id', `computer-${i}`);
      mainHall.appendChild(btn);
      
      btn.addEventListener("click", function () {
          if (btn.classList.contains("selected")) {
              btn.classList.remove("selected");
              selectedComputers--;
          } else {
              btn.classList.add("selected");
              selectedComputers++;
          }
          updateTotalPrice();
      });
  }
  
  document.getElementById("close-modal").addEventListener("click", function () {
    document.getElementById("booking-modal").style.display = "none";
    document.body.classList.remove("overflow-hidden");
  });
  
  // Закриття модального вікна при кліку за межами контенту
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("booking-modal");
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove("overflow-hidden");
    }
  });

  function updateTotalPrice() {
      const selectedTime = document.getElementById("timeSelect").value;
      const pricePerHour = parseFloat(document.querySelector(`#timeSelect option[value="${selectedTime}"]`).getAttribute('data-price'));
  
      totalPrice = selectedComputers * pricePerHour;
      document.getElementById("totalPrice").textContent = `Total Price: $${totalPrice}`;
  }
  
  document.getElementById("timeSelect").addEventListener("change", updateTotalPrice);
  

document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("booking-modal").style.display = "none";
  document.body.classList.remove("overflow-hidden"); // Дозвіл прокручування
});

window.addEventListener("click", function (event) {
  if (event.target === document.getElementById("booking-modal")) {
    document.getElementById("booking-modal").style.display = "none";
    document.body.classList.remove("overflow-hidden");
  }
});

//POST and GET RESERVATION
function calculateEndTime(startTime, duration) {
  let [hour, minute] = startTime.split(":").map(Number);
  let endHour = hour + duration;
  return `${endHour}:00`;
}

const hourSelect = document.getElementById("hourSelect");
// Генеруємо список варіантів для годин (наприклад, 10:00 - 22:00)
for (let hour = 10; hour <= 22; hour++) {
    let option = document.createElement("option");
    option.value = `${hour}:00`;
    option.textContent = `${hour}:00`;
    hourSelect.appendChild(option);
}

async function fetchReservations() {// Отримання бронювань з сервера
  try {
    const response = await fetch("/reservations");
    return await response.json();
  } catch (error) {
    console.error("Error loading bookings:", error);
    return [];
  }
}

// Функція перевірки, чи є обрана година в межах заброньованого часу
function isTimeBlocked(time, reservations, selectedComputer) {
  return reservations.some(reservation => 
    reservation.computerId === selectedComputer &&
    time >= reservation.startTime && time < reservation.endTime
  );
}

// Оновлення списку доступних годин з урахуванням бронювань
async function updateAvailableHours(selectedComputer) {
  const reservations = await fetchReservations();
  hourSelect.innerHTML = ""; // Очистити список

  for (let hour = 10; hour <= 22; hour++) {
    let time = `${hour}:00`;
    let option = document.createElement("option");
    option.value = time;
    option.textContent = time;

    if (isTimeBlocked(time, reservations, selectedComputer)) {
      option.disabled = true;
    }
    hourSelect.appendChild(option);
  }
}
// Викликати `updateAvailableHours` при виборі комп'ютера
document.querySelectorAll(".sets").forEach(button => {
  button.addEventListener("click", function () {
    let selectedComputer = parseInt(this.textContent);
    updateAvailableHours(selectedComputer);
  });
});

function updateCurrentTime() {// Оновлення реального часу в модальному вікні
  const currentTimeSpan = document.getElementById("current-time");
  setInterval(() => {
    const now = new Date();
    currentTimeSpan.textContent = now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  }, 1000);
}
updateCurrentTime();

// Обробка запиту на бронювання
document.getElementById("bookButton").addEventListener("click", function () {
  const selectedComputers = [];
  const startTime = document.getElementById("hourSelect").value;
  const duration = parseInt(document.getElementById("timeSelect").value);
  const endTime = calculateEndTime(startTime, duration);
  const userName = document.getElementById("userName").value.trim();
  const userPhone = document.getElementById("userPhone").value.trim();

  // Регулярні вирази для валідації
  const nameRegex = /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{4,}$/;
  const phoneRegex = /^\+?[0-9]{10,14}$/;

  // Збираємо ID вибраних комп'ютерів
  document.querySelectorAll(".sets.selected").forEach(function (btn) {
    selectedComputers.push(parseInt(btn.textContent));
  });

  if (selectedComputers.length === 0) {
    alert("❌ Please select computers to reserve.");
    return;
  }

  // Перевірка імені
  if (!nameRegex.test(userName)) {
    alert("❌ Please enter a valid name (at least 4 characters, letters only).");
    document.getElementById("userName").value = ""; // Очищення
    document.getElementById("userName").focus(); // Фокус на поле
    return;
  }

  // Перевірка телефону
  if (!phoneRegex.test(userPhone)) {
    alert("❌ Please enter a valid phone number (10-14 digits, may start with +).");
    document.getElementById("userPhone").value = ""; // Очищення
    document.getElementById("userPhone").focus(); // Фокус на поле
    return;
  }

  // Відправка даних на сервер тільки після успішної валідації
  fetch("/book-computer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      selectedComputers,
      userName,
      userPhone,
      startTime,
      endTime
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("✅ Reservation successfully created!");
        console.log("Відповідь сервера:", data);
        document.getElementById("booking-modal").style.display = "none";
        document.body.classList.remove("overflow-hidden");
      } else {
        alert("❌ " + data.message);
      }
    })
    .catch(error => {
      alert("❌ There was an error when booking. Try again.");
    });
});
