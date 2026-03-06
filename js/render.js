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