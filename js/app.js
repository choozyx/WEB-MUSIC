// PROTECT PAGE (Mengecek apakah halaman yang dibuka adalah halaman yang harus login.)
// jika belum login, arahkan ke halaman login.
const currentPage = window.location.pathname;
const protectedPages = ["index.html", "/", "/index.html"];

if (protectedPages.some(p => currentPage.endsWith(p))) {
    const user = localStorage.getItem("user");
    if (!user) window.location.href = "login.html";
}

// UTIL FUNCTION
function saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
} //menyimpan data user ke localStorage.

function getUser() {
    return JSON.parse(localStorage.getItem("user"));
} //mengambil data user dari localStorage.

// REGISTER HANDLER
// menangani proses registrasi.
// untuk mencocokan password, menyimpan data user, dan mengarahkan ke halaman login.
if (document.getElementById("reg-form")) {
    document.getElementById("reg-form").addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const pass = document.getElementById("reg-pass").value.trim();
        const pass2 = document.getElementById("reg-pass2").value.trim();

        if (pass !== pass2) {
            alert("Password tidak cocok!");
            return;
        }

        saveUser({ name, email, pass });
        alert("Registrasi berhasil! Silakan login.");
        window.location.href = "login.html";
    });
}

// LOGIN HANDLER
// menangani proses login.
// membandingkan dengan data yang ada di localStorage,
// untuk memeriksa data user, dan mengarahkan ke halaman utama.
if (document.getElementById("login-form")) {
    document.getElementById("login-form").addEventListener("submit", e => {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const pass = document.getElementById("login-pass").value.trim();

        const user = getUser();

        if (user && user.email === email && user.pass === pass) {
            window.location.href = "index.html";
        } else {
            alert("Email atau password salah!");
        }
    });
}

// LOGOUT
// Menghapus data login lalu kembali ke login page.
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

if (document.getElementById("logout-btn")) {
    document.getElementById("logout-btn").addEventListener("click", logout);
}

// ambil audio
// mengambil elemen <audio>
let audio = document.getElementById("audio");
if (!audio) {
  audio = document.createElement("audio");
  audio.id = "audio";
  document.body.appendChild(audio);
}

// SHORTCUT SELECTOR
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// MINI PLAYER ELEMENT
// mengambil elemen-elemen pada mini player
// yang muncul cover album, judul lagu, artis, tombol play, prev, next, seek bar, dan volume
const miniCover = $("#mini-cover");
const miniTitle = $("#mini-title");
const miniArtist = $("#mini-artist");
const miniPlay = $("#play");
const miniPrev = $("#prev");
const miniNext = $("#next");
const miniSeek = $("#seek");
const miniVolume = $("#volume");

// FULL PLAYER ELEMENT
// mengambil elemen-elemen pada full player
// yang muncul cover album, judul lagu, artis, tombol play, prev, next, seek bar, dan waktu
const fullCover = $("#full-cover");
const fullTitle = $("#full-title");
const fullArtist = $("#full-artist");
const fullPlay = $("#full-play");
const fullPrev = $("#full-prev");
const fullNext = $("#full-next");
const fullSeek = $("#full-seek");
const timeNow = $("#time-now");
const timeTotal = $("#time-total");

// TRACK LIST
// Data awal lagu pertama yang diputar jika user belum pilih apa pun.
let tracks = [
  {
    title: "HOT SAUCE",
    artist: "BABYMONSTER",
    src: "media/sample13.mp3",
    cover: "img/hotsauce.jpeg"
  }
];

let currentIndex = 0;

// LOAD TRACK
function loadTrack(i) { //Mengubah musik, foto, cover, text yang akan dimainkan.
  const t = tracks[i];

  audio.src = t.src;

  // mini player
  if (miniCover) miniCover.src = t.cover;
  if (miniTitle) miniTitle.textContent = t.title;
  if (miniArtist) miniArtist.textContent = t.artist;

  // full player
  if (fullCover) fullCover.src = t.cover;
  if (fullTitle) fullTitle.textContent = t.title;
  if (fullArtist) fullArtist.textContent = t.artist;

  audio.load();
}

// FIRST LOAD
loadTrack(currentIndex);

// PLAY / PAUSE
function updatePlayButtons(isPlaying) {
  if (miniPlay) miniPlay.textContent = isPlaying ? "⏸" : "▶";
  if (fullPlay) fullPlay.textContent = isPlaying ? "⏸" : "▶";
}

function togglePlay() {
  audio.paused ? audio.play() : audio.pause();
}

if (miniPlay) miniPlay.onclick = togglePlay;
if (fullPlay) fullPlay.onclick = togglePlay;

audio.addEventListener("play", () => updatePlayButtons(true));
audio.addEventListener("pause", () => updatePlayButtons(false));


function nextTrack() {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
  audio.play();
}
// Memindahkan track pada list.

function prevTrack() {
  currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentIndex);
  audio.play();
}

if (miniNext) miniNext.onclick = nextTrack;
if (fullNext) fullNext.onclick = nextTrack;
if (miniPrev) miniPrev.onclick = prevTrack;
if (fullPrev) fullPrev.onclick = prevTrack;


// SEEK BAR & TIME UPDATE
// Progress bar bergerak sesuai durasi lagu.
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  let pct = (audio.currentTime / audio.duration) * 100;
  if (miniSeek) miniSeek.value = pct;
  if (fullSeek) fullSeek.value = pct;

  if (timeNow) timeNow.textContent = formatTime(audio.currentTime);
  if (timeTotal) timeTotal.textContent = formatTime(audio.duration);
});

function formatTime(s) {
  if (!s || isNaN(s)) return "0:00";
  s = Math.floor(s);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// seek drag
// Mempercepat / memundurkan lagu.
if (miniSeek) {
  miniSeek.oninput = () => {
    audio.currentTime = (miniSeek.value / 100) * audio.duration;
  };
}
if (fullSeek) {
  fullSeek.oninput = () => {
    audio.currentTime = (fullSeek.value / 100) * audio.duration;
  };
}

// VOLUME
// Mengatur volume audio.
if (miniVolume) {
  miniVolume.oninput = () => {
    audio.volume = miniVolume.value;
  };
}

// CARD CLICK → PLAY MUSIC
// Memutar lagu ketika user mengklik card lagu pada halaman.
document.addEventListener("click", e => {
  const card = e.target.closest("[data-src]");
  if (!card) return;

  const src = card.dataset.src;
  const cover = card.dataset.cover;
  const title = card.dataset.title;
  const artist = card.dataset.artist;

  tracks[0] = { src, cover, title, artist };
  currentIndex = 0;

  loadTrack(0);
  audio.play();
});
