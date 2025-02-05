document.getElementById("book-now-button").addEventListener("click", function () {
  document.getElementById("booking-modal").style.display = "block";
  document.body.classList.add("overflow-hidden"); // Заборона прокручування
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