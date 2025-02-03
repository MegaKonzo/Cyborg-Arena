const form = document.querySelector(".contacts-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = document.getElementById("full-name").value.trim();
  const phoneNumber = document.getElementById("phone-number").value.trim();
  const email = document.getElementById("email").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const message = document.getElementById("message").value.trim();

  const nameRegex = /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{2,}$/;
  const phoneRegex = /^\+?[0-9]{10,14}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const quantityRegex = /^[1-9]|10$/;

  let isValid = true;

  if (!nameRegex.test(fullName)) {
    alert("Please enter a valid full name (at least 2 characters).");
    isValid = false;
  }

  if (!phoneRegex.test(phoneNumber)) {
    alert("Please enter a valid phone number (10-14 digits, optional +).");
    isValid = false;
  }

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    isValid = false;
  }

  if (!quantityRegex.test(quantity)) {
    alert("Please enter a valid quantity between 1 and 10.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const comment = {
    id: new Date().toISOString(),
    fullName,
    phoneNumber,
    email,
    quantity,
    message,
  };

  console.log("Sending comment:", comment);

  fetch("http://localhost:3000/add-comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Your comment has been saved successfully!");
        form.reset();
      } else {
        alert("Error saving your comment. Please try again.");
      }
    })
    .catch((error) => console.error("Error:", error));
});