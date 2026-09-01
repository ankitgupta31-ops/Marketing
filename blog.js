const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const languageToggle = document.querySelector('[data-language-toggle]');
const copy = {
  en: {
    nav: ['Our loans', 'How it works', 'Blog', 'Support'], eyebrow: 'Saarthi insights', hero: 'Small steps.', heroSecond: 'Stronger journeys.', intro: 'Practical guidance for choosing, financing, and running the vehicle that powers your everyday business.',
    categories: ['Business basics', 'Money matters', 'Owner tips'], read: ['Read the guide', 'Read the guide', 'Read the guide'], details: [{ title: 'How to choose the right vehicle for your route', paragraphs: ['Your best vehicle is the one that matches the work you do every day. Start by estimating your regular route, passenger or cargo needs, and the number of hours you expect to drive.', 'Passenger e-rickshaws are a strong fit for short city routes and predictable demand. A cargo three-wheeler may be better when your income comes from deliveries or transporting heavier goods. Compare range, service access, load capacity, and expected downtime before choosing.'] }, { title: 'EMI planning that keeps your cash flow healthy', paragraphs: ['A comfortable EMI should leave room for fuel or charging, maintenance, household expenses, and slower business days. Review your average monthly income and plan around a conservative estimate rather than your best month.', 'Keep a small buffer for repairs and seasonal changes. When comparing plans, look beyond the monthly number and check the total repayment, tenure, fees, and payment schedule so your decision stays clear from day one.'] }, { title: 'Seven habits that extend your vehicle’s working life', paragraphs: ['Daily checks protect both your earnings and your passengers. Inspect tyres, brakes, lights, mirrors, and unusual sounds before starting your route. Keep the vehicle clean and do not ignore warning signs.', 'For electric vehicles, follow the battery maker’s charging guidance, keep connectors dry, and schedule servicing on time. Record repairs and routine checks so small issues are handled before they become expensive downtime.'] }], cta: 'Ready for your next move?', ctaText: 'Check your eligibility and find a plan built around your daily income.', ctaButton: 'Check your eligibility', pay: 'Pay EMI', apply: 'Apply now', footer: "Helping India's everyday entrepreneurs move forward.", products: 'Products', care: 'Customer care', privacy: 'Privacy policy', fair: 'Fair lending. Clear communication. Human support.', grievance: 'Grievance Redressal Officer: support@saarthifinance.in'
  },
  hi: {
    nav: ['हमारे लोन', 'यह कैसे काम करता है', 'ब्लॉग', 'सहायता'], eyebrow: 'सारथी जानकारी', hero: 'छोटे कदम।', heroSecond: 'मजबूत सफर।', intro: 'अपने रोज़मर्रा के व्यवसाय को आगे बढ़ाने वाले वाहन को चुनने, फाइनेंस करने और चलाने के लिए उपयोगी जानकारी.',
    categories: ['व्यवसाय की मूल बातें', 'पैसों की समझ', 'मालिकों के सुझाव'], read: ['गाइड पढ़ें', 'गाइड पढ़ें', 'गाइड पढ़ें'], details: [{ title: 'अपने मार्ग के लिए सही वाहन कैसे चुनें', paragraphs: ['आपके लिए सबसे अच्छा वाहन वही है जो आपके रोज़ के काम से मेल खाता हो. अपने नियमित मार्ग, यात्री या माल की जरूरत और ड्राइविंग के घंटों का अनुमान लगाकर शुरुआत करें.', 'यात्री ई-रिक्शा छोटे शहरों के मार्ग और नियमित मांग के लिए अच्छा विकल्प है. डिलीवरी या भारी सामान के लिए कार्गो थ्री-व्हीलर बेहतर हो सकता है. चुनने से पहले रेंज, सर्विस की सुविधा, भार क्षमता और संभावित डाउनटाइम की तुलना करें.'] }, { title: 'ऐसी EMI योजना बनाएं जो आपके कैश फ्लो को स्वस्थ रखे', paragraphs: ['आरामदायक EMI में चार्जिंग, रखरखाव, घर के खर्च और धीमे कारोबार वाले दिनों के लिए भी जगह होनी चाहिए. अपनी औसत मासिक आय देखें और सबसे अच्छे महीने के बजाय सावधानी वाला अनुमान लेकर योजना बनाएं.', 'मरम्मत और मौसम के बदलाव के लिए थोड़ी राशि बचाकर रखें. योजनाओं की तुलना करते समय केवल मासिक राशि न देखें; कुल भुगतान, अवधि, शुल्क और भुगतान शेड्यूल भी समझें.'] }, { title: 'वाहन की काम करने की उम्र बढ़ाने वाली सात आदतें', paragraphs: ['रोज़ की जांच आपकी कमाई और यात्रियों दोनों की सुरक्षा करती है. मार्ग शुरू करने से पहले टायर, ब्रेक, लाइट, शीशे और असामान्य आवाज़ों की जांच करें. वाहन साफ रखें और चेतावनी संकेतों को नज़रअंदाज़ न करें.', 'इलेक्ट्रिक वाहन के लिए बैटरी निर्माता के चार्जिंग निर्देशों का पालन करें, कनेक्टर सूखे रखें और समय पर सर्विस कराएं. मरम्मत और नियमित जांच का रिकॉर्ड रखें ताकि छोटी समस्या महंगे डाउनटाइम में न बदले.'] }], cta: 'अपने अगले कदम के लिए तैयार?', ctaText: 'अपनी पात्रता जांचें और अपनी दैनिक आय के अनुसार योजना पाएं.', ctaButton: 'अपनी पात्रता जांचें', pay: 'EMI जमा करें', apply: 'अभी आवेदन करें', footer: 'भारत के रोज़मर्रा के उद्यमियों को आगे बढ़ने में मदद.', products: 'उत्पाद', care: 'ग्राहक सहायता', privacy: 'प्राइवेसी पॉलिसी', fair: 'निष्पक्ष लोन. स्पष्ट संवाद. मानवीय सहायता.', grievance: 'शिकायत निवारण अधिकारी: support@saarthifinance.in'
  }
};
let currentLanguage = 'en';

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function translateBlog() {
  const language = copy[currentLanguage];
  const isHindi = currentLanguage === 'hi';
  document.documentElement.lang = currentLanguage;
  document.title = isHindi ? 'ई-रिक्शा और थ्री-व्हीलर गाइड | सारथी फाइनेंस' : 'E-rickshaw & Three-wheeler Guides | Saarthi Finance';
  document.querySelector('meta[name="description"]')?.setAttribute('content', language.intro);
  document.querySelectorAll('.main-nav a').forEach((link, index) => { link.textContent = language.nav[index]; });
  setText('.blog-hero .eyebrow', language.eyebrow);
  setText('.blog-hero h1', '');
  document.querySelector('.blog-hero h1')?.insertAdjacentHTML('afterbegin', `${language.hero}<br><em>${language.heroSecond}</em>`);
  setText('.blog-hero-copy p', language.intro);
  document.querySelectorAll('.article-meta span:first-child').forEach((element, index) => { element.textContent = language.categories[index]; });
  const articleTitles = isHindi ? ['अपने मार्ग के लिए सही वाहन कैसे चुनें', 'ऐसी EMI योजना बनाएं जो आपके कैश फ्लो को स्वस्थ रखे', 'वाहन की काम करने की उम्र बढ़ाने वाली सात आदतें'] : ['How to choose the right vehicle for your route', 'EMI planning that keeps your cash flow healthy', 'Seven habits that extend your vehicle’s working life'];
  const articleSummaries = isHindi ? ['यात्री, कार्गो और इलेक्ट्रिक विकल्पों की तुलना दैनिक दूरी, कमाई की क्षमता और रखरखाव की जरूरत के आधार पर करें.', 'नया वाहन लेने से पहले आरामदायक मासिक भुगतान का आसान अनुमान लगाएं.', 'टायर की जांच से लेकर बैटरी की देखभाल तक, छोटी आदतें वाहन का कामकाजी समय बढ़ा सकती हैं और अनावश्यक मरम्मत खर्च घटा सकती हैं.'] : ['Compare passenger, cargo, and electric options by daily distance, earning potential, and maintenance needs.', 'A simple way to estimate a comfortable monthly payment before you commit to a new vehicle.', 'From tyre checks to battery care, small routines can protect uptime and reduce avoidable repair costs.'];
  document.querySelectorAll('.article-card h2').forEach((element, index) => { element.textContent = articleTitles[index]; });
  document.querySelectorAll('.article-card-body > p').forEach((element, index) => { element.textContent = articleSummaries[index]; });
  document.querySelectorAll('.article-link').forEach((element, index) => { element.firstChild.textContent = `${language.read[index]} `; });
  document.querySelectorAll('.article-detail').forEach((article, index) => { setText(`#${article.id} h2`, language.details[index].title); article.querySelectorAll('p').forEach((paragraph, paragraphIndex) => { paragraph.textContent = language.details[index].paragraphs[paragraphIndex]; }); });
  setText('.blog-cta h2', language.cta); setText('.blog-cta p', language.ctaText); setText('.blog-cta .button', language.ctaButton);
  setText('.text-link', language.pay); const applyButton = document.querySelector('.button-small'); if (applyButton) applyButton.firstChild.textContent = `${language.apply} `;
  setText('.footer-top > p', language.footer); setText('.footer-links a:nth-child(1)', language.products); setText('.footer-links a:nth-child(2)', language.care); setText('.footer-links a:nth-child(3)', language.privacy); setText('.footer-bottom span:nth-child(2)', language.fair); setText('.footer-bottom span:nth-child(3)', language.grievance);
  if (languageToggle) { languageToggle.textContent = isHindi ? 'English' : 'हिंदी'; languageToggle.setAttribute('aria-label', isHindi ? 'Switch to English' : 'Switch to Hindi'); }
}

languageToggle?.addEventListener('click', () => { currentLanguage = currentLanguage === 'en' ? 'hi' : 'en'; translateBlog(); });
menuToggle?.addEventListener('click', () => { const isOpen = menuToggle.getAttribute('aria-expanded') === 'true'; menuToggle.setAttribute('aria-expanded', String(!isOpen)); nav?.classList.toggle('nav-open', !isOpen); });
document.querySelectorAll('.main-nav a').forEach((link) => { link.addEventListener('click', () => { menuToggle?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('nav-open'); }); });
translateBlog();
