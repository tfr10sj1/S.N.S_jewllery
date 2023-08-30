// ... (din kod för firebaseConfig och initialisering)

// Hämta data från Firestore och uppdatera din HTML
db.collection("din_kollektion").get().then((querySnapshot) => {
  var productContainer = document.querySelector(".product-list");

  querySnapshot.forEach((doc) => {
    var data = doc.data();
    var productRow = document.createElement("div");
    productRow.className = "product-row";

    var productImage = document.createElement("img");
    productImage.src = "/static/orders/" + data.image_url;
    productImage.alt = data.name;
    productImage.className = "product-image";
    productRow.appendChild(productImage);

    var productInfo = document.createElement("div");
    productInfo.className = "product-info";
    productInfo.innerHTML = `
      <p><strong>Namn:</strong> ${data.name}</p>
      <p><strong>Pris:</strong> ${data.price}</p>
      <p><strong>Vikt:</strong> ${data.weight}</p>
      <p><strong>Metalltyp:</strong> ${data.metal_type}</p>
    `;
    productRow.appendChild(productInfo);

    var removeButton = document.createElement("button");
    removeButton.textContent = "Ta bort";
    removeButton.onclick = function() {
      removeFromCart(data.image_url);
    };
    productRow.appendChild(removeButton);

    productContainer.appendChild(productRow);
  });
});

function removeFromCart(itemId) {
  fetch('/remove_item/' + itemId, {
    method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Produkten har tagits bort från kundvagnen.");
      window.location.reload(); // Uppdatera sidan efter borttagningen
    } else {
      alert("Det uppstod ett fel. Försök igen senare.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Ett fel uppstod. Försök igen senare.");
  });
}
