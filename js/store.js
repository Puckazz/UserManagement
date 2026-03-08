const Store = {
  users: [],
  filtered: [],
  searchTerm: "",
  filterCompany: "",
  filterCity: "",
  sortKey: "", // "name-asc", "email-desc", v.v.
  currentPage: 1,
  perPage: 5, // Đổi thành 3 để test, xong đổi lại 10

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
        let va, vb;
        if (field === "company") {
          va = (a.company?.name || "").toLowerCase();
          vb = (b.company?.name || "").toLowerCase();
        } else {
          va = (a[field] || "").toLowerCase();
          vb = (b[field] || "").toLowerCase();
        }
        if (va < vb) return dir === "asc" ? -1 : 1;
        if (va > vb) return dir === "asc" ? 1 : -1;
        return 0;
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

  /** Lưu users vào LocalStorage */
  saveToLocal() {
    localStorage.setItem("um_users", JSON.stringify(this.users));
  },

  /** Đọc users từ LocalStorage, trả về null nếu chưa có */
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
