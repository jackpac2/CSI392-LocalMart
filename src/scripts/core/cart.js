(function () {
  const storageKey = "localmart-cart";

  function read() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function write(items) {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
    return items;
  }

  function addItem(payload) {
    const items = read();
    const existing = items.find(function (item) {
      return item.slug === payload.slug;
    });

    if (existing) {
      existing.quantity = Math.min(existing.quantity + payload.quantity, payload.stock);
    } else {
      items.push({
        slug: payload.slug,
        quantity: Math.min(payload.quantity, payload.stock)
      });
    }

    return write(items);
  }

  function updateQuantity(slug, quantity, stock) {
    const items = read().map(function (item) {
      if (item.slug !== slug) {
        return item;
      }

      return {
        slug: item.slug,
        quantity: Math.max(1, Math.min(quantity, stock))
      };
    });

    return write(items);
  }

  function removeItem(slug) {
    return write(read().filter(function (item) {
      return item.slug !== slug;
    }));
  }

  function clear() {
    return write([]);
  }

  function count() {
    return read().reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
  }

  window.LocalMartCart = {
    read: read,
    addItem: addItem,
    updateQuantity: updateQuantity,
    removeItem: removeItem,
    clear: clear,
    count: count
  };
})();
