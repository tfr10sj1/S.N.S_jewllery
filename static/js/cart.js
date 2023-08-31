// Funktion för att gå tillbaka till startsidan när knappen klickas
function goToHomePage() {
  window.location.href = "/";
}
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
