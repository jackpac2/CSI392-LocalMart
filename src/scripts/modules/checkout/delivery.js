(function () {
  const cart = window.LocalMartCart;
  const catalog = window.LocalMartCatalog.productsBySlug;
  const checkout = window.LocalMartCheckout;
  const deliveryFees = {
    standard: 25,
    express: 60,
    pickup: 0
  };

  const form = document.getElementById("deliveryForm");
  const summaryItems = document.getElementById("summaryItems");
  const summarySubtotal = document.getElementById("summarySubtotal");
  const continueButton = document.getElementById("continueButton");
  const toast = document.getElementById("deliveryToast");
  let toastTimeout;

  function formatPrice(amount) {
    return "P " + amount.toFixed(2);
  }

  function getCartItems() {
    return cart.read().map(function (item) {
      const product = catalog[item.slug];
      if (!product) {
        return null;
      }

      return {
        quantity: item.quantity,
        price: product.price
      };
    }).filter(Boolean);
  }

  function setInitialValues() {
    const saved = checkout.readDelivery();
    form.fullName.value = saved.fullName;
    form.phone.value = saved.phone;
    form.address.value = saved.address;
    form.city.value = saved.city;
    form.postcode.value = saved.postcode;

    form.querySelectorAll('input[name="deliveryMethod"]').forEach(function (input) {
      input.checked = input.value === saved.deliveryMethod;
    });

    syncMethodCards();
  }

  function syncMethodCards() {
    form.querySelectorAll(".method-card").forEach(function (card) {
      const input = card.querySelector('input[name="deliveryMethod"]');
      card.classList.toggle("is-selected", input.checked);
    });
  }

  function renderSummary() {
    const items = getCartItems();
    const itemCount = items.reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
    const subtotal = items.reduce(function (total, item) {
      return total + (item.price * item.quantity);
    }, 0);

    summaryItems.textContent = String(itemCount);
    summarySubtotal.textContent = formatPrice(subtotal);
    continueButton.disabled = !items.length;
  }

  function showToast() {
    window.clearTimeout(toastTimeout);
    toast.classList.add("is-visible");
    toastTimeout = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2000);
  }

  form.addEventListener("change", function (event) {
    if (event.target.name === "deliveryMethod") {
      syncMethodCards();
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const payload = {
      fullName: form.fullName.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      postcode: form.postcode.value.trim(),
      deliveryMethod: form.querySelector('input[name="deliveryMethod"]:checked').value,
      deliveryFee: deliveryFees[form.querySelector('input[name="deliveryMethod"]:checked').value]
    };

    checkout.writeDelivery(payload);
    showToast();
    window.setTimeout(function () {
      window.location.href = "../checkout-payment/index.html";
    }, 350);
  });

  setInitialValues();
  renderSummary();
})();
