document
  .getElementById("book-now-button")
  .addEventListener("click", function () {
    document.getElementById("booking-modal").style.display = "block";
    document.body.classList.add("overflow-hidden");
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
  
  const button = document.getElementById("free__places");
  button.addEventListener("mouseenter", function () {
      button.textContent = "Occupied places";
  });
  button.addEventListener("mouseleave", function () {
      button.textContent = "Free places";
  });
  

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

//POST RESERVATION


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
// Оновлення реального часу в модальному вікні
function updateCurrentTime() {
  const currentTimeSpan = document.getElementById("current-time");
  setInterval(() => {
    const now = new Date();
    currentTimeSpan.textContent = now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  }, 1000);
}

// Викликаємо `updateCurrentTime` один раз, щоб запустити інтервал
updateCurrentTime();



// Обробка запиту на бронювання
document.getElementById("bookButton").addEventListener("click", function () {
  console.log("Booking button clicked");  // Перевірка, чи працює подія
  
  const selectedComputers = [];
  const startTime = document.getElementById("hourSelect").value;
  const duration = parseInt(document.getElementById("timeSelect").value);
  const endTime = calculateEndTime(startTime, duration);
  const userName = document.getElementById("userName").value;
  const userPhone = document.getElementById("userPhone").value;

  function loadReservations() {
    fetch("/get-reservations")
      .then(response => {
          if (!response.ok) {
              throw new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
          }
          return response.json();
      })
      .then(data => {
        if (!data.success) {
          throw new Error(data.message || "Помилка отримання бронювань");
        }
        
        const reservations = data.reservations;
        document.querySelectorAll(".sets").forEach(button => {
            const computerId = parseInt(button.textContent);
            const isReserved = reservations.some(reservation => 
              reservation.computerId === computerId
            );

            if (isReserved) {
              button.classList.add("reserved");
              button.disabled = true;
            } else {
              button.classList.remove("reserved");
              button.disabled = false;
            }
        });
      })
      .catch(error => console.error("Помилка отримання бронювань:", error));
}

  
  // Викликаємо функцію при зміні часу, щоб оновлювати заблоковані місця
  document.getElementById("timeSelect").addEventListener("change", loadReservations);
  
  // Завантажуємо бронювання при відкритті модального вікна
  document.getElementById("book-now-button").addEventListener("click", loadReservations);
  


  // Збираємо ID вибраних комп'ютерів
  document.querySelectorAll(".sets.selected").forEach(function (btn) {
    selectedComputers.push(parseInt(btn.textContent));
  });

  if (selectedComputers.length === 0) {
    alert("Будь ласка, виберіть комп'ютери для бронювання.");
    return;
  }

  // Перевірка на заповненість полів
  if (!userName || !userPhone) {
    alert("Будь ласка, заповніть ім'я та телефон.");
    return;
  }

  // Відправка даних на сервер
  fetch("/book-computer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      selectedComputers,
      userName,
      userPhone,
      startTime,  // ✅ Повинно бути
      endTime     // ✅ Повинно бути
    })
  })
  
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Бронювання успішно створено!");
        alert(startTime);
        alert(endTime);
        console.log("Відповідь сервера:", data);
        document.getElementById("booking-modal").style.display = "none";
        document.body.classList.remove("overflow-hidden");
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error("Помилка при бронюванні:", error);
      alert("Сталася помилка при бронюванні. Спробуйте ще раз.");
    });
});