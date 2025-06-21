import { supabase } from './supabase-client.js';
import { Property } from './data-model.js';

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById('loader');
  const successModal = document.getElementById('successModal');
  const closeModalButton = document.querySelector('#successModal .close-button');

  const showLoader = () => loader.classList.add('show');
  const hideLoader = () => loader.classList.remove('show');

  const showSuccessModal = () => successModal && successModal.classList.add('show');
  const hideSuccessModal = () => successModal && successModal.classList.remove('show');

  if(closeModalButton) {
    closeModalButton.addEventListener('click', hideSuccessModal);
  }
  window.addEventListener('click', (event) => {
    if (event.target === successModal) {
      hideSuccessModal();
    }
  });

  let properties = [];

  // fetch properties from supabase
  async function fetchProperties() {
    showLoader();
    try {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }
      properties = data;
      displayProperties();
    } catch (e) {
      console.error('An unexpected error occurred:', e);
    } finally {
      hideLoader();
    }
  }

  const form = document.getElementById("sellForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoader();

      const maxRetries = 3;
      let lastError = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const imageInput = document.getElementById("image_file");
          const file = imageInput.files[0];
          if (!file) {
            alert('Please select an image file to upload.');
            hideLoader();
            return;
          }

          const fileName = `${Date.now()}-${file.name}`;
          const { error: fileError } = await supabase.storage
            .from('property-images')
            .upload(fileName, file);
          if (fileError) throw fileError;

          const { data: urlData } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);
          const imageUrl = urlData.publicUrl;

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

          const { error: insertError } = await supabase
            .from('properties')
            .insert([newProperty]);
          if (insertError) throw insertError;

          // Success!
          showSuccessModal();
          form.reset();
          await fetchProperties(); // Refresh the list on the page
          return; // Exit after success

        } catch (error) {
          lastError = error;
          console.error(`Submit attempt ${attempt} failed:`, error);
          if (attempt < maxRetries) {
            await new Promise(res => setTimeout(res, 1000 * attempt)); // Wait before retrying
          }
        }
      }

      // This part only runs if all retries have failed
      hideLoader();
      alert(`Submission failed after ${maxRetries} attempts. Please try again. Error: ${lastError.message}`);
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

  // On page load, show properties
  fetchProperties();
}); 