const backToTopButton = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    });
    
document.getElementById("backToTop").addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
