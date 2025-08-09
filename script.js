// Initial Image Set (used before search)
let images = [
  { src: 'https://picsum.photos/id/1011/900/500', caption: 'Mountain View' },
  { src: 'https://picsum.photos/id/1015/900/500', caption: 'Lake Scene' },
  { src: 'https://picsum.photos/id/1025/900/500', caption: 'Desert View' },
  { src: 'https://picsum.photos/id/1035/900/500', caption: 'Green Forest' },
  { src: 'https://picsum.photos/id/1045/900/500', caption: 'Beach Time' },

];


let current = 0;
let autoPlayInterval;
let isShuffling = false;

const slidesContainer = document.querySelector('.slides');
const captionDiv = document.querySelector('.caption');
const counterDiv = document.querySelector('.counter');
const thumbnailsContainer = document.querySelector('.thumbnails');
const progressBar = document.querySelector('.progress');

function updateSlide(index) {
  slidesContainer.innerHTML = '';

  const item = images[index];
  const isVideo = item.src.endsWith('.mp4');

  const media = isVideo ? document.createElement('video') : document.createElement('img');
  media.src = item.src;
  media.alt = item.caption;
  media.classList.add('active');
  if (isVideo) {
    media.controls = true;
    media.autoplay = true;
    media.loop = true;
  } else {
    media.loading = 'lazy';
    media.onclick = () => media.requestFullscreen?.();
  }

  slidesContainer.appendChild(media);
  captionDiv.textContent = item.caption;
  counterDiv.textContent = `${index + 1} / ${images.length}`;
  updateThumbnails();
  updateProgress();
}

function nextSlide() {
  current = (current + 1) % images.length;
  updateSlide(current);
}
function prevSlide() {
  current = (current - 1 + images.length) % images.length;
  updateSlide(current);
}

function updateThumbnails() {
  thumbnailsContainer.innerHTML = '';
  images.forEach((img, i) => {
    const thumb = document.createElement('img');
    thumb.src = img.src;
    thumb.alt = img.caption;
    thumb.classList.toggle('active', i === current);
    thumb.onclick = () => {
      current = i;
      updateSlide(i);
      resetAutoplay();
    };
    thumbnailsContainer.appendChild(thumb);
  });
}

function startAutoplay() {
  stopAutoplay();
  autoPlayInterval = setInterval(() => {
    if (isShuffling) current = Math.floor(Math.random() * images.length);
    else current = (current + 1) % images.length;
    updateSlide(current);
  }, 4000);
}
function stopAutoplay() {
  clearInterval(autoPlayInterval);
}
function resetAutoplay() {
  const autoplayOn = document.getElementById('autoplay').checked;
  if (autoplayOn) startAutoplay();
}

function updateProgress() {
  const percent = ((current + 1) / images.length) * 100;
  progressBar.style.width = percent + '%';
}

function downloadImage() {
  const link = document.createElement('a');
  link.href = images[current].src;
  link.download = `alokstudio-image-${current + 1}`;
  link.click();
}

// Search Images from Unsplash (client-side demo with static fallback)
async function searchImages() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const url = `https://source.unsplash.com/featured/?${encodeURIComponent(query)}&sig=${Math.random()}`;
  images = Array.from({ length: 5 }, (_, i) => ({
    src: `${url}&random=${i}`,
    caption: `${query} ${i + 1}`
  }));

  current = 0;
  updateSlide(current);
}

// Voice Commands
function initVoiceControl() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("Voice API not supported in this browser.");

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (e) => {
    const cmd = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
    if (cmd.includes('next')) nextSlide();
    if (cmd.includes('previous') || cmd.includes('back')) prevSlide();
    if (cmd.includes('pause')) stopAutoplay();
    if (cmd.includes('start') || cmd.includes('play')) startAutoplay();
  };

  recognition.start();
}

// Events
document.querySelector('.next').onclick = () => { nextSlide(); resetAutoplay(); };
document.querySelector('.prev').onclick = () => { prevSlide(); resetAutoplay(); };
document.getElementById('autoplay').onchange = e => e.target.checked ? startAutoplay() : stopAutoplay();
document.getElementById('shuffleToggle').onchange = e => isShuffling = e.target.checked;
document.getElementById('downloadBtn').onclick = downloadImage;
document.getElementById('searchBtn').onclick = searchImages;
document.getElementById('voiceToggle').onchange = e => e.target.checked && initVoiceControl();
document.getElementById('themeSelector').onchange = (e) => {
  document.body.className = e.target.value;
};

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

slidesContainer.addEventListener('touchstart', e => startX = e.touches[0].clientX);
slidesContainer.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) nextSlide();
  else if (endX - startX > 50) prevSlide();
});




// Init
updateSlide(current);
startAutoplay();