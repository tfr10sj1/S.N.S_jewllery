
  // Ersätt med din Firebase-projektkonfiguration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDI_bZFy1g73Hq_SLZcgy3Y0w4SWPOmAu0",
  authDomain: "sns-jewllery.firebaseapp.com",
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
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      // Uppdatera din HTML med data här
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
