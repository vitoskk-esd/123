/* =========================================================================
   Autonoma AI — shared site behaviour (mobile menu, scroll reveal, FAQ,
   contact form). No external dependencies, no network calls.
   ========================================================================= */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------- */
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close the mobile menu when a link inside it is activated.
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Active nav link (highlights the current page in the header)
     ------------------------------------------------------------------- */
  var currentPage = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll("[data-nav-link]").forEach(function (link) {
    var target = link.getAttribute("data-nav-link");
    if (target === currentPage) {
      link.classList.add("text-accent");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------------------------------------------------------------------
     Scroll reveal — progressive enhancement only. If IntersectionObserver
     isn't supported, elements stay fully visible (no .reveal class added).
     ------------------------------------------------------------------- */
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealTargets = document.querySelectorAll("[data-reveal]");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });

    // Safety net: if an element never intersects (e.g. it starts fully
    // visible in a very tall/short viewport, or the browser delivers no
    // entries in time), don't let it stay invisible forever.
    window.setTimeout(function () {
      revealTargets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      observer.disconnect();
    }, 1200);
  }

  /* ---------------------------------------------------------------------
     FAQ accordion
     ------------------------------------------------------------------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var button = item.querySelector(".faq-question");
    if (!button) return;
    button.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // Close other open items for a cleaner single-answer accordion.
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("open", !isOpen);
      button.setAttribute("aria-expanded", (!isOpen).toString());
    });
  });

  /* ---------------------------------------------------------------------
     Contact form — front-end only demo.
     NOTE: this does not send data anywhere yet. Wire it up to a real
     backend or a form service (e.g. your own API endpoint, Formspree,
     Getform) before going live.
     ------------------------------------------------------------------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var statusEl = document.getElementById("contact-form-status");
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var required = contactForm.querySelectorAll("[required]");
      var firstInvalid = null;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          field.setAttribute("aria-invalid", "true");
          if (!firstInvalid) firstInvalid = field;
        } else {
          field.removeAttribute("aria-invalid");
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (statusEl) {
          statusEl.textContent = "Пожалуйста, заполните обязательные поля.";
          statusEl.className = "mt-4 text-sm text-destructive";
        }
        return;
      }

      // Demo-only success state — replace with a real fetch() call to your
      // backend once one exists.
      contactForm.reset();
      if (statusEl) {
        statusEl.textContent =
          "Спасибо! Заявка сформирована. Подключите форму к вашему backend или сервису форм, чтобы она реально отправлялась.";
        statusEl.className = "mt-4 text-sm text-accent";
      }
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------- */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
