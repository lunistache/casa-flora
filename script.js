(() => {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  const waFloat = document.querySelector(".wa-float");

  // Mobile menu
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    links.classList.toggle("open", !open);
  });
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      links.classList.remove("open");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("open")) {
      toggle.setAttribute("aria-expanded", "false");
      links.classList.remove("open");
      toggle.focus();
    }
  });

  // Nav background + floating WhatsApp button after the hero
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 8);
    waFloat.classList.toggle("show", y > window.innerHeight * 0.75);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu tabs
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const selectTab = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      const next = tabs[(i + step + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  // ES / EN toggle. Spanish lives in the markup; English in data-en attributes.
  const langBtn = document.getElementById("lang");
  const textNodes = document.querySelectorAll("[data-en]");
  const ariaNodes = document.querySelectorAll("[data-en-aria]");
  const altNodes = document.querySelectorAll("[data-en-alt]");
  const hrefNodes = document.querySelectorAll("[data-en-href]");

  textNodes.forEach((el) => { el.dataset.es = el.innerHTML.trim(); });
  ariaNodes.forEach((el) => { el.dataset.esAria = el.getAttribute("aria-label"); });
  altNodes.forEach((el) => { el.dataset.esAlt = el.getAttribute("alt"); });
  hrefNodes.forEach((el) => { el.dataset.esHref = el.getAttribute("href"); });

  const setLang = (lang) => {
    const en = lang === "en";
    document.documentElement.lang = en ? "en" : "es-MX";
    document.body.classList.toggle("en", en);
    textNodes.forEach((el) => { el.innerHTML = en ? el.dataset.en : el.dataset.es; });
    ariaNodes.forEach((el) => {
      el.setAttribute("aria-label", en ? el.dataset.enAria : el.dataset.esAria);
    });
    altNodes.forEach((el) => {
      el.setAttribute("alt", en ? el.dataset.enAlt : el.dataset.esAlt);
    });
    // Swaps the pre-filled WhatsApp message to match the visitor's language.
    hrefNodes.forEach((el) => {
      el.setAttribute("href", en ? el.dataset.enHref : el.dataset.esHref);
    });
    try { localStorage.setItem("cf-lang", lang); } catch (_) {}
  };

  langBtn.addEventListener("click", () => {
    setLang(document.body.classList.contains("en") ? "es" : "en");
  });

  let saved = null;
  try { saved = localStorage.getItem("cf-lang"); } catch (_) {}
  if (saved === "en" || (!saved && !navigator.language.toLowerCase().startsWith("es"))) {
    setLang("en");
  }

  // Gallery: mark tiles whose image is missing, so the page still reads well
  // while the photos are being collected.
  const shots = Array.from(document.querySelectorAll(".shot"));
  const markMissing = (fig) => {
    if (fig.classList.contains("missing")) return;
    fig.classList.add("missing");
    const file = fig.querySelector("img").getAttribute("src").split("/").pop();
    const want = document.createElement("span");
    want.className = "want";
    want.textContent = file;
    fig.appendChild(want);
  };
  shots.forEach((fig) => {
    const img = fig.querySelector("img");
    img.addEventListener("error", () => markMissing(fig));
    if (img.complete && img.naturalWidth === 0) markMissing(fig);
  });

  // Lightbox
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  const closeBtn = lb.querySelector(".lb-close");
  let index = 0;
  let lastFocus = null;

  const shown = () => shots.filter((f) => !f.classList.contains("missing"));

  const render = () => {
    const list = shown();
    if (!list.length) return;
    index = (index + list.length) % list.length;
    const fig = list[index];
    const img = fig.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = fig.querySelector("figcaption").textContent;
  };

  const openLb = (fig) => {
    const list = shown();
    index = list.indexOf(fig);
    if (index < 0) return;
    lastFocus = document.activeElement;
    render();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const closeLb = () => {
    lb.hidden = true;
    lbImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  shots.forEach((fig) => {
    fig.addEventListener("click", () => {
      if (!fig.classList.contains("missing")) openLb(fig);
    });
  });

  lb.querySelector(".lb-prev").addEventListener("click", () => { index--; render(); });
  lb.querySelector(".lb-next").addEventListener("click", () => { index++; render(); });
  closeBtn.addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") { index--; render(); }
    if (e.key === "ArrowRight") { index++; render(); }
  });

  // Reveal on scroll
  const targets = document.querySelectorAll(
    ".section-head, .casa-text, .casa-art, .award-inner, .tabs, .gallery, .visit-grid"
  );
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    targets.forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
