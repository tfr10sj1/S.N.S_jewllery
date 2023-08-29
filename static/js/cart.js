// Ersätt med din Firebase-projektkonfiguration
const firebaseConfig = {
  apiKey: "AIzaSyDI_bZFy1g73Hq_SLZcgy3Y0w4SWPOmAu0",
  authDomain: "sns-jewllery.firebaseapp.com",
  databaseURL: "https://sns-jewllery-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sns-jewllery",
  storageBucket: "sns-jewllery.appspot.com",
  messagingSenderId: "390632077656",
  appId: "1:390632077656:web:a5b84a0597da42c78c8d2d",
  measurementId: "G-VR33F4VQP4"
};

// Initialisera Firebase
firebase.initializeApp(firebaseConfig);

// Hämta referens till Firestore-databasen
var db = firebase.firestore();

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
      removeFromCart(data.name, doc.id);
    };
    productRow.appendChild(removeButton);

    productContainer.appendChild(productRow);
  });
});

function removeFromCart(productName, itemId) {
  fetch('/remove_item/' + itemId, {
    method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(productName + " har tagits bort från kundvagnen.");
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

// Funktion för att gå tillbaka till startsidan när knappen klickas
function goToHomePage() {
  window.location.href = "/";
}
