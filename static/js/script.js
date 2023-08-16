// Funktion för att gå tillbaka till startsidan när knappen klickas
function goToHomePage() {
  window.location.href = "/index";
}

// Funktion för att uppdatera bilden när något ändras
function updateImage() {
  processImage();
}

// Lyssna på ändringar i slidern för rotation
document.getElementById("rotate-slider").addEventListener("input", function () {
  document.getElementById("rotate-input").value = this.value;
  updateImage();
});

// Lyssna på ändringar i inputfältet för rotation
document.getElementById("rotate-input").addEventListener("input", function () {
  document.getElementById("rotate-slider").value = this.value;
  updateImage();
});

// Lyssna på ändringar i slidern för bredd
document.getElementById("width-slider").addEventListener("input", function () {
  document.getElementById("width-input").value = this.value;
  updateImage();
});

// Lyssna på ändringar i inputfältet för bredd
document.getElementById("width-input").addEventListener("input", function () {
  document.getElementById("width-slider").value = this.value;
  updateImage();
});

// Lyssna på ändringar i slidern för längd
document.getElementById("height-slider").addEventListener("input", function () {
  document.getElementById("height-input").value = this.value;
  updateImage();
});

// Lyssna på ändringar i inputfältet för längd
document.getElementById("height-input").addEventListener("input", function () {
  document.getElementById("height-slider").value = this.value;
  updateImage();
});

// Lyssna på ändringar i slidern för horisontell position
document.getElementById("horizontal-slider").addEventListener("input", function () {
  document.getElementById("horizontal-input").value = this.value;
  updateImage();
});

// Lyssna på ändringar i inputfältet för horisontell position
document.getElementById("horizontal-input").addEventListener("input", function () {
  document.getElementById("horizontal-slider").value = this.value;
  updateImage();
});

// Lyssna på ändringar i slidern för vertikal position
document.getElementById("vertical-slider").addEventListener("input", function () {
  document.getElementById("vertical-input").value = this.value;
  updateImage();
});

// Lyssna på ändringar i inputfältet för vertikal position
document.getElementById("vertical-input").addEventListener("input", function () {
  document.getElementById("vertical-slider").value = this.value;
  updateImage();
});

// Lyssna på ändringar i "Välj fil" inputfältet
document.getElementById("upload-image").addEventListener("change", function () {
  updateImage();
});

// Lyssna på ändringar i "Välj form" inputfältet
document.getElementById("shape-select").addEventListener("change", function () {

  updateImage();
});

function processImage() {
  var selectedShape = document.getElementById("shape-select").value;

  // Bearbeta bilden för övriga former (rund, oval, rektangel, kvadrat, triangel, oktogon)
  var rotationAngle = parseInt(document.getElementById("rotate-input").value);
  var widthSliderValue = parseInt(document.getElementById("width-slider").value);
  var heightSliderValue = parseInt(document.getElementById("height-slider").value);
  var width = Math.min(widthSliderValue, 5000);
  var height = Math.min(heightSliderValue, 5000);
  var horizontalOffset = parseInt(document.getElementById("horizontal-input").value);
  var verticalOffset = parseInt(document.getElementById("vertical-input").value);
  var inputImage = document.getElementById("upload-image").files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    var image = new Image();
    image.src = event.target.result;

    image.onload = function () {
      var canvas = document.getElementById("output-image-canvas");
      var ctx = canvas.getContext("2d");

      // Rensa canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rita svart kantreferens för vald form
      document.getElementById("reference-border").className = "reference-border " + selectedShape + "-shape";

      // Bearbeta och visa bilden baserat på vald form
      ctx.save();
      ctx.translate(canvas.width / 2 + horizontalOffset, canvas.height / 2 + verticalOffset);
      ctx.rotate((rotationAngle * Math.PI) / 180);
      ctx.drawImage(image, -width / 2, -height / 2, width, height);
      ctx.restore();
    };
  };
  reader.readAsDataURL(inputImage);
}
function clipToShape(ctx, shape) {
  ctx.clearRect(0, 0, ctx.canvas.height, ctx.canvas.width);
  switch (shape) {
    case "round":
      ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width / 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      break;
    case "oval":
      ctx.ellipse(ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width * 0.3, ctx.canvas.height * 0.5, 0, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      break;
    case "rectangle":
      ctx.rect(55, 0, ctx.canvas.width * 0.78, ctx.canvas.height);
      ctx.closePath();
      ctx.clip();
      break;
    case "square":
      ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.closePath();
      ctx.clip();
      break;
    case "triangle":
      polynom(3, ctx)
      break;
    case "oktogon":
      polynom(8, ctx)
      break;
    case "hexagon":
      polynom(6, ctx)
      break;
    case "parallelogram":
      ctx.beginPath();
      ctx.moveTo(150, 0);
      ctx.lineTo(500, 0);
      ctx.lineTo(400, 500);
      ctx.lineTo(0, 500);
      ctx.closePath();
      ctx.clip();
      break;
    case "heart":
      ctx.beginPath();
      ctx.moveTo(250, 120);  // Flytta uppåt med 20 pixlar
      ctx.bezierCurveTo(250, -30, 37, -30, 37, 120);  // Flytta uppåt med 20 pixlar och bredare med 7 pixlar på vardera sida
      ctx.bezierCurveTo(37, 320, 250, 500, 250, 500);  // Öka längden med 80 pixlar (50 + 30)
      ctx.bezierCurveTo(250, 500, 463, 320, 463, 120);  // Öka både längden och bredden med 80 respektive 7 pixlar
      ctx.bezierCurveTo(463, -30, 250, -30, 250, 120);  // Flytta uppåt med 20 pixlar
      ctx.closePath();
      ctx.clip();
      break;
    case "rabbet":
      ctx.beginPath();
      ctx.moveTo(0, 80);  // Flytta uppåt med 50 pixlar
      ctx.lineTo(80, 80);  // Börja med övre vänstra hörnet
      ctx.lineTo(80, 0);   // Övre kanten
      ctx.lineTo(430, 0);  // Övre kanten
      ctx.lineTo(430, 80); // Övre högra hörnet
      ctx.lineTo(500, 80); // Flytta uppåt med 50 pixlar
      ctx.lineTo(500, 430); // Högra kanten
      ctx.lineTo(430, 430); // Nedre högra hörnet
      ctx.lineTo(430, 500); // Flytta neråt med 50 pixlar
      ctx.lineTo(80, 500); // Nedre kanten
      ctx.lineTo(80, 430); // Nedre vänstra hörnet
      ctx.lineTo(0, 430); // Flytta neråt med 50 pixlar
      ctx.closePath();
      ctx.clip();
      break;
    case "star":
      ctx.beginPath();
      ctx.moveTo(250, 0);   // Övre kanten
      ctx.lineTo(305, 175); // Övre högra hörnet
      ctx.lineTo(490, 175); // Övre högra hörnet
      ctx.lineTo(335, 290); // Högra kanten
      ctx.lineTo(400, 500); // Nedre högra hörnet
      ctx.lineTo(250, 375); // Nedre kanten
      ctx.lineTo(100, 500); // Nedre vänstra hörnet
      ctx.lineTo(165, 290); // Vänstra kanten
      ctx.lineTo(10, 175);  // Övre vänstra hörnet
      ctx.lineTo(195, 175); // Övre vänstra hörnet
      ctx.closePath();
      ctx.clip();
      break;
    case "dodicagram":
      ctx.beginPath();
      ctx.moveTo(500, 250);   // Startpunkt
      ctx.lineTo(394.9, 288.8); // Punkt 1
      ctx.lineTo(466.5, 375); // Punkt 2
      ctx.lineTo(353.6, 353.6); // Punkt 3
      ctx.lineTo(375, 466.5); // Punkt 4
      ctx.lineTo(288.8, 394.9); // Punkt 5
      ctx.lineTo(250, 500); // Punkt 6
      ctx.lineTo(211.2, 394.9); // Punkt 7
      ctx.lineTo(135, 466.5); // Punkt 8
      ctx.lineTo(156.4, 353.6); // Punkt 9
      ctx.lineTo(43.5, 375); // Punkt 10
      ctx.lineTo(115.1, 288.8); // Punkt 11
      ctx.lineTo(10, 250); // Punkt 12
      ctx.lineTo(115.1, 211.2); // Punkt 13
      ctx.lineTo(43.5, 125); // Punkt 14
      ctx.lineTo(156.4, 146.4); // Punkt 15
      ctx.lineTo(135, 33.5); // Punkt 16
      ctx.lineTo(211.2, 105.1); // Punkt 17
      ctx.lineTo(250, 0); // Punkt 18
      ctx.lineTo(288.8, 105.1); // Punkt 19
      ctx.lineTo(375, 33.5); // Punkt 20
      ctx.lineTo(353.6, 146.4); // Punkt 21
      ctx.lineTo(466.5, 125); // Punkt 22
      ctx.lineTo(394.9, 211.2); // Punkt 23
      ctx.closePath();
      ctx.clip();
      break;
    case "Rabbet":
      ctx.moveTo(250, 100);
      ctx.lineTo(400, 100);
      ctx.lineTo(450, 250);
      ctx.lineTo(400, 400);
      ctx.lineTo(250, 400);
      ctx.lineTo(100, 250);
      ctx.closePath();
      ctx.clip();
      break;
    case "star":
      ctx.moveTo(250, 50);
      ctx.lineTo(290, 150);
      ctx.lineTo(400, 150);
      ctx.lineTo(310, 220);
      ctx.lineTo(350, 330);
      ctx.lineTo(250, 260);
      ctx.lineTo(150, 330);
      ctx.lineTo(190, 220);
      ctx.lineTo(100, 150);
      ctx.lineTo(210, 150);
      ctx.closePath();
      ctx.clip();
      break;
    case "dodicagram":
      ctx.beginPath();
      ctx.moveTo(250, 50);
      ctx.lineTo(353, 146);
      ctx.lineTo(353, 354);
      ctx.lineTo(250, 450);
      ctx.lineTo(147, 354);
      ctx.lineTo(147, 146);
      ctx.lineTo(250, 50);
      ctx.lineTo(353, 146);
      ctx.lineTo(250, 250);
      ctx.lineTo(250, 50);
      ctx.lineTo(147, 146);
      ctx.lineTo(250, 250);
      ctx.lineTo(147, 354);
      ctx.lineTo(250, 250);
      ctx.lineTo(353, 354);
      ctx.lineTo(250, 250);
      ctx.lineTo(353, 146);
      ctx.closePath();
      ctx.fill();
      ctx.clip();
      break;
    // Lägg till fler former här
    default:
      break;
  }
}

function polynom(sides, ctx) {
  var canvas = document.getElementById("output-image-canvas");
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var size = 250; // Storlek på hexagon
  var sides = sides; // Antal sidor på hexagon
  ctx.beginPath();

  if (sides == 8) {
    // Rita oktogon hörn
    for (var i = 0; i < sides; i++) {
      var newangle = (-11.2 * 2 * Math.PI) / 180;
      var angle = (i * 2 * Math.PI) / sides;
      angle = angle + newangle;
      var x = centerX + size * Math.cos(angle);
      var y = centerY + size * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
        console.log(i, x, y);
      } else {
        ctx.lineTo(x, y);
        console.log(i, x, y);
      }
    }
  }
  if (sides == 6) {
    // Rita oktogon hörn
    for (var i = 0; i < sides; i++) {
      var newangle = (-45 * 2 * Math.PI) / 180;
      var angle = (i * 2 * Math.PI) / sides;
      angle = angle + newangle;
      var x = centerX + size * Math.cos(angle);
      var y = centerY + size * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
        console.log(i, x, y);
      } else {
        ctx.lineTo(x, y);
        console.log(i, x, y);
      }
    }
  }
  else if (sides == 3) {
    // Rita triangel
    for (var i = 0; i < sides; i++) {
      var newangle = (-45 * 2 * Math.PI) / 180;
      var angle = (i * 2 * Math.PI) / sides;
      angle = angle + newangle;
      var x = centerX + size * Math.cos(angle);
      var y = centerY + size * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
        console.log(i, x, y);
      } else {
        x = x * 1;
        y = y * 1.4;
        ctx.lineTo(x, y);
        console.log(i, x, y);
      }
    }

  }


  // Stäng banan
  ctx.closePath();
  ctx.clip();
}

function saveProcessedImage() {
  var selectedShape = document.getElementById("shape-select").value;
  var canvas = document.getElementById("output-image-canvas");
  var ctx = canvas.getContext("2d");

  // Skapa en kopia av canvas för att tillämpa klippning i vald form
  var shapeCanvas = document.createElement("canvas");
  shapeCanvas.width = canvas.width;
  shapeCanvas.height = canvas.height;
  var shapeCtx = shapeCanvas.getContext("2d");

  // Utför klippningsoperationen för den valda formen
  clipToShape(shapeCtx, selectedShape);
  shapeCtx.drawImage(canvas, 0, 0);

  // Konvertera den klippta canvasen till en Blob
  shapeCanvas.toBlob(function (blob) {
    var formData = new FormData();
    formData.append('image', blob); // Använd 'image' som nyckel här

    // Skicka bilden till servern
    fetch('/save', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log("Serverns svar:", data);
      })
      .catch(error => {
        console.error("Ett fel uppstod:", error);
      });
  }, "image/png"); // Specifiera MIME-typen här
}
function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}