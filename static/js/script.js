function changeLanguage(language) {
    var hemHeading = document.getElementById('hem-heading');
    var hemText = document.getElementById('hem-text');
    var produkterHeading = document.getElementById('produkter-heading');
    var omossHeading = document.getElementById('omoss-heading');
    var omossText = document.getElementById('omoss-text');
    var kontaktHeading = document.getElementById('kontakt-heading');
    var kontaktText = document.getElementById('kontakt-text');
    if (language === 'sv') {
      // Svenska
      hemHeading.textContent = 'Hem';
      hemText.textContent = 'Välkommen till Min Smyckeshemsida! Vi erbjuder ett brett utbud av vackra smycken för alla tillfällen.';
      produkterHeading.textContent = 'Produkter';
      omossHeading.textContent = 'Om oss';
      omossText.textContent = 'Vi är ett dedikerat team av smyckesdesigners med lång erfarenhet. Vårt mål är att skapa unika och tidlösa smycken som passar varje individ.';
      kontaktHeading.textContent = 'Kontakt';
      kontaktText.textContent = 'Vi skulle älska att höra från dig! Kontakta oss via följande kontaktuppgifter:';
    } else if (language === 'en') {
      // English
      hemHeading.textContent = 'Home';
      hemText.textContent = 'Welcome to My Jewelry Website! We offer a wide range of beautiful jewelry for all occasions.';
      produkterHeading.textContent = 'Products';
      omossHeading.textContent = 'About Us';
      omossText.textContent = 'We are a dedicated team of jewelry designers with extensive experience. Our goal is to create unique and timeless jewelry that suits every individual.';
      kontaktHeading.textContent = 'Contact';
      kontaktText.textContent = 'We would love to hear from you! Contact us using the following details:';
    } else if (language === 'ar') {
      // Arabic
      hemHeading.textContent = 'الصفحة الرئيسية';
      hemText.textContent = 'مرحبًا بك في موقعنا الإلكتروني للمجوهرات! نقدم مجموعة واسعة من المجوهرات الجميلة لجميع المناسبات.';
      produkterHeading.textContent = 'المنتجات';
      omossHeading.textContent = 'عنا';
      omossText.textContent = 'نحن فريق متفانٍ من مصممي المجوهرات ذوي خبرة كبيرة. هدفنا هو صنع مجوهرات فريدة وخالدة تناسب كل فرد.';
      kontaktHeading.textContent = 'اتصل بنا';
      kontaktText.textContent = 'نحن نود أن نسمع منك! اتصل بنا باستخدام التفاصيل التالية:';
    }
    }
  
  