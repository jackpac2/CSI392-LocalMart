(function () {
  const cart = window.LocalMartCart;
  const catalog = window.LocalMartCatalog.productsBySlug;
  const checkout = window.LocalMartCheckout;

  const paymentLabels = {
    "orange-money": "Orange Money",
    "mascom-myzaka": "Mascom MyZaka",
    card: "Debit / credit card",
    "pay-on-delivery": "Pay on delivery"
  };

  const deliveryLabels = {
    standard: "Standard - P 25",
    express: "Express - P 60",
    pickup: "Pickup"
  };
  const deliveryEta = {
    standard: "3-5 business days",
    express: "1-2 business days",
    pickup: "Vendor pickup"
  };

  const confirmItem = document.getElementById("confirmItem");
  const confirmVendor = document.getElementById("confirmVendor");
  const confirmQty = document.getElementById("confirmQty");
  const confirmDelivery = document.getElementById("confirmDelivery");
  const confirmPayment = document.getElementById("confirmPayment");
  const confirmTotal = document.getElementById("confirmTotal");
  const deliverToName = document.getElementById("deliverToName");
  const deliverToAddress = document.getElementById("deliverToAddress");
  const placeOrderButton = document.getElementById("placeOrderButton");

  function createOrderReference() {
    const now = new Date();
    const datePart = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0");
    const randomPart = String(Math.floor(Math.random() * 9000) + 1000);
    return "LM-" + datePart + randomPart;
  }

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
        name: product.name,
        vendor: product.vendor,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity
      };
    }).filter(Boolean);
  }

  function render() {
    const items = getDetailedItems();
    const delivery = checkout.readDelivery();
    const payment = checkout.readPayment();
    const subtotal = items.reduce(function (total, item) {
      return total + item.lineTotal;
    }, 0);
    const totalQty = items.reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
    const total = subtotal + (delivery.deliveryFee || 0);

    confirmItem.textContent = items.length === 1 ? items[0].name : items.length + " items";
    confirmVendor.textContent = items.length === 1 ? items[0].vendor : "Multiple vendors";
    confirmQty.textContent = String(totalQty);
    confirmDelivery.textContent = deliveryLabels[delivery.deliveryMethod] || delivery.deliveryMethod;
    confirmPayment.textContent = paymentLabels[payment.paymentMethod] || payment.paymentMethod;
    confirmTotal.textContent = formatPrice(total);
    deliverToName.textContent = delivery.fullName;
    deliverToAddress.textContent = delivery.address + ", " + delivery.city + " " + delivery.postcode;
    placeOrderButton.textContent = "Place order - " + formatPrice(total);
    placeOrderButton.disabled = !items.length;
  }

  placeOrderButton.addEventListener("click", function () {
    const items = getDetailedItems();
    if (!items.length) {
      return;
    }

    const delivery = checkout.readDelivery();
    const payment = checkout.readPayment();
    const subtotal = items.reduce(function (total, item) {
      return total + item.lineTotal;
    }, 0);
    const totalQty = items.reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
    const total = subtotal + (delivery.deliveryFee || 0);

    checkout.writeLastOrder({
      reference: createOrderReference(),
      itemLabel: items.length === 1 ? items[0].name : items.length + " items",
      vendor: items.length === 1 ? items[0].vendor : "Multiple vendors",
      quantity: totalQty,
      total: formatPrice(total),
      payment: paymentLabels[payment.paymentMethod] || payment.paymentMethod,
      delivery: deliveryLabels[delivery.deliveryMethod] || delivery.deliveryMethod,
      estimatedDelivery: deliveryEta[delivery.deliveryMethod] || "3-5 business days",
      addressName: delivery.fullName,
      address: delivery.address + ", " + delivery.city + " " + delivery.postcode
    });

    cart.clear();
    window.location.href = "../order-success/index.html";
  });

  render();
})();
