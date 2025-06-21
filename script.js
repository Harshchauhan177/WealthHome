document.addEventListener("DOMContentLoaded", () => {
  // Load properties from localStorage if available
  function loadProperties() {
    const saved = localStorage.getItem('properties');
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        window.properties.length = 0;
        arr.forEach(obj => window.properties.push(obj));
      } catch (e) { window.properties.length = 0; }
    }
  }

  // Save properties to localStorage
  function saveProperties() {
    localStorage.setItem('properties', JSON.stringify(window.properties));
  }

  // Initialize properties array from localStorage
  loadProperties();

  const form = document.getElementById("sellForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const imageInput = document.getElementById("image_file");
      const file = imageInput.files[0];
      if (!file) return;
      const imageUrl = URL.createObjectURL(file);

      const newProperty = new Property({
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value,
        price: document.getElementById("price").value,
        type: document.getElementById("type").value,
        beds: document.getElementById("beds").value,
        baths: document.getElementById("baths").value,
        sqft: document.getElementById("sqft").value,
        image_url: imageUrl
      });

      properties.push(newProperty);
      saveProperties();
      displayProperties();
      form.reset();
    });
  }

  function runSearch() {
    const query = document.getElementById("searchBar")?.value.toLowerCase() || "";
    const filtered = properties.filter(p => p.location.toLowerCase().includes(query));
    displayProperties(filtered);
  }

  if (document.getElementById("searchBar")) {
    document.getElementById("searchBar").addEventListener("input", runSearch);
    document.getElementById("searchBtn").addEventListener("click", (e) => {
      e.preventDefault();
      runSearch();
    });
  }

  function displayProperties(filteredList = properties) {
    const buyList = document.getElementById("buyList");
    const rentList = document.getElementById("rentList");
    if (!buyList || !rentList) return;

    buyList.innerHTML = "";
    rentList.innerHTML = "";

    filteredList.forEach((prop) => {
      const card = document.createElement("div");
      card.className = "property-card";
      card.innerHTML = `
        <img src="${prop.image_url}" alt="${prop.title}" style="width:100%; height:150px; object-fit:cover;">
        <h3>${prop.title}</h3>
        <p><strong>Location:</strong> ${prop.location}</p>
        <p><strong>Price:</strong> ₹${prop.price}</p>
        <p><strong>Beds:</strong> ${prop.beds} | <strong>Baths:</strong> ${prop.baths} | <strong>Sqft:</strong> ${prop.sqft}</p>
        <p>${prop.description}</p>
      `;

      if (prop.type === "buy") {
        buyList.appendChild(card);
      } else {
        rentList.appendChild(card);
      }
    });
  }

  // On page load, show properties if on index.html
  if (document.getElementById("buyList") && document.getElementById("rentList")) {
    displayProperties();
  }
}); 