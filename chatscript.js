console.log("JS LOADED");

/* ============================================================
   SAVE & RESTORE CUSTOM SETTINGS
============================================================ */

function loadSettings() {
  const savedAccent = localStorage.getItem("accent-color");
  const savedFont = localStorage.getItem("chat-font");
  const savedFontSize = localStorage.getItem("chat-font-size");
  const savedTheme = localStorage.getItem("chat-theme");
  const eyedropperBtn = document.getElementById("eyedropperButton");

  if (savedAccent) {
    document.documentElement.style.setProperty("--accent", savedAccent);
    document.documentElement.style.setProperty("--bubble-me", savedAccent);

    const cp = document.getElementById("colorPreview");
    if (cp) cp.style.background = savedAccent;
    if (eyedropperBtn) eyedropperBtn.style.background = savedAccent;
  }

  if (savedFont) {
    document.documentElement.style.setProperty("--chat-font", savedFont);
    const ff = document.getElementById("fontFamily");
    if (ff) ff.value = savedFont;
  }

  if (savedFontSize) {
    document.documentElement.style.setProperty("--chat-font-size", savedFontSize + "px");
    const fs = document.getElementById("fontSize");
    if (fs) fs.value = savedFontSize;
  }

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    const ts = document.getElementById("themeSelect");
    if (ts) ts.value = savedTheme;
  }
}

function saveSetting(key, value) {
  localStorage.setItem(key, value);
}

/* ============================================================
   RESET BUTTON
============================================================ */

const resetBtn = document.getElementById("resetDefaults");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    localStorage.removeItem("accent-color");
    localStorage.removeItem("chat-font");
    localStorage.removeItem("chat-font-size");
    localStorage.removeItem("chat-theme");
    localStorage.removeItem("chat-wallpaper");
    localStorage.removeItem("chatWallpaper");
    localStorage.removeItem("shapesEnabled");

    const chatArea = document.querySelector(".chat-area");
    if (chatArea) chatArea.style = "";
    document.body.style.backgroundImage = "";
    document.body.style.background = "";

    location.reload();
  });
}

loadSettings();

/* ============================================================
   ELEMENT REFERENCES
============================================================ */

const customizePanel = document.querySelector(".customize-panel");
const toggleBtn = document.querySelector(".customize-toggle");

const friendsSidebar = document.querySelector(".sidebar");
const friendsToggle = document.querySelector(".friends-toggle");

const themeSelect = document.getElementById("themeSelect");

/* ============================================================
   THEME SWITCH
============================================================ */

if (themeSelect) {
  themeSelect.addEventListener("change", () => {
    document.documentElement.setAttribute("data-theme", themeSelect.value);
    saveSetting("chat-theme", themeSelect.value);
  });
}

/* ============================================================
   CUSTOM COLOR PICKER
============================================================ */

const colorPreview = document.getElementById("colorPreview");
const colorPanel = document.getElementById("colorPanel");
const hueSlider = document.getElementById("hueSlider");
const satBright = document.getElementById("satBright");

let hue = 260;
let saturation = 100;
let brightness = 50;

if (colorPreview && colorPanel) {
  colorPreview.addEventListener("click", () => {
    colorPanel.classList.toggle("active");
  });

  colorPanel.addEventListener("mouseleave", () => {
    colorPanel.classList.remove("active");
  });
}

if (hueSlider) {
  hueSlider.addEventListener("input", () => {
    hue = hueSlider.value;
    updateAccent();
  });
}

if (satBright) {
  satBright.addEventListener("mousemove", (e) => {
    if (e.buttons !== 1) return;

    const rect = satBright.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);

    saturation = Math.round((x / rect.width) * 100);
    brightness = 100 - Math.round((y / rect.height) * 100);

    updateAccent();
  });
}

function hsbToHex(h, s, b) {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b - b * s * Math.max(Math.min(k(n), 4 - k(n), 1), 0);
  const r = Math.round(f(5) * 255);
  const g = Math.round(f(3) * 255);
  const b2 = Math.round(f(1) * 255);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b2).toString(16).slice(1);
}

function updateAccent() {
  const hex = hsbToHex(hue, saturation, brightness);

  document.documentElement.style.setProperty("--accent", hex);
  document.documentElement.style.setProperty("--bubble-me", hex);
  saveSetting("accent-color", hex);

  if (colorPreview) colorPreview.style.background = hex;
  if (toggleBtn) toggleBtn.style.background = hex;
  if (friendsToggle) friendsToggle.style.background = hex;

  const eyedropperBtn = document.getElementById("eyedropperButton");
  if (eyedropperBtn) eyedropperBtn.style.background = hex;
}

/* ============================================================
   FONT SIZE
============================================================ */

const fontSizeInput = document.getElementById("fontSize");
if (fontSizeInput) {
  fontSizeInput.addEventListener("input", (e) => {
    const size = e.target.value;
    document.documentElement.style.setProperty("--chat-font-size", size + "px");
    saveSetting("chat-font-size", size);
  });
}

/* ============================================================
   FONT FAMILY
============================================================ */

const fontFamilySelect = document.getElementById("fontFamily");
if (fontFamilySelect) {
  fontFamilySelect.addEventListener("change", (e) => {
    const font = e.target.value;
    document.documentElement.style.setProperty("--chat-font", font);
    saveSetting("chat-font", font);
  });
}

/* ============================================================
   CUSTOMIZE PANEL TOGGLE
============================================================ */

if (toggleBtn && customizePanel) {
  toggleBtn.addEventListener("click", () => {
    const isOpen = customizePanel.classList.toggle("active");
    if (isOpen) toggleBtn.classList.add("hidden");
    else toggleBtn.classList.remove("hidden");
  });

  let customizeCloseTimeout;

  customizePanel.addEventListener("mouseenter", () => {
    clearTimeout(customizeCloseTimeout);
  });

  customizePanel.addEventListener("mouseleave", () => {
    customizeCloseTimeout = setTimeout(() => {
      customizePanel.classList.remove("active");
      toggleBtn.classList.remove("hidden");
    }, 400);
  });
}

/* ============================================================
   FRIENDS SIDEBAR
============================================================ */

if (friendsSidebar && friendsToggle) {
  let friendsCloseTimeout;

  function openFriendsSidebar() {
    friendsSidebar.classList.add("active");
    friendsToggle.classList.add("hidden");
  }

  function closeFriendsSidebar() {
    friendsSidebar.classList.remove("active");
    friendsToggle.classList.remove("hidden");
  }

  friendsSidebar.addEventListener("mouseenter", () => {
    clearTimeout(friendsCloseTimeout);
    openFriendsSidebar();
  });

  friendsSidebar.addEventListener("mouseleave", () => {
    friendsCloseTimeout = setTimeout(closeFriendsSidebar, 400);
  });

  friendsToggle.addEventListener("click", () => {
    const isOpen = friendsSidebar.classList.toggle("active");
    if (isOpen) friendsToggle.classList.add("hidden");
    else friendsToggle.classList.remove("hidden");
  });
}

/* ============================================================
   MESSAGE WRAPPING
============================================================ */

function wrapMessage(msg) {
  // Prevent double wrapping
  if (msg.querySelector(".bubble-inner")) return;

  const text = msg.innerHTML;
  msg.innerHTML = "";

  const bg = document.createElement("div");
  bg.className = "bubble-bg";

  const inner = document.createElement("span");
  inner.className = "bubble-inner";
  inner.innerHTML = text;

  msg.appendChild(bg);
  msg.appendChild(inner);
}

/* ============================================================
   STRETCH EFFECT
============================================================ */

function applyStretchEffect(msg) {
  const bg = msg.querySelector(".bubble-bg");
  if (!bg) return;

  let startY = 0;
  let dragging = false;

  msg.addEventListener("mousedown", (e) => {
    dragging = true;
    startY = e.clientY;
    msg.classList.add("stretching");
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const diff = e.clientY - startY;
    if (diff > 0) {
      const stretch = 1 + diff / 300;
      bg.style.transform = `scaleY(${stretch})`;
    }
  });

  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;

    msg.classList.remove("stretching");
    msg.classList.add("bounce");

    bg.style.transform = "scaleY(1)";

    setTimeout(() => msg.classList.remove("bounce"), 350);
  });
}

/* Apply stretch effect to existing messages */
document.querySelectorAll(".message").forEach(applyStretchEffect);

/* ============================================================
   SEND MESSAGE (TYPEWRITER + WRAP FIX)
============================================================ */

const input = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

function sendMessage() {
  const text = input ? input.value.trim() : "";
  if (!text) return;

  const msg = document.createElement("div");
  msg.className = "message me";

  // Insert raw text — wrapMessage() will wrap it
  msg.innerHTML = text;

  wrapMessage(msg);
  applyStretchEffect(msg);

  const inner = msg.querySelector(".bubble-inner");

  /* ⭐ Apply typewriter animation */
  inner.classList.add("typing-animate");

  /* ⭐ Restart animation so it plays every time */
  inner.style.animation = "none";
  inner.offsetHeight;
  inner.style.animation = null;

  /* ⭐ Allow wrapping AFTER animation finishes */
  inner.addEventListener("animationend", () => {
    inner.classList.add("done");
  });

  /* Add message to chat */
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;

  /* Clear input */
  input.value = "";
}

/* Send on click or Enter */
if (sendBtn && input) {
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}

/* ============================================================
   WALLPAPER SYSTEM
============================================================ */

const wallpaperGrid = document.getElementById("wallpaperGrid");

const wallpaperMap = {
  "solid-purple": "background:#5e17eb;",
  "solid-blue": "background:#5170ff;",
  "solid-black": "background:#000;",
  "solid-white": "background:#fff;",
  "solid-grey": "background:#888;",
  "solid-red": "background:#d8183c;",
  "solid-orange": "background:#ff7a00;",
  "solid-cyan": "background:#00eaff;",
  "solid-green": "background:#00c853;",
  "solid-pink": "background:#ff7eb3;",
  "solid-gold": "background:#ffcc00;",

  "grad-purple-blue": "background:linear-gradient(135deg,#5e17eb,#5170ff);",
  "grad-blue-cyan": "background:linear-gradient(135deg,#5170ff,#00eaff);",
  "grad-pink-purple": "background:linear-gradient(135deg,#ff7eb3,#5e17eb);",
  "grad-sunset": "background:linear-gradient(135deg,#ff9a3c,#ff5470,#d100d1);",

  "grad-ocean": "background:linear-gradient(135deg,#0061ff,#60efff);",
  "grad-forest": "background:linear-gradient(135deg,#0f9b0f,#000000);",
  "grad-candy": "background:linear-gradient(135deg,#ff9a9e,#fad0c4);",
  "grad-fire": "background:linear-gradient(135deg,#ff4e00,#ec9f05);",
  "grad-midnight": "background:linear-gradient(135deg,#232526,#414345);",
  "grad-neon": "background:linear-gradient(135deg,#00f5ff,#5e17eb);",
};

function applyWallpaper(id) {
  const style = wallpaperMap[id];
  if (!style) return;

  document.body.style.background = "";
  document.body.style.backgroundImage = "";
  document.body.style.cssText += style;

  localStorage.setItem("chat-wallpaper", id);

  document.querySelectorAll(".wallpaper-option").forEach((el) => {
    el.classList.remove("selected");
  });

  const selected = document.querySelector(`[data-wall="${id}"]`);
  if (selected) selected.classList.add("selected");
}

if (wallpaperGrid) {
  wallpaperGrid.addEventListener("click", (e) => {
    const option = e.target.closest(".wallpaper-option");
    if (!option) return;

    const id = option.dataset.wall;
    applyWallpaper(id);
  });

  const savedWall = localStorage.getItem("chat-wallpaper");
  if (savedWall) applyWallpaper(savedWall);
}

/* ============================================================
   CUSTOM WALLPAPER UPLOAD
============================================================ */

const wallpaperUpload = document.getElementById("wallpaperUpload");
if (wallpaperUpload) {
  wallpaperUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;

      localStorage.setItem("chatWallpaper", imageData);

      document.body.style.backgroundImage = `url(${imageData})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    };

    reader.readAsDataURL(file);
  });
}

const savedWallpaper = localStorage.getItem("chatWallpaper");
if (savedWallpaper) {
  document.body.style.backgroundImage = `url(${savedWallpaper})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}

/* ============================================================
   SHAPES TOGGLE
============================================================ */

const shapesToggle = document.getElementById("toggleShapes");

if (localStorage.getItem("shapesEnabled") === null) {
  localStorage.setItem("shapesEnabled", "true");
}

const savedShapes = localStorage.getItem("shapesEnabled");

if (shapesToggle) {
  if (savedShapes !== null) {
    shapesToggle.value = savedShapes;
  }

  shapesToggle.addEventListener("change", () => {
    const enabled = shapesToggle.value === "true";
    localStorage.setItem("shapesEnabled", enabled ? "true" : "false");

    const container = document.querySelector(".background-shapes");
    if (!container) return;

    if (!enabled) {
      container.innerHTML = "";
    } else {
      container.innerHTML = "";
      startShapes();
    }
  });
}

/* ============================================================
   FALLING BACKGROUND SHAPES
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

/* ============================================================
   CUSTOM EYEDROPPER (wallpaper-based)
============================================================ */

const eyedropperBtn = document.getElementById("eyedropperButton");

if (eyedropperBtn) {
  eyedropperBtn.addEventListener("click", openWallpaperEyedropper);
}

function openWallpaperEyedropper() {
  let imgSrc = localStorage.getItem("chatWallpaper");

  if (!imgSrc) {
    const bgImage = getComputedStyle(document.body).backgroundImage;
    if (bgImage && bgImage !== "none") {
      const match = bgImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        imgSrc = match[1];
      }
    }
  }

  if (!imgSrc) {
    console.warn("No wallpaper image available for eyedropper.");
    return;
  }

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "999999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.cursor = "crosshair";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.style.boxShadow = "0 0 20px rgba(0,0,0,0.35)";
  canvas.style.borderRadius = "12px";
  overlay.appendChild(canvas);

  document.body.appendChild(overlay);

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgSrc;

  img.onload = () => {
    const viewportW = window.innerWidth * 0.9;
    const viewportH = window.innerHeight * 0.9;
    const scale = Math.min(viewportW / img.width, viewportH / img.height, 1);

    const drawW = img.width * scale;
    const drawH = img.height * scale;

    canvas.width = drawW;
    canvas.height = drawH;

    ctx.drawImage(img, 0, 0, drawW, drawH);

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);

      document.documentElement.style.setProperty("--accent", hex);
      document.documentElement.style.setProperty("--bubble-me", hex);
      saveSetting("accent-color", hex);

      if (colorPreview) colorPreview.style.background = hex;
      if (toggleBtn) toggleBtn.style.background = hex;
      if (friendsToggle) friendsToggle.style.background = hex;

      document.body.removeChild(overlay);
    });
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/* ============================================================
   PRIVACY BLUR
============================================================ */

const privacyOverlay = document.getElementById("privacyOverlay");
const privacyToggle = document.getElementById("privacyToggle");

if (privacyOverlay && privacyToggle) {
  privacyToggle.addEventListener("click", () => {
    privacyOverlay.classList.toggle("active");
  });
}

/* ============================================================
   TOOL BAR / WORD BANK SYSTEM
============================================================ */

const chatTools = document.querySelector(".chat-tools");
const msgInput = document.getElementById("msgInput");
const wordbankMenu = document.getElementById("wordbankMenu");
const wordbankToggle = document.getElementById("wordbankToggle");

if (chatTools && msgInput && wordbankMenu && wordbankToggle) {
  // Always show the chevron
  wordbankToggle.style.opacity = "1";
  wordbankToggle.style.pointerEvents = "auto";

  // Show tools when focusing or typing
  msgInput.addEventListener("focus", () => {
    chatTools.classList.add("active");
  });

  msgInput.addEventListener("input", () => {
    chatTools.classList.add("active");
  });

  // Hide tools when input loses focus, unless menu is open
  msgInput.addEventListener("blur", () => {
    if (!wordbankMenu.classList.contains("open")) {
      chatTools.classList.remove("active");
    }
  });

  // Toggle menu open/close
  wordbankToggle.addEventListener("click", () => {
    const isOpen = wordbankMenu.classList.toggle("open");

    if (isOpen) {
      chatTools.classList.add("active");
    } else {
      if (document.activeElement !== msgInput) {
        chatTools.classList.remove("active");
      }
    }
  });

  // Close when mouse leaves the menu
  wordbankMenu.addEventListener("mouseleave", () => {
    wordbankMenu.classList.remove("open");

    if (document.activeElement !== msgInput) {
      chatTools.classList.remove("active");
    }
  });
}
