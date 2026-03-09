(async function init() {
  const loading = document.getElementById("loading");
  const empty = document.getElementById("empty-users");

  try {
    loading.classList.remove("hidden");
    empty.classList.add("hidden");

    // Ưu tiên đọc từ LocalStorage, nếu không có thì fetch API
    const localUsers = Store.loadFromLocal();
    if (localUsers) {
      Store.users = localUsers;
    } else {
      const users = await fetchUsers();
      Store.users = users;
      Store.saveToLocal();
    }

    renderFilters();
    renderAll();
  } catch (err) {
    showError("Could not load users. Please try again later.");
  } finally {
    loading.classList.add("hidden");
    empty.classList.remove("hidden");
  }

  // Search
  document.getElementById("search-input").addEventListener(
    "input",
    debounce((e) => {
      Store.searchTerm = e.target.value;
      Store.currentPage = 1;
      renderAll();
    }, 300),
  );

  // Filter Company
  document.getElementById("filter-company").addEventListener("change", (e) => {
    Store.filterCompany = e.target.value;
    Store.currentPage = 1;
    renderAll();
  });

  // Filter City
  document.getElementById("filter-city").addEventListener("change", (e) => {
    Store.filterCity = e.target.value;
    Store.currentPage = 1;
    renderAll();
  });

  // Sort
  document.getElementById("sort-select").addEventListener("change", (e) => {
    Store.sortKey = e.target.value;
    renderAll();
  });

  // Pagination (event delegation)
  document.getElementById("pagination").addEventListener("click", (e) => {
    const btn = e.target.closest(".page-btn");
    if (!btn || btn.disabled) return;

    const page = btn.dataset.page;
    if (page === "prev") {
      Store.currentPage = Math.max(1, Store.currentPage - 1);
    } else if (page === "next") {
      Store.currentPage = Math.min(Store.totalPages(), Store.currentPage + 1);
    } else {
      Store.currentPage = parseInt(page, 10);
    }
    renderAll();
  });

  // Table action buttons (event delegation)
  document.getElementById("user-table-body").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = parseInt(btn.dataset.id, 10);
    const user = Store.users.find((u) => u.id === id);
    if (!user) return;

    if (btn.classList.contains("btn-view")) {
      showUserDetail(user);
    } else if (btn.classList.contains("btn-edit")) {
      openForm(user);
    } else if (btn.classList.contains("btn-delete")) {
      openDeleteConfirm(user);
    }
  });

  // Add User button
  document.getElementById("btn-add-user").addEventListener("click", () => {
    openForm(null);
  });

  // Form submit (Add / Edit)
  document.getElementById("user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFormErrors();

    const name = document.getElementById("form-name").value;
    const username = document.getElementById("form-username").value;
    const email = document.getElementById("form-email").value;
    const phone = document.getElementById("form-phone").value;
    const website = document.getElementById("form-website").value;
    const company = document.getElementById("form-company").value;
    const city = document.getElementById("form-city").value;
    const editId = document.getElementById("form-user-id").value;

    // Validate
    let hasError = false;
    const nameErr = validateName(name);
    if (nameErr) {
      showFieldError("err-name", nameErr);
      hasError = true;
    }
    const usernameErr = validateUsername(username);
    if (usernameErr) {
      showFieldError("err-username", usernameErr);
      hasError = true;
    }
    const emailErr = validateEmail(email);
    if (emailErr) {
      showFieldError("err-email", emailErr);
      hasError = true;
    }
    if (hasError) return;

    const userData = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim(),
      company: { name: company.trim() },
      address: { city: city.trim() },
    };

    try {
      if (editId) {
        const idx = Store.users.findIndex((u) => u.id === parseInt(editId, 10));
        if (idx !== -1) Store.users[idx] = { ...Store.users[idx], ...userData };
      } else {
        const maxId = Store.users.reduce((max, u) => Math.max(max, u.id), 0);
        const newUser = { ...userData, id: maxId + 1 };
        Store.users.push(newUser);
      }

      Store.saveToLocal();
      document.getElementById("form-modal").classList.add("hidden");
      renderFilters();
      renderAll();
    } catch (err) {
      showError("Failed to save user. Please try again.");
      console.error(err);
    }
  });

  // Delete confirmation
  function openDeleteConfirm(user) {
    document.getElementById("delete-message").textContent =
      `Are you sure you want to delete "${user.name}"?`;
    document.getElementById("delete-modal").classList.remove("hidden");

    const confirmBtn = document.getElementById("btn-confirm-delete");
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

    newBtn.addEventListener("click", async () => {
      try {
        Store.users = Store.users.filter((u) => u.id !== user.id);
        Store.saveToLocal();
        document.getElementById("delete-modal").classList.add("hidden");
        renderFilters();
        renderAll();
      } catch (err) {
        showError("Failed to delete user. Please try again.");
        console.error(err);
      }
    });
  }
})();
