const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const bookingForm = document.querySelector("#booking-form");
const checkinInput = document.querySelector("#checkin");
const checkoutInput = document.querySelector("#checkout");
const bookingMessage = document.querySelector("#booking-message");
const toast = document.querySelector("#toast");
let toastTimer;

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const today = new Date();
checkinInput.min = localDateString(today);
checkoutInput.min = localDateString(today);

checkinInput.addEventListener("change", () => {
  const arrivalDate = new Date(`${checkinInput.value}T00:00:00`);
  arrivalDate.setDate(arrivalDate.getDate() + 1);
  const earliestCheckout = localDateString(arrivalDate);
  checkoutInput.min = earliestCheckout;
  if (checkoutInput.value && checkoutInput.value < earliestCheckout) {
    checkoutInput.value = "";
  }
});

function showMessage(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 5000);
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const arrival = new Date(`${checkinInput.value}T00:00:00`);
  const departure = new Date(`${checkoutInput.value}T00:00:00`);
  if (departure <= arrival) {
    checkoutInput.setCustomValidity("La salida debe ser posterior a la entrada.");
    checkoutInput.reportValidity();
    checkoutInput.setCustomValidity("");
    return;
  }

  const guestCount = bookingForm.elements.guests.value;
  const message = `Solicitud preparada para ${guestCount} ${guestCount === "1" ? "huésped" : "huéspedes"}, del ${checkinInput.value} al ${checkoutInput.value}. Escríbenos a hola@nacarhotel.com para confirmar disponibilidad.`;
  bookingMessage.textContent = "¡Gracias por elegir Nácar! Tu solicitud está lista; nuestro equipo confirmará la disponibilidad.";
  showMessage(message);
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    mainNav.classList.remove("is-open");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
