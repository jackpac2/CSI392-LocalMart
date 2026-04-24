(function () {
  const products = window.LocalMartCatalog.productsBySlug;
  const cart = window.LocalMartCart;
  const minQty = 1;

  const quantityValue = document.getElementById("quantityValue");
  const decreaseButton = document.getElementById("decreaseQty");
  const increaseButton = document.getElementById("increaseQty");
  const addToCartButton = document.getElementById("addToCartButton");
  const productName = document.getElementById("productName");
  const productMeta = document.getElementById("productMeta");
  const productRating = document.getElementById("productRating");
  const productRatingRow = document.getElementById("productRatingRow");
  const productReviewSummary = document.getElementById("productReviewSummary");
  const productPrice = document.getElementById("productPrice");
  const productDescription = document.getElementById("productDescription");
  const stockText = document.getElementById("stockText");
  const reviewsList = document.getElementById("reviewsList");
  const productHeroImage = document.getElementById("productHeroImage");
  const cartToast = document.getElementById("cartToast");

  const params = new URLSearchParams(window.location.search);
  const product = products[params.get("product")] || products["leather-tote-bag"];
  const maxQty = product.stock;
  let quantity = 1;
  let toastTimeout;

  function formatPrice(amount) {
    return "P " + amount.toFixed(2);
  }

  function createRatingMarkup(rating, className) {
    const stars = Array.from({ length: 5 }, function (_, index) {
      return '<span class="' + (index < rating ? "is-filled" : "") + '"></span>';
    }).join("");

    return '<div class="rating ' + (className || "") + '" aria-hidden="true">' + stars + "</div>";
  }

  function createStarsMarkup(rating) {
    return Array.from({ length: 5 }, function (_, index) {
      return '<span class="' + (index < rating ? "is-filled" : "") + '"></span>';
    }).join("");
  }

  function showToast() {
    window.clearTimeout(toastTimeout);
    cartToast.classList.add("is-visible");
    toastTimeout = window.setTimeout(function () {
      cartToast.classList.remove("is-visible");
    }, 2200);
  }

  function renderProductContent() {
    document.title = "LocalMart - " + product.name;
    productName.textContent = product.name;
    productMeta.textContent = "by " + product.vendor + " | " + product.location;
    productHeroImage.src = product.image;
    productHeroImage.alt = product.name;
    productRating.innerHTML = createStarsMarkup(product.rating);
    productRatingRow.setAttribute("aria-label", product.rating + " out of 5 with " + product.reviewsCount + " reviews");
    productReviewSummary.textContent = product.rating.toFixed(1) + " (" + product.reviewsCount + " reviews)";
    productPrice.textContent = formatPrice(product.price);
    productDescription.textContent = product.description;
    stockText.textContent = "In stock: " + product.stock;
    reviewsList.innerHTML = product.reviews.map(function (review) {
      return (
        '<article class="review-card">' +
          '<div class="review-header">' +
            '<img class="review-avatar" src="' + review.avatar + '" alt="' + review.name + '">' +
            "<div>" +
              '<p class="reviewer-name">' + review.name + "</p>" +
              createRatingMarkup(review.rating, "small-rating") +
            "</div>" +
          "</div>" +
          '<p class="review-copy">' + review.text + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function render() {
    quantityValue.textContent = String(quantity);
    addToCartButton.textContent = "Add to cart - " + formatPrice(product.price * quantity);
    decreaseButton.disabled = quantity <= minQty;
    increaseButton.disabled = quantity >= maxQty;
  }

  decreaseButton.addEventListener("click", function () {
    if (quantity > minQty) {
      quantity -= 1;
      render();
    }
  });

  increaseButton.addEventListener("click", function () {
    if (quantity < maxQty) {
      quantity += 1;
      render();
    }
  });

  addToCartButton.addEventListener("click", function () {
    cart.addItem({
      slug: product.slug,
      quantity: quantity,
      stock: product.stock
    });
    showToast();
  });

  renderProductContent();
  render();
})();
