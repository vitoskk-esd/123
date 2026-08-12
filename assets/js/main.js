/* =========================================================================
   Synapse — shared site behaviour (mobile menu, scroll reveal, FAQ,
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
     3D tilt-on-hover cards — mouse-only, skipped under reduced motion.
     Sets --tilt-x/--tilt-y custom properties consumed by styles.css.
     ------------------------------------------------------------------- */
  if (!prefersReducedMotion) {
    var MAX_TILT_DEG = 7;
    document.querySelectorAll(".tilt-card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        if (event.pointerType && event.pointerType !== "mouse") return;
        var rect = card.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width;
        var py = (event.clientY - rect.top) / rect.height;
        var tiltY = (px - 0.5) * 2 * MAX_TILT_DEG;
        var tiltX = (0.5 - py) * 2 * MAX_TILT_DEG;
        card.style.setProperty("--tilt-x", tiltX.toFixed(2) + "deg");
        card.style.setProperty("--tilt-y", tiltY.toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
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
     Contact form — submits to Web3Forms (api.web3forms.com), a free
     forms-as-a-service that just relays each submission to an inbox by
     email. No backend of our own to host/maintain, works on any static
     hosting (GitHub Pages, Netlify, anywhere).
     Setup: get a free access key at https://web3forms.com (enter the
     inbox email, they email back a key — no account/password) and paste
     it into the hidden "access_key" input in contact.html, replacing
     "YOUR_WEB3FORMS_ACCESS_KEY". Until that's done, submissions will
     fail with the access-key error below.
     ------------------------------------------------------------------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var statusEl = document.getElementById("contact-form-status");
    var submitBtn = contactForm.querySelector('button[type="submit"]');

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

      var accessKeyField = contactForm.querySelector('[name="access_key"]');
      if (!accessKeyField || accessKeyField.value === "YOUR_WEB3FORMS_ACCESS_KEY") {
        if (statusEl) {
          statusEl.textContent =
            "Форма почти готова: не хватает ключа Web3Forms (см. TODO в contact.html / assets/js/main.js), поэтому заявка сейчас никуда не ушла.";
          statusEl.className = "mt-4 text-sm text-destructive";
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (statusEl) {
        statusEl.textContent = "Отправляем…";
        statusEl.className = "mt-4 text-sm text-foreground/60";
      }

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.success) {
            contactForm.reset();
            if (statusEl) {
              statusEl.textContent =
                "Спасибо! Заявка отправлена — ответим в течение нескольких часов.";
              statusEl.className = "mt-4 text-sm text-accent";
            }
          } else {
            throw new Error((result.data && result.data.message) || "Submit failed");
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent =
              "Не получилось отправить заявку. Попробуйте ещё раз или напишите нам напрямую — контакты ниже.";
            statusEl.className = "mt-4 text-sm text-destructive";
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------- */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------------
     Copy-to-clipboard — the Email icon/links copy the address instead of
     opening the visitor's mail client (they're <button>s, not <a href
     ="mailto:">, so there's nothing to navigate to in the first place).
     Falls back to a hidden-textarea + execCommand for browsers/contexts
     without the async Clipboard API (e.g. non-secure origins).
     ------------------------------------------------------------------- */
  var copyToast = null;
  function showCopyToast(message) {
    if (!copyToast) {
      copyToast = document.createElement("div");
      copyToast.className = "copy-toast";
      copyToast.setAttribute("role", "status");
      copyToast.setAttribute("aria-live", "polite");
      document.body.appendChild(copyToast);
    }
    copyToast.textContent = message;
    // Reflow before adding the class so the transition always plays, even
    // on a second click while the first toast is still fading in.
    copyToast.classList.remove("is-visible");
    void copyToast.offsetWidth;
    copyToast.classList.add("is-visible");
    window.clearTimeout(copyToast._hideTimer);
    copyToast._hideTimer = window.setTimeout(function () {
      copyToast.classList.remove("is-visible");
    }, 2200);
  }

  function copyTextFallback(text) {
    var temp = document.createElement("textarea");
    temp.value = text;
    temp.setAttribute("readonly", "");
    temp.style.position = "fixed";
    temp.style.top = "-1000px";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    temp.setSelectionRange(0, text.length);
    try {
      document.execCommand("copy");
    } catch (e) {
      // Nothing more we can do — the toast below still tells the visitor
      // the address, so they can select/copy it manually.
    }
    document.body.removeChild(temp);
  }

  document.querySelectorAll("[data-copy-text]").forEach(function (el) {
    el.addEventListener("click", function () {
      var text = el.getAttribute("data-copy-text");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () {
            showCopyToast("Email скопирован: " + text);
          },
          function () {
            copyTextFallback(text);
            showCopyToast("Email скопирован: " + text);
          }
        );
      } else {
        copyTextFallback(text);
        showCopyToast("Email скопирован: " + text);
      }
    });
  });
})();
