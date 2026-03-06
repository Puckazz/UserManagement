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