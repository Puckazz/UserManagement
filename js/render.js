function renderTable(users) {
  const tbody = document.getElementById("user-table-body");

  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-gray-400 py-8">No users found.</td>
      </tr>`;
    return;
  }

  tbody.innerHTML = users
    .map(
      (u) => `
    <tr class="border-b hover:bg-indigo-50" data-id="${u.id}">
      <td class="px-4 py-3">${u.id}</td>
      <td class="px-4 py-3">${escapeHTML(u.name)}</td>
      <td class="px-4 py-3">${escapeHTML(u.email)}</td>
      <td class="px-4 py-3">${escapeHTML(u.company?.name || "")}</td>
      <td class="px-4 py-3">${escapeHTML(u.address?.city || "")}</td>
      <td class="px-4 py-3 text-center">
        <button class="btn-view bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600" data-id="${u.id}">View</button>
        <button class="btn-edit bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600" data-id="${u.id}">Edit</button>
        <button class="btn-delete bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600" data-id="${u.id}">Delete</button>
      </td>
    </tr>`
    )
    .join("");
}

function renderFilters() {
  const companies = [...new Set(Store.users.map((u) => u.company?.name).filter(Boolean))].sort();
  const cities = [...new Set(Store.users.map((u) => u.address?.city).filter(Boolean))].sort();

  const companySelect = document.getElementById("filter-company");
  companySelect.innerHTML =
    `<option value="">All Companies</option>` +
    companies.map((c) => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");

  const citySelect = document.getElementById("filter-city");
  citySelect.innerHTML =
    `<option value="">All Cities</option>` +
    cities.map((c) => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
}

function renderPagination() {
  const container = document.getElementById("pagination");
  const total = Store.totalPages();

  if (total <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = "";

  html += `<button class="page-btn px-3 py-1 rounded border text-sm ${
    Store.currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-indigo-100"
  }" data-page="prev" ${Store.currentPage === 1 ? "disabled" : ""}>&laquo; Prev</button>`;

  for (let i = 1; i <= total; i++) {
    html += `<button class="page-btn px-3 py-1 rounded border text-sm ${
      i === Store.currentPage ? "active" : "hover:bg-indigo-100"
    }" data-page="${i}">${i}</button>`;
  }

  html += `<button class="page-btn px-3 py-1 rounded border text-sm ${
    Store.currentPage === total ? "opacity-40 cursor-not-allowed" : "hover:bg-indigo-100"
  }" data-page="next" ${Store.currentPage === total ? "disabled" : ""}>Next &raquo;</button>`;

  container.innerHTML = html;
}

function renderAll() {
  Store.applyFilters();
  renderTable(Store.getPage()); // Chỉ render trang hiện tại
  renderPagination();
}

function showUserDetail(user) {
  const content = document.getElementById("detail-content");
  content.innerHTML = `
    <div class="space-y-3 text-sm">
      <p><span class="font-semibold text-gray-700">ID:</span> ${user.id}</p>
      <p><span class="font-semibold text-gray-700">Name:</span> ${escapeHTML(user.name)}</p>
      <p><span class="font-semibold text-gray-700">Username:</span> ${escapeHTML(user.username)}</p>
      <p><span class="font-semibold text-gray-700">Email:</span> ${escapeHTML(user.email)}</p>
      <p><span class="font-semibold text-gray-700">Phone:</span> ${escapeHTML(user.phone || "—")}</p>
      <p><span class="font-semibold text-gray-700">Website:</span> ${escapeHTML(user.website || "—")}</p>
      <p><span class="font-semibold text-gray-700">Company:</span> ${escapeHTML(user.company?.name || "—")}</p>
      <p><span class="font-semibold text-gray-700">Address:</span> ${escapeHTML(
        [user.address?.street, user.address?.suite, user.address?.city, user.address?.zipcode]
          .filter(Boolean)
          .join(", ") || "—"
      )}</p>
    </div>`;
  document.getElementById("detail-modal").classList.remove("hidden");
}

function openForm(user) {
  const form = document.getElementById("user-form");
  form.reset();
  clearFormErrors();

  if (user) {
    document.getElementById("form-title").textContent = "Edit User";
    document.getElementById("form-user-id").value = user.id;
    document.getElementById("form-name").value = user.name || "";
    document.getElementById("form-username").value = user.username || "";
    document.getElementById("form-email").value = user.email || "";
    document.getElementById("form-phone").value = user.phone || "";
    document.getElementById("form-website").value = user.website || "";
    document.getElementById("form-company").value = user.company?.name || "";
    document.getElementById("form-city").value = user.address?.city || "";
  } else {
    document.getElementById("form-title").textContent = "Add User";
    document.getElementById("form-user-id").value = "";
  }

  document.getElementById("form-modal").classList.remove("hidden");
}

function clearFormErrors() {
  ["err-name", "err-username", "err-email"].forEach((id) => {
    const el = document.getElementById(id);
    el.textContent = "";
    el.classList.add("hidden");
  });
}

function showFieldError(fieldId, message) {
  const el = document.getElementById(fieldId);
  el.textContent = message;
  el.classList.remove("hidden");
}