(function () {
  const deliveryStorageKey = "localmart-checkout-delivery";
  const paymentStorageKey = "localmart-checkout-payment";
  const orderStorageKey = "localmart-last-order";

  const deliveryDefaults = {
    fullName: "Lerato Ntakhwa",
    phone: "+267 7x xxx xxx",
    address: "Plot 123, Phase 2, Gaborone",
    city: "Gaborone",
    postcode: "0000",
    deliveryMethod: "standard"
  };

  const paymentDefaults = {
    paymentMethod: "orange-money",
    orangeMoneyNumber: "+267 7x xxx xxx"
  };

  function readDelivery() {
    try {
      const raw = window.localStorage.getItem(deliveryStorageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      return Object.assign({}, deliveryDefaults, parsed);
    } catch (error) {
      return Object.assign({}, deliveryDefaults);
    }
  }

  function writeDelivery(payload) {
    const next = Object.assign({}, deliveryDefaults, payload);
    window.localStorage.setItem(deliveryStorageKey, JSON.stringify(next));
    return next;
  }

  function readPayment() {
    try {
      const raw = window.localStorage.getItem(paymentStorageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      return Object.assign({}, paymentDefaults, parsed);
    } catch (error) {
      return Object.assign({}, paymentDefaults);
    }
  }

  function writePayment(payload) {
    const next = Object.assign({}, paymentDefaults, payload);
    window.localStorage.setItem(paymentStorageKey, JSON.stringify(next));
    return next;
  }

  function readLastOrder() {
    try {
      const raw = window.localStorage.getItem(orderStorageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeLastOrder(payload) {
    window.localStorage.setItem(orderStorageKey, JSON.stringify(payload));
    return payload;
  }

  window.LocalMartCheckout = {
    readDelivery: readDelivery,
    writeDelivery: writeDelivery,
    readPayment: readPayment,
    writePayment: writePayment,
    readLastOrder: readLastOrder,
    writeLastOrder: writeLastOrder,
    deliveryDefaults: Object.assign({}, deliveryDefaults),
    paymentDefaults: Object.assign({}, paymentDefaults)
  };
})();
