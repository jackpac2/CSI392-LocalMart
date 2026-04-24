(function () {
  const deliveryFee = 25;

  const catalog = window.LocalMartCatalog.productsBySlug;
  const cart = window.LocalMartCart;

  const cartList = document.getElementById("cartList");
  const itemCount = document.getElementById("itemCount");
  const subtotalValue = document.getElementById("subtotalValue");
  const deliveryValue = document.getElementById("deliveryValue");
  const totalValue = document.getElementById("totalValue");
  const checkoutButton = document.getElementById("checkoutButton");
  const clearCartButton = document.getElementById("clearCartButton");

  function formatPrice(amount) {
    return "P " + amount.toFixed(2);
  }

  function getDetailedItems() {
    return cart.read().map(function (item) {
      const product = catalog[item.slug];
      if (!product) {
        return null;
      }

      return {
        slug: item.slug,
        quantity: item.quantity,
        product: product,
        lineTotal: product.price * item.quantity
      };
    }).filter(Boolean);
  }

  function renderEmptyState() {
    cartList.innerHTML =
      '<section class="empty-state">' +
        "<h2>Your cart is empty</h2>" +
        "<p>Add products from LocalMart and they will show up here for checkout.</p>" +
        '<a class="empty-link" href="../home/index.html">Continue shopping</a>' +
      "</section>";
  }

  function renderItems(items) {
    cartList.innerHTML = items.map(function (item) {
      return (
        '<article class="cart-card">' +
          '<div class="cart-image-frame">' +
            '<img src="' + item.product.image + '" alt="' + item.product.name + '">' +
          '</div>' +
          '<div class="cart-body">' +
            '<div class="cart-title-row">' +
              '<h2 class="cart-title">' + item.product.name + '</h2>' +
              '<button class="remove-button" type="button" data-remove="' + item.slug + '">Remove</button>' +
            '</div>' +
            '<p class="cart-meta">' + item.product.vendor + ' | ' + item.product.location + '</p>' +
            '<p class="cart-price">' + formatPrice(item.product.price) + '</p>' +
            '<div class="cart-actions">' +
              '<div class="quantity-control">' +
                '<button type="button" data-decrease="' + item.slug + '"' + (item.quantity <= 1 ? ' disabled' : '') + '>-</button>' +
                '<span class="quantity-value">' + item.quantity + '</span>' +
                '<button type="button" data-increase="' + item.slug + '"' + (item.quantity >= item.product.stock ? ' disabled' : '') + '>+</button>' +
              '</div>' +
              '<p class="line-total">' + formatPrice(item.lineTotal) + '</p>' +
            '</div>' +
          '</div>' +
        "</article>"
      );
    }).join("");
  }

  function renderSummary(items) {
    const count = items.reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
    const subtotal = items.reduce(function (total, item) {
      return total + item.lineTotal;
    }, 0);
    const total = items.length ? subtotal + deliveryFee : 0;

    itemCount.textContent = String(count);
    subtotalValue.textContent = formatPrice(subtotal);
    deliveryValue.textContent = items.length ? formatPrice(deliveryFee) : formatPrice(0);
    totalValue.textContent = formatPrice(total);
    checkoutButton.disabled = !items.length;
    clearCartButton.disabled = !items.length;
  }

  function render() {
    const items = getDetailedItems();
    if (items.length) {
      renderItems(items);
    } else {
      renderEmptyState();
    }
    renderSummary(items);
  }

  cartList.addEventListener("click", function (event) {
    const increase = event.target.closest("[data-increase]");
    const decrease = event.target.closest("[data-decrease]");
    const remove = event.target.closest("[data-remove]");

    if (increase) {
      const slug = increase.getAttribute("data-increase");
      const product = catalog[slug];
      const item = cart.read().find(function (entry) {
        return entry.slug === slug;
      });
      if (product && item) {
        cart.updateQuantity(slug, item.quantity + 1, product.stock);
        render();
      }
      return;
    }

    if (decrease) {
      const slug = decrease.getAttribute("data-decrease");
      const product = catalog[slug];
      const item = cart.read().find(function (entry) {
        return entry.slug === slug;
      });
      if (product && item) {
        cart.updateQuantity(slug, item.quantity - 1, product.stock);
        render();
      }
      return;
    }

    if (remove) {
      cart.removeItem(remove.getAttribute("data-remove"));
      render();
    }
  });

  clearCartButton.addEventListener("click", function () {
    cart.clear();
    render();
  });

  checkoutButton.addEventListener("click", function () {
    if (!checkoutButton.disabled) {
      window.location.href = "../checkout-delivery/index.html";
    }
  });

  render();
})();
