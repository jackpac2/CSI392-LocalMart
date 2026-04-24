(function () {
  const storageKey = "localmart-profile";
  const defaults = {
    fullName: "Lerato Ntakhwa",
    email: "lerato.ntakhwa@email.com",
    phone: "+267 7x xxx xxx",
    street: "Plot 123, Phase 2",
    city: "Gaborone",
    postcode: "0000",
    country: "Botswana",
    paymentPreference: "Orange Money",
    deliveryPreference: "Standard delivery",
    notifications: "Enabled"
  };

  const form = document.getElementById("profileForm");
  const editButton = document.getElementById("editProfileButton");
  const cancelButton = document.getElementById("cancelProfileButton");
  const actions = document.getElementById("profileActions");
  const profileName = document.getElementById("profileName");
  const profileSubtitle = document.getElementById("profileSubtitle");
  const avatarInitials = document.getElementById("avatarInitials");

  let editing = false;

  function readProfile() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      return Object.assign({}, defaults, parsed);
    } catch (error) {
      return Object.assign({}, defaults);
    }
  }

  function writeProfile(payload) {
    const next = Object.assign({}, defaults, payload);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    return next;
  }

  function getInitials(fullName) {
    return fullName.split(" ").filter(Boolean).slice(0, 2).map(function (part) {
      return part.charAt(0).toUpperCase();
    }).join("");
  }

  function fillForm(data) {
    Object.keys(defaults).forEach(function (key) {
      form.elements[key].value = data[key];
    });

    profileName.textContent = data.fullName;
    profileSubtitle.textContent = "Verified buyer | " + data.city + ", " + data.country;
    avatarInitials.textContent = getInitials(data.fullName);
  }

  function setEditing(nextState) {
    editing = nextState;
    Object.keys(defaults).forEach(function (key) {
      form.elements[key].disabled = !editing;
    });
    actions.hidden = !editing;
    editButton.querySelector("span").textContent = editing ? "Editing" : "Edit";
    editButton.disabled = editing;
  }

  editButton.addEventListener("click", function () {
    setEditing(true);
  });

  cancelButton.addEventListener("click", function () {
    fillForm(readProfile());
    setEditing(false);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const payload = {};
    Object.keys(defaults).forEach(function (key) {
      payload[key] = form.elements[key].value.trim();
    });

    fillForm(writeProfile(payload));
    setEditing(false);
  });

  fillForm(readProfile());
  setEditing(false);
})();
