(function () {
  const products = [
    {
      slug: "leather-tote-bag",
      name: "Leather tote bag",
      vendor: "Thabang's Bags",
      location: "Gaborone",
      category: "handmade",
      image: "../../assets/images/products/leather-tote-bag.svg",
      price: 320,
      rating: 4,
      reviewsCount: 24,
      stock: 8,
      description: "A structured everyday tote handcrafted for errands, work, and casual outings. It has a roomy interior and a clean neutral finish that fits the LocalMart aesthetic.",
      reviews: [
        { name: "Lerato N.", rating: 5, avatar: "../../assets/images/reviews/lerato-n.svg", text: "The bag feels durable and looks even better in person. It works well for daily use." },
        { name: "Kabelo D.", rating: 3, avatar: "../../assets/images/reviews/kabelo-d.svg", text: "Good design and finish. I would have liked slightly longer straps, but overall it is solid." }
      ]
    },
    {
      slug: "custom-birthday-cake",
      name: "Custom birthday cake",
      vendor: "Tebogo Bakes",
      location: "Gaborone",
      category: "food-bakery",
      image: "../../assets/images/products/custom-birthday-cake.svg",
      price: 180,
      rating: 4,
      reviewsCount: 18,
      stock: 5,
      description: "A made-to-order celebration cake with smooth buttercream finishing and flexible custom decoration options for birthdays and family events.",
      reviews: [
        { name: "Naledi P.", rating: 5, avatar: "../../assets/images/reviews/naledi-p.svg", text: "The cake was fresh, beautifully decorated, and delivered on time." },
        { name: "Tshepo R.", rating: 4, avatar: "../../assets/images/reviews/tshepo-r.svg", text: "Great flavor and presentation. Communication with the vendor was easy." }
      ]
    },
    {
      slug: "woven-wall-decor",
      name: "Woven wall decor",
      vendor: "Sello Crafts",
      location: "Gaborone",
      category: "handmade",
      image: "../../assets/images/products/woven-wall-decor.svg",
      price: 95,
      rating: 3,
      reviewsCount: 12,
      stock: 8,
      description: "Handwoven wall art designed to add texture and warmth to living rooms, bedrooms, or entry spaces with a simple natural palette.",
      reviews: [
        { name: "Boitumelo S.", rating: 4, avatar: "../../assets/images/reviews/boitumelo-s.svg", text: "Looks great on the wall and gives the room a handmade feel." },
        { name: "Aobakwe T.", rating: 3, avatar: "../../assets/images/reviews/aobakwe-t.svg", text: "Nice piece overall. Slightly smaller than I expected but still attractive." }
      ]
    },
    {
      slug: "beaded-necklace",
      name: "Beaded necklace",
      vendor: "Mpho Jewels",
      location: "Gaborone",
      category: "clothing",
      image: "../../assets/images/products/beaded-necklace.svg",
      price: 55,
      rating: 3,
      reviewsCount: 9,
      stock: 11,
      description: "A lightweight beaded necklace with a bright handcrafted finish that works for casual outfits, gifting, and local artisan styling.",
      reviews: [
        { name: "Kgomotso M.", rating: 4, avatar: "../../assets/images/reviews/kgomotso-m.svg", text: "Lovely beadwork and easy to wear with different outfits." },
        { name: "Refilwe K.", rating: 3, avatar: "../../assets/images/reviews/refilwe-k.svg", text: "Nice handmade item. The color was slightly softer than expected." }
      ]
    }
  ];

  const productsBySlug = products.reduce(function (accumulator, product) {
    accumulator[product.slug] = product;
    return accumulator;
  }, {});

  window.LocalMartCatalog = {
    products: products,
    productsBySlug: productsBySlug
  };
})();
