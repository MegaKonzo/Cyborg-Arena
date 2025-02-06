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
// не робоче
fetch("/reservations")
  .then(response => response.json())
  .then(reservations => {
    const reservedComputers = reservations.map(res => res.computerId);
    document.querySelectorAll(".sets").forEach(btn => {
      if (reservedComputers.includes(parseInt(btn.textContent))) {
        btn.classList.add("reserved");
        btn.disabled = true;  // Забороняє вибір
      }
    });
  });
// не робоче

// Обробка запиту на бронювання
document.getElementById("bookButton").addEventListener("click", function () {
  console.log("Booking button clicked");  // Перевірка, чи працює подія
  
  const selectedComputers = [];
  const selectedTime = document.getElementById("timeSelect").value;
  const userName = document.getElementById("userName").value;
  const userPhone = document.getElementById("userPhone").value;

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
      selectedTime
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Бронювання успішно створено!");
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