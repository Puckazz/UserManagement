const Store = {
  users: [],
  filtered: [],
  searchTerm: "",
  filterCompany: "",
  filterCity: "",
  sortKey: "",
  currentPage: 2,
  perPage: 12,

  applyFilters() {
    let list = [...this.users];

    // Search by name + email
    if (this.searchTerm) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }

    if (this.filterCompany) {
      list = list.filter((u) => (u.company?.name || "") === this.filterCompany);
    }

    if (this.filterCity) {
      list = list.filter((u) => (u.address?.city || "") === this.filterCity);
    }

    if (this.sortKey) {
      const [field, dir] = this.sortKey.split("-");
      list.sort((a, b) => {
        const va = (field === "company" ? a.company?.name : a[field]) || "";
        const vb = (field === "company" ? b.company?.name : b[field]) || "";
        const result = va.localeCompare(vb, "vi");
        return dir === "asc" ? result : -result;
      });
    }

    this.filtered = list;

    const maxPage = Math.max(1, Math.ceil(list.length / this.perPage));
    if (this.currentPage > maxPage) this.currentPage = 1;
  },

  getPage() {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filtered.slice(start, start + this.perPage);
  },

  totalPages() {
    return Math.max(1, Math.ceil(this.filtered.length / this.perPage));
  },

  saveToLocal() {
    localStorage.setItem("um_users", JSON.stringify(this.users));
  },

  loadFromLocal() {
    const data = localStorage.getItem("um_users");
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },
};
