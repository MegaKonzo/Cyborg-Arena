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