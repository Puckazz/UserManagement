/** Escape HTML để chống XSS */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function showError(message) {
  const banner = document.getElementById("error-banner");
  document.getElementById("error-message").textContent = message;
  banner.classList.remove("hidden");
}

/** Debounce — chờ user ngừng gõ mới thực hiện */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function validateName(value) {
  if (!value.trim()) return "Name is required.";
  if (value.trim().length < 2) return "Name must be at least 2 characters.";
  return "";
}

function validateUsername(value) {
  if (!value.trim()) return "Username is required.";
  if (value.trim().length < 2) return "Username must be at least 2 characters.";
  return "";
}

function validateEmail(value) {
  if (!value.trim()) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value.trim())) return "Invalid email format.";
  return "";
}