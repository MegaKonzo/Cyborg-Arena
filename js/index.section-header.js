// move to separate module
const debounce = (callback, wait) => {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

const $burger = document.querySelector(".js-burger");
const $mobMenu = document.querySelector(".js-mob-menu");

const closeMenu = () => {
  document.body.classList.remove("is-overflow-hidden");
  $burger.classList.remove("is-opened");
  $mobMenu.classList.remove("is-opened");
};

const handleResize = debounce(() => {
  if (window.matchMedia("(min-width: 1041px)").matches) {
    closeMenu();
  }
}, 400);

$burger.addEventListener("click", () => {
  document.body.classList.toggle("is-overflow-hidden");
  $burger.classList.toggle("is-opened");
  $mobMenu.classList.toggle("is-opened");
});

[...document.querySelectorAll(".js-nav-link")].forEach((el) => {
  el.addEventListener("click", () => {
    closeMenu();
  });
});

window.addEventListener("resize", handleResize);

[...document.querySelectorAll(".js-nav-link")].forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = el.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
    closeMenu();
  });
});