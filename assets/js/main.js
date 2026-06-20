(() => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("#main-nav");

  if (navToggle && nav) {
    const closeNav = () => {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen && languageMenu) {
        languageMenu.classList.remove("open");
        languageMenu.querySelector(".language-pill")?.setAttribute("aria-expanded", "false");
      }
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  const languageMenu = document.querySelector("[data-language-menu]");
  const translateLink = document.querySelector("[data-translate-link]");
  if (translateLink) {
    translateLink.href = `https://translate.google.com/translate?sl=en&tl=nl&u=${encodeURIComponent(window.location.href)}`;
  }
  if (languageMenu) {
    const button = languageMenu.querySelector(".language-pill");
    const closeLanguageMenu = () => {
      languageMenu.classList.remove("open");
      button?.setAttribute("aria-expanded", "false");
    };

    button?.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = languageMenu.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        document.body.classList.remove("nav-open");
        navToggle?.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", (event) => {
      if (!languageMenu.contains(event.target)) closeLanguageMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLanguageMenu();
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const search = document.querySelector("[data-article-search]");
  const articleCards = Array.from(document.querySelectorAll("[data-search]"));
  if (search && articleCards.length) {
    const articleGrid = articleCards[0].parentElement;
    const noResults = document.createElement("p");
    noResults.className = "search-empty";
    noResults.hidden = true;
    noResults.setAttribute("aria-live", "polite");
    noResults.textContent = "No articles found.";
    articleGrid.after(noResults);

    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      articleCards.forEach((card) => {
        const haystack = card.dataset.search || "";
        card.hidden = query.length > 0 && !haystack.includes(query);
      });
      noResults.hidden = query.length === 0 || articleCards.some((card) => !card.hidden);
    });
  }

  const appointmentForm = document.querySelector("[data-appointment-form]");
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", (event) => {
      if (!appointmentForm.checkValidity()) return;
      event.preventDefault();

      const formData = new FormData(appointmentForm);
      const fields = [
        ["Name", formData.get("name")],
        ["E-mail", formData.get("email")],
        ["Phone", formData.get("phone")],
        ["Consultation type", formData.get("consultation_type")],
        ["Preferred days or times", formData.get("preferred_times")],
        ["Main reason for consultation", formData.get("message")],
      ];
      const body = fields
        .map(([label, value]) => `${label}: ${value || ""}`)
        .join("\n\n");

      window.location.href = `mailto:panini.ayurvedics@gmail.com?subject=${encodeURIComponent("Consultation request")}&body=${encodeURIComponent(body)}`;
    });
  }

  document.querySelectorAll("img").forEach((image) => {
    image.decoding = "async";
    if (!image.hasAttribute("loading") && !image.closest(".site-header") && !image.closest(".home-hero") && !image.closest(".article-hero")) {
      image.loading = "lazy";
    }
  });

  // ── Scroll reveal ───────────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
  );
  document.querySelectorAll(".scroll-reveal").forEach((el) => revealObserver.observe(el));

  // ── Gallery lightbox ─────────────────────────────────────────────────────
  const galleryItems = Array.from(document.querySelectorAll("[data-gallery-item]"));
  if (galleryItems.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Gallery image preview");
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close gallery preview">&times;</button>
      <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">&lsaquo;</button>
      <figure>
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="">
        <figcaption></figcaption>
      </figure>
      <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">&rsaquo;</button>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector("img");
    const caption = lightbox.querySelector("figcaption");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");
    let activeIndex = 0;
    let lastFocusedElement = null;

    const showImage = (index) => {
      activeIndex = (index + galleryItems.length) % galleryItems.length;
      const button = galleryItems[activeIndex];
      const image = button.querySelector("img");
      lightboxImage.src = button.dataset.full || image.src;
      lightboxImage.alt = image.alt;
      const captionText = button.dataset.caption?.trim();
      caption.hidden = !captionText;
      caption.textContent = captionText ? `${captionText} (${activeIndex + 1} / ${galleryItems.length})` : "";
    };

    const close = () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      lastFocusedElement?.focus();
    };

    galleryItems.forEach((button, index) => {
      button.addEventListener("click", () => {
        lastFocusedElement = document.activeElement;
        showImage(index);
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
        closeButton.focus();
      });
    });

    closeButton.addEventListener("click", close);
    previousButton.addEventListener("click", () => showImage(activeIndex - 1));
    nextButton.addEventListener("click", () => showImage(activeIndex + 1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) {
        close();
      }
      if (event.key === "ArrowLeft" && lightbox.classList.contains("open")) {
        showImage(activeIndex - 1);
      }
      if (event.key === "ArrowRight" && lightbox.classList.contains("open")) {
        showImage(activeIndex + 1);
      }
      if (event.key === "Tab" && lightbox.classList.contains("open")) {
        const focusable = Array.from(lightbox.querySelectorAll("button"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
})();
