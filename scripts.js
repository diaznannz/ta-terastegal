const deskripsiText = document.getElementById('deskripsiText');
const deskripsiBtn = document.getElementById('deskripsiBtn');

const deskripsiMap = {
  'ent-adep': 'Perpaduan lengkap dalam satu bungkus! Nasi adep-adep terdiri dari tempe, tahu, urap sayur, mie goreng, ikan gesek, dan mentimun segar. Disajikan seperti nasi bungkus, hidangan ini juga dikenal sebagai nasi ponggol, favorit khas Tegal yang kaya rasa.',
  'ent-alu': 'Alu-alu adalah jajanan tradisional khas Tegal yang terbuat dari ketan yang dibungkus daun pisang seperti lontong, kemudian disajikan dengan parutan kelapa dan sedikit garam',
  'ent-bongkok': 'Racikan unik khas Tegal! Kupat bongkok terdiri dari ketupat, mie kenyol (kenyal), dan tauge pendek yang disiram dengan kuah kare tempe yang gurih dan kaya rempah. Hangat dan cocok dinikmati kapan saja!',
  'ent-glabed': 'Kupat glabed adalah sajian yang terdiri dari ketupat dan kuah kuning glabed(lengket) Kupat glabed terlihat seperti opor namun bedanya dari kuah yang kental dan diatasnya terdapat taburan remahan kerupuk',
  'ent-glotak': 'Glotak khas Tegal merupakan makanan yang dibuat menggunakan bahan gembus atau ampas kedelai, kemudian dimasak dengan berbagai bumbu pedas serta kaldu yang berasal dari tulang ayam atau tulang sapi. Tekstur yang dihasilkan seperti bubur sehingga glotak ini tampak halus jika dilihat oleh mata.',
  'ent-ketan': 'Jajanan manis berbahan singkong yang dihancurkan, dibentuk, lalu diberi taburan kelapa parut dan siraman gula merah cair. Namanya unik, rasanya klasik, cocok jadi camilan favorit sore hari!',
  'ent-lengko': 'Nasi lengko yang terdiri dari nasi putih, tahu-tempe goreng, taoge, mentimun, dan disiram saus kacang serta kecap manis. Hidangan ini disajikan dengan bawang goreng, daun kucai, dan biasanya disantap bersama kerupuk.',
  'ent-olos': 'Olos adalah nama jajanan khas dari Tegal yang berupa gorengan bulat, olos ini mirip seperti cimol/cilok namun olos ini terbuat dari campuran tepung kanji dan tepung terigu, lalu diisi dengan irisan kol dan cabai rawit',
  'ent-sauto': 'Tauco berasal dari hasil pengolahan kedelai yang kemudian di fermentasi. Bahan isian soto tauco tidak jauh berbeda dengan soto kuah di Indonesia pada umumnya. Terdiri dari tauge, suwiran ayam/babat, bawang goreng, daun bawang dan ditambah dengan bumbu tauco',
  'ent-tahuaci': 'Tahu Aci menggunakan tahu kuning yang berbentuk persegi empat yang dipotong menjadi dua secara melintang. Hasil potongan tersebut diberi adonan yang terbuat dari aci atau tepung kanji, potongan daun kucai'
};

let activeModelId = null;

// Track marker found / lost
document.querySelectorAll('a-entity[mindar-image-target]').forEach((entity) => {
  entity.addEventListener('targetFound', () => {
    activeModelId = entity.id;
    deskripsiText.style.display = 'none'; // reset deskripsi saat marker muncul
  });

  entity.addEventListener('targetLost', () => {
    if (activeModelId === entity.id) {
      activeModelId = null;
      deskripsiText.style.display = 'none'; // sembunyikan deskripsi saat marker hilang
    }
  });
});

// Tombol Deskripsi
deskripsiBtn.addEventListener('click', () => {
  if (activeModelId) {
    deskripsiText.textContent = deskripsiMap[activeModelId] || 'Deskripsi belum tersedia.';
    deskripsiText.style.display = deskripsiText.style.display === 'none' ? 'block' : 'none';
  } else {
    alert('Arahkan kamera ke marker terlebih dahulu.');
  }
});

// Zoom function
window.zoomModel = function (amount) {
  if (!activeModelId) {
    alert('Arahkan kamera ke marker terlebih dahulu.');
    return;
  }

  const model = document.querySelector(`#${activeModelId} a-gltf-model`);
  if (!model) return;

  const scale = model.getAttribute('scale');
  const minScale = 0.5;
  const maxScale = 2;

  const newScale = {
    x: Math.min(maxScale, Math.max(minScale, scale.x + amount)),
    y: Math.min(maxScale, Math.max(minScale, scale.y + amount)),
    z: Math.min(maxScale, Math.max(minScale, scale.z + amount)),
  };

  model.setAttribute('scale', `${newScale.x} ${newScale.y} ${newScale.z}`);
};

// ====== Fitur Rotasi Drag (Mouse & Touch) ======

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', function (e) {
  if (!activeModelId) return;
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mouseup', function () {
  isDragging = false;
});

document.addEventListener('mousemove', function (e) {
  if (isDragging && activeModelId) {
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    previousMousePosition = { x: e.clientX, y: e.clientY };

    const model = document.querySelector(`#${activeModelId} a-gltf-model`);
    if (!model) return;

    const rotation = model.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
    rotation.y += deltaX * 0.5;
    rotation.x += deltaY * 0.5;

    model.setAttribute('rotation', rotation);
  }
});

// Touch events for rotation on mobile
document.addEventListener('touchstart', function (e) {
  if (!activeModelId) return;
  isDragging = true;
  previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

document.addEventListener('touchend', function () {
  isDragging = false;
});

document.addEventListener('touchmove', function (e) {
  if (isDragging && activeModelId) {
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    const model = document.querySelector(`#${activeModelId} a-gltf-model`);
    if (!model) return;

    const rotation = model.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
    rotation.y += deltaX * 0.5;
    rotation.x += deltaY * 0.5;

    model.setAttribute('rotation', rotation);
  }
});
