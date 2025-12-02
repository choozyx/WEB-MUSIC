(() => {
  const navbar = document.getElementById('navbar');
  const sidebar = document.getElementById('sidebar');

  if (navbar) { // navbar muncul di semua halaman, seperti home, explore, artist, playlist, player
    navbar.innerHTML = `
      <div class="logo">STAR MUSIC</div>
      <div class="nav-right">
        <input id="global-search" class="search" placeholder="Search tracks, artists..." />
        <nav><a href="login.html" style="color:var(--accent); text-decoration:none; padding-left:10px;">Log Out</a></nav>
      </div>
    `;
  }

  if (sidebar) { // sidebar muncul di halaman utama setelah login
    sidebar.innerHTML = `
      <div class="brand"><img src="img/star.jpeg" alt="logo"><strong>STAR MUSIC</strong></div>
      <a href="index.html">Home</a>
      <a href="explore.html">Explore</a>
      <a href="playlist.html">Playlists</a>
      <a href="artist.html">Artists</a>
      <a href="player.html">Player</a>
    `;
  }

  // UNIVERSAL SEARCH — WORKS FOR explore, artist, playlist
  // Pencarian global untuk beberapa halaman sekaligus
  // jika item tidak ada yang cocok, maka disembunyikan (display: none)
  const g = document.getElementById('global-search');
  if (g) {
    g.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();

      // Semua elemen lagu dari semua halaman
      const nodes = document.querySelectorAll(
        '.album-card, .track-list li, .playlist-tracks li'
      );

      nodes.forEach(node => {
        const title =
          (node.dataset.title ||
           node.querySelector('h4')?.textContent ||
           node.textContent ||
           '').toLowerCase();

        const artist = (node.dataset.artist || "").toLowerCase();

        const match =
          (!q || title.includes(q) || artist.includes(q));

        node.style.display = match ? "" : "none";
      });
    });
  }
})();
