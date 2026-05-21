(() => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("#main-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
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

  document.querySelectorAll("img").forEach((image) => {
    image.decoding = "async";
    if (!image.hasAttribute("loading") && !image.closest(".site-header") && !image.classList.contains("home-hero-image")) {
      image.loading = "lazy";
    }
  });

  const galleryItems = Array.from(document.querySelectorAll("[data-gallery-item]"));
  if (galleryItems.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Gallery image preview");
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close gallery preview">&times;</button>
      <figure>
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="">
        <figcaption></figcaption>
      </figure>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector("img");
    const caption = lightbox.querySelector("figcaption");
    const closeButton = lightbox.querySelector(".lightbox-close");

    const close = () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    };

    galleryItems.forEach((button) => {
      button.addEventListener("click", () => {
        const image = button.querySelector("img");
        lightboxImage.src = button.dataset.full || image.src;
        lightboxImage.alt = image.alt;
        caption.textContent = button.dataset.caption || image.alt;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
        closeButton.focus();
      });
    });

    closeButton.addEventListener("click", close);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) {
        close();
      }
    });
  }
})();
