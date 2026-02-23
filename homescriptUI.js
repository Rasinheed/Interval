/*=========================================================
       THEME LOAD (BEFORE CSS)
  ==========================================================*/
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

/* =========================================================
   SPLASH SCREEN (Light/Dark Mode + Sound)
========================================================= */

window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash-screen");
  const logo = document.getElementById("splash-logo");
  const homeLogo = document.getElementById("home-logo");

  // Choose correct logo based on theme
  const theme = document.documentElement.getAttribute("data-theme");
  logo.src = theme === "dark" ? "logodark.png" : "logolight.png";

  // Only autoplay if user already unlocked audio
  if (localStorage.getItem("audioUnlocked") === "true") {
    setTimeout(() => {
      const audio = new Audio("intro.wav");
      audio.volume = 0.9;
      audio.play().catch(() => {});
    }, 150);
  }

  // Animate top logo after splash fade timing
  setTimeout(() => {
      homeLogo.classList.add("show");

      // optional pulse
      homeLogo.classList.add("pulse");
      setTimeout(() => homeLogo.classList.remove("pulse"), 400);

  }, 300); // delay matches your splash fade timing
});

/* =========================================================
   UNLOCK AUDIO ON FIRST USER INTERACTION
========================================================= */
window.addEventListener("click", () => {
  const audio = new Audio("intro.wav");
  audio.volume = 0.9;
  audio.play().catch(() => {});
  localStorage.setItem("audioUnlocked", "true");
}, { once: true });

/* =========================================================
   MODE SWITCHING
========================================================= */

const modes = ["Friends", "Suggested", "Requests"];
let index = 0;

const title = document.getElementById("switchTitle");

const panels = {
    Friends: document.getElementById("friendsPanel"),
    Suggested: document.getElementById("suggestedPanel"),
    Requests: document.getElementById("requestsPanel")
};

function updateView() {
    title.textContent = modes[index];

    for (let key in panels) {
        panels[key].classList.add("hidden");
    }

    panels[modes[index]].classList.remove("hidden");
}

document.getElementById("nextBtn").onclick = () => {
    index = (index + 1) % modes.length;
    updateView();
};

document.getElementById("prevBtn").onclick = () => {
    index = (index - 1 + modes.length) % modes.length;
    updateView();
};


/* =========================================================
   THEME TOGGLE (MATCHES SIGNUP PAGE)
========================================================= */

const toggle = document.getElementById('theme-toggle');
const homeLogo = document.getElementById("home-logo");

// Set correct icon on load
const currentThemeOnLoad = document.documentElement.getAttribute('data-theme');
toggle.textContent = currentThemeOnLoad === 'dark' ? "🌙" : "☀️";

// Set correct logo on load
homeLogo.src = currentThemeOnLoad === "dark" ? "logodark.png" : "logolight.png";

// Toggle theme
toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    // Apply theme
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    // Update icon
    toggle.textContent = next === 'dark' ? "🌙" : "☀️";

    // Update logo
    homeLogo.src = next === "dark" ? "logodark.png" : "logolight.png";
});

/* ============================================================
   FALLING BACKGROUND SHAPES (MATCHES CHAT PAGE)
============================================================ */

function startShapes() {
  const container = document.querySelector(".background-shapes");
  if (!container) return;

  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();

  let colors;

  if (!localStorage.getItem("accent-color")) {
    colors = ["#5e17eb", "#5170ff"];
  } else {
    colors = [accent];
  }

  const shapes = ["circle", "square", "triangle"];

  function createShape() {
    const enabled = localStorage.getItem("shapesEnabled");
    if (enabled === "false") return;

    const shape = document.createElement("div");
    shape.classList.add("shape");

    const size = Math.random() * 16 + 6;
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = Math.random() * 100 + "vw";

    const color = colors[Math.floor(Math.random() * colors.length)];
    shape.style.background = color;

    const duration = Math.random() * 6 + 4;
    shape.style.animationDuration = duration + "s";

    const type = shapes[Math.floor(Math.random() * shapes.length)];

    if (type === "circle") {
      shape.style.borderRadius = "50%";
    }

    if (type === "triangle") {
      shape.style.width = 0;
      shape.style.height = 0;
      shape.style.borderLeft = `${size}px solid transparent`;
      shape.style.borderRight = `${size}px solid transparent`;
      shape.style.borderBottom = `${size * 1.5}px solid ${color}`;
      shape.style.background = "none";
    }

    container.appendChild(shape);
    setTimeout(() => shape.remove(), duration * 1000);
  }

  setInterval(createShape, 400);
}

if (localStorage.getItem("shapesEnabled") !== "false") {
  startShapes();
}
