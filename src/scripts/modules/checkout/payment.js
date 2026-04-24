(function () {
  const cart = window.LocalMartCart;
  const catalog = window.LocalMartCatalog.productsBySlug;
  const checkout = window.LocalMartCheckout;

  const paymentLabels = {
    "orange-money": "Orange Money number",
    "mascom-myzaka": "Mascom MyZaka number",
    card: "Card reference",
    "pay-on-delivery": "Payment note"
  };

  const form = document.getElementById("paymentForm");
  const summaryProductLabel = document.getElementById("summaryProductLabel");
  const summaryProductTotal = document.getElementById("summaryProductTotal");
  const summaryDeliveryFee = document.getElementById("summaryDeliveryFee");
  const summaryGrandTotal = document.getElementById("summaryGrandTotal");
  const paymentNumberLabel = document.getElementById("paymentNumberLabel");
  const orangeMoneyNumber = document.getElementById("orangeMoneyNumber");
  const reviewOrderButton = document.getElementById("reviewOrderButton");
  const toast = document.getElementById("paymentToast");
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
        name: product.name,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity
      };
    }).filter(Boolean);
  }

  function syncMethodCards() {
    const selected = form.querySelector('input[name="paymentMethod"]:checked').value;

    form.querySelectorAll(".method-card").forEach(function (card) {
      const input = card.querySelector('input[name="paymentMethod"]');
      card.classList.toggle("is-selected", input.checked);
    });

    paymentNumberLabel.textContent = paymentLabels[selected];
    orangeMoneyNumber.disabled = selected === "pay-on-delivery";
    if (selected === "pay-on-delivery") {
      orangeMoneyNumber.value = "Pay at drop-off";
    } else {
      const saved = checkout.readPayment();
      orangeMoneyNumber.value = saved.orangeMoneyNumber;
    }
  }

  function setInitialValues() {
    const saved = checkout.readPayment();
    form.querySelectorAll('input[name="paymentMethod"]').forEach(function (input) {
      input.checked = input.value === saved.paymentMethod;
    });

    orangeMoneyNumber.value = saved.orangeMoneyNumber;
    syncMethodCards();
  }

  function renderSummary() {
    const items = getCartItems();
    const delivery = checkout.readDelivery();
    const subtotal = items.reduce(function (total, item) {
      return total + item.lineTotal;
    }, 0);
    const label = items.length === 1
      ? items[0].name + " x " + items[0].quantity
      : items.length + " items";

    summaryProductLabel.textContent = label;
    summaryProductTotal.textContent = formatPrice(subtotal);
    summaryDeliveryFee.textContent = formatPrice(delivery.deliveryFee || 0);
    summaryGrandTotal.textContent = formatPrice(subtotal + (delivery.deliveryFee || 0));
    reviewOrderButton.disabled = !items.length;
  }

  function showToast() {
    window.clearTimeout(toastTimeout);
    toast.classList.add("is-visible");
    toastTimeout = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2000);
  }

  form.addEventListener("change", function (event) {
    if (event.target.name === "paymentMethod") {
      syncMethodCards();
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedMethod = form.querySelector('input[name="paymentMethod"]:checked').value;
    checkout.writePayment({
      paymentMethod: selectedMethod,
      orangeMoneyNumber: orangeMoneyNumber.value.trim()
    });

    showToast();
    window.setTimeout(function () {
      window.location.href = "../checkout-confirm/index.html";
    }, 350);
  });

  setInitialValues();
  renderSummary();
})();
