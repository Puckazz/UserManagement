(async function init() {
  const loading = document.getElementById("loading");
  const empty = document.getElementById("empty-users")

  try {
    loading.classList.remove("hidden");
    empty.classList.add("hidden");
    const users = await fetchUsers();
    Store.users = users;
    Store.filtered = [...users];
    renderTable(Store.filtered);
  } catch (err) {
    showError("Could not load users. Please try again later.");
  } finally {
    loading.classList.add("hidden");
    empty.classList.remove("hidden"); 
  }
})();