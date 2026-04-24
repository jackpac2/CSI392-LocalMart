(function () {
  const catalog = window.LocalMartCatalog;
  const vendors = [
    {
      name: "Thabang's Bags",
      categories: ["handmade", "accessories", "gifts"],
      avatar: "../../assets/images/vendors/thabang-bags.svg"
    },
    {
      name: "Tebogo Bakes",
      categories: ["food-bakery", "gifts"],
      avatar: "../../assets/images/vendors/tebogo-bakes.svg"
    },
    {
      name: "Sello Crafts",
      categories: ["handmade", "decor"],
      avatar: "../../assets/images/vendors/sello-crafts.svg"
    },
    {
      name: "Mpho Jewels",
      categories: ["clothing", "accessories", "gifts"],
      avatar: "../../assets/images/vendors/mpho-jewels.svg"
    }
  ];
  const products = catalog.products;

  const state = {
    searchTerm: "",
    activeCategory: "all"
  };

  const vendorContainer = document.getElementById("featuredVendors");
  const productContainer = document.getElementById("popularProducts");
  const searchInput = document.getElementById("searchInput");
  const categoryFilters = document.getElementById("categoryFilters");
  const searchPanel = document.getElementById("searchPanel");
  const clearSearchButton = document.getElementById("clearSearchButton");
  const searchNavLink = document.getElementById("searchNavLink");
  const shouldFocusSearch = new URLSearchParams(window.location.search).get("focusSearch") === "1";

  function formatPrice(amount) {
    return "P " + amount.toFixed(0);
  }

  function createRating(rating) {
    const stars = Array.from({ length: 5 }, function (_, index) {
      return '<span class="' + (index < rating ? 'is-filled' : '') + '"></span>';
    });
    return '<div class="rating" aria-label="Rated ' + rating + ' out of 5">' + stars.join("") + "</div>";
  }

  function filterByCategory(item) {
    if (state.activeCategory === "all") {
      return true;
    }

    if (Array.isArray(item.categories)) {
      return item.categories.includes(state.activeCategory);
    }

    return item.category === state.activeCategory;
  }

  function setSearchMode(isActive) {
    searchPanel.classList.toggle("is-search-active", isActive);
    clearSearchButton.classList.toggle("is-visible", isActive || Boolean(state.searchTerm));
  }

  function filterBySearch(item) {
    if (!state.searchTerm) {
      return true;
    }

    const haystack = [item.name, item.vendor].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(state.searchTerm);
  }

  function renderVendors() {
    const filtered = vendors.filter(filterByCategory).filter(function (vendor) {
      if (!state.searchTerm) {
        return true;
      }

      return vendor.name.toLowerCase().includes(state.searchTerm);
    });

    vendorContainer.innerHTML = filtered.map(function (vendor) {
      return (
        '<article class="vendor-card">' +
          '<div class="vendor-avatar">' +
            '<img src="' + vendor.avatar + '" alt="' + vendor.name + '">' +
          "</div>" +
          '<h3 class="vendor-name">' + vendor.name + "</h3>" +
        "</article>"
      );
    }).join("");
  }

  function renderProducts() {
    const filtered = products.filter(filterByCategory).filter(filterBySearch);

    if (!filtered.length) {
      productContainer.innerHTML = '<div class="empty-state">No matching products found.</div>';
      return;
    }

    productContainer.innerHTML = filtered.map(function (product) {
      return (
        '<a class="product-card-link" href="../product-details/index.html?product=' + encodeURIComponent(product.slug) + '" aria-label="View ' + product.name + ' details">' +
          '<article class="product-card">' +
            '<div class="product-image">' +
              '<img src="' + product.image + '" alt="' + product.name + '">' +
            '</div>' +
            createRating(product.rating) +
            '<h3 class="product-title">' + product.name + '</h3>' +
            '<p class="product-vendor">' + product.vendor + '</p>' +
            '<p class="product-price">' + formatPrice(product.price) + "</p>" +
          "</article>" +
        "</a>"
      );
    }).join("");
  }

  function render() {
    setSearchMode(document.activeElement === searchInput || Boolean(state.searchTerm));
    renderVendors();
    renderProducts();
  }

  searchInput.addEventListener("input", function (event) {
    state.searchTerm = event.target.value.trim().toLowerCase();
    render();
  });

  searchInput.addEventListener("focus", function () {
    setSearchMode(true);
  });

  searchInput.addEventListener("blur", function () {
    window.setTimeout(function () {
      setSearchMode(Boolean(state.searchTerm));
    }, 50);
  });

  clearSearchButton.addEventListener("click", function () {
    state.searchTerm = "";
    searchInput.value = "";
    setSearchMode(false);
    render();
  });

  searchNavLink.addEventListener("click", function (event) {
    event.preventDefault();
    searchInput.focus();
    searchPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setSearchMode(true);

    document.querySelectorAll(".bottom-nav .nav-item").forEach(function (item) {
      item.classList.toggle("is-active", item === searchNavLink);
    });
  });

  categoryFilters.addEventListener("click", function (event) {
    const chip = event.target.closest("[data-category]");
    if (!chip) {
      return;
    }

    state.activeCategory = chip.dataset.category;

    categoryFilters.querySelectorAll(".chip").forEach(function (button) {
      button.classList.toggle("is-active", button === chip);
    });

    render();
  });

  render();

  if (shouldFocusSearch) {
    window.setTimeout(function () {
      searchNavLink.click();
    }, 60);
  }
})();
