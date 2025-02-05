document
  .getElementById("book-now-button")
  .addEventListener("click", function () {
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








//const hall = document.getElementById("main-hall");
//const seats = 40;
//const rows = 4;
//const cols = 10;
//const reservedSeats = new Set([5, 12, 20]); 

//for (let i = 1; i <= seats; i++) {
  //  const seat = document.createElement("div");
    //seat.classList.add("seat");
    //seat.textContent = i;
    
    //if (reservedSeats.has(i)) {
      //  seat.classList.add("reserved");
    //} else {
      //  seat.addEventListener("click", () => {
        //    alert(`Ви обрали місце №${i}. Виберіть час бронювання.`);
        //});
    //}
    //hall.appendChild(seat);
//}
