// Notera: Denna kod är anpassad för frontend och använder fetch API för att interagera med backend.

// Funktion för att läsa in produkter från Firestore
async function getWebshopFromFirestore() {
  try {
    const snapshot = await firebase.firestore().collection('webshop').get();
    const products = snapshot.docs.map(doc => doc.data());
    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function saveImageToStorage(imageFile) {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child('images/' + imageFile.name);
  await imageRef.put(imageFile);
  const imageUrl = await imageRef.getDownloadURL();
  return imageUrl;
}
  
async function saveImageToStorage(imageFile) {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child('images/' + imageFile.name);
  await imageRef.put(imageFile);
  const imageUrl = await imageRef.getDownloadURL();
  return imageUrl;
}

// Funktion för att visa produkter på startsidan
async function showProducts() {
  const products = await getWebshopFromFirestore();
  // Koda här för att visa produkterna på startsidan (index.html)
}
  
// Funktion för att bearbeta och spara bild
async function saveProcessedImage(productInfo, processedImage) {
  const formData = new FormData();
  formData.append('image', processedImage);
  formData.append('product_info', JSON.stringify(productInfo));

  try {
    const response = await fetch('/save', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    alert(data.message);
    location.reload(); // Uppdatera sidan efter sparande
  } catch (error) {
    console.error(error);
    alert('Det uppstod ett fel. Försök igen senare.');
  }
}
  
  // Funktion för att lägga till produkt i varukorgen
  async function addToCart(productInfo) {
    const formData = new FormData();
    formData.append('product_info', JSON.stringify(productInfo));
  
    try {
      const response = await fetch('/addToCart', {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert('Det uppstod ett fel. Försök igen senare.');
    }
  }
  
  // Funktion för att ta bort produkt från varukorgen
  async function removeItemFromCart(itemId) {
    try {
      const response = await fetch(`/remove_item/${itemId}`, {
        method: 'POST'
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Produkten har tagits bort från varukorgen.');
        location.reload(); // Uppdatera sidan efter borttagning
      } else {
        alert('Kunde inte ta bort produkten från varukorgen.');
      }
    } catch (error) {
      console.error(error);
      alert('Det uppstod ett fel. Försök igen senare.');
    }
  }
  
  // Funktion för att visa varukorgen
  async function showCart() {
    try {
      const response = await fetch('/cart');
      const { ordered_items, total_price } = await response.json();
      // Koda här för att visa varukorgen på cart.html
    } catch (error) {
      console.error(error);
      // Visa en felmeddelande till användaren
    }
  }
  
  // Anropa showProducts() när dokumentet är laddat
  document.addEventListener('DOMContentLoaded', showProducts);
  
  // Lyssna på klick för att lägga till produkt i varukorgen
  document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('add-to-cart')) {
      const productInfo = {
        name: event.target.getAttribute('data-name'),
        price: event.target.getAttribute('data-price'),
        weight: event.target.getAttribute('data-weight'),
        metal_type: event.target.getAttribute('data-metal_type')
      };
      await addToCart(productInfo);
    }
  });
  
  // Lyssna på klick för att ta bort produkt från varukorgen
  document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('remove-item')) {
      const itemId = event.target.getAttribute('data-item-id');
      await removeItemFromCart(itemId);
    }
  });
  
  // Lyssna på klick för att visa varukorgen
  document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('view-cart')) {
      showCart();
    }
  });
  