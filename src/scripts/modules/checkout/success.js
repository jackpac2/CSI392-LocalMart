(function () {
  const checkout = window.LocalMartCheckout;
  const order = checkout.readLastOrder();

  const orderReference = document.getElementById("orderReference");
  const successItem = document.getElementById("successItem");
  const successTotal = document.getElementById("successTotal");
  const successPayment = document.getElementById("successPayment");
  const successDelivery = document.getElementById("successDelivery");
  const estimatedDelivery = document.getElementById("estimatedDelivery");

  if (!order) {
    return;
  }

  orderReference.textContent = order.reference;
  successItem.textContent = order.itemLabel;
  successTotal.textContent = order.total;
  successPayment.textContent = order.payment;
  successDelivery.textContent = order.delivery;
  estimatedDelivery.textContent = order.estimatedDelivery;
})();
