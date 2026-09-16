document.addEventListener("DOMContentLoaded", function () {
  // Dynamic current year in footer
  document.querySelectorAll("[data-current-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  // Mobile navigation menu
  var menuButton = document.querySelector(".menu-button");
  var siteMenu = document.getElementById("site-menu");

  if (menuButton && siteMenu) {
    menuButton.addEventListener("click", function () {
      var isOpen = siteMenu.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    siteMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteMenu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  // Scroll reveal observer
  var revealItems = document.querySelectorAll("[data-reveal]");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px" });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  // Application category filter tabs
  var filterButtons = document.querySelectorAll("[data-filter]");
  var projectCards = document.querySelectorAll("[data-category]");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.dataset.filter;
      filterButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      projectCards.forEach(function (card) {
        var categories = card.dataset.category.split(" ");
        card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
      });
    });
  });

  // Keep native fragment links usable after a category filter hides a card.
  function revealDestination(hash, focus) {
    if (!hash || hash.charAt(0) !== "#") return;
    var card = document.getElementById(hash.slice(1));
    if (!card || !card.matches(".project-card[data-category]")) return;
    if (card.classList.contains("is-hidden")) {
      var allButton = document.querySelector('[data-filter="all"]');
      if (allButton) allButton.click();
    }
    card.classList.add("is-visible");
    if (focus) {
      var heading = card.querySelector("h3");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }
  }

  document.querySelectorAll("[data-entrance-link]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      // Preserve open-in-new-tab and modified-click browser behavior.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      revealDestination(link.hash, true);
    });
  });
  window.addEventListener("hashchange", function () {
    revealDestination(window.location.hash, false);
    var destination = document.getElementById(window.location.hash.slice(1));
    if (destination && destination.matches(".project-card[data-category]")) {
      destination.scrollIntoView({ block: "start", behavior: prefersReducedMotion ? "instant" : "smooth" });
    }
  });
  revealDestination(window.location.hash, false);

  // The scene pin and its matching destination card highlight together.
  var entranceLinks = document.querySelectorAll("[data-entrance]");
  function syncEntranceHighlight() {
    var active = new Set();
    entranceLinks.forEach(function (link) {
      if (link.matches(":hover") || link === document.activeElement) active.add(link.dataset.entrance);
    });
    entranceLinks.forEach(function (link) {
      link.classList.toggle("is-highlighted", active.has(link.dataset.entrance));
    });
  }
  entranceLinks.forEach(function (link) {
    ["pointerenter", "pointerleave", "focus", "blur"].forEach(function (eventName) {
      link.addEventListener(eventName, syncEntranceHighlight);
    });
  });

  // Dynamic status ticker with playful studio messages
  var statusTicker = document.querySelector("[data-status-ticker]");
  var statusMessages = [
    "Finding the next small discovery around the corner.",
    "Turning a favorite trip memory into a T-shirt idea.",
    "Making room for one more family adventure.",
    "Helping a handmade piece carry its maker’s story.",
    "Exploring a little help from a friendly tabletop robot."
  ];

  if (statusTicker && !prefersReducedMotion) {
    var statusIndex = 0;
    window.setInterval(function () {
      statusTicker.classList.add("is-changing");
      window.setTimeout(function () {
        statusIndex = (statusIndex + 1) % statusMessages.length;
        statusTicker.textContent = statusMessages[statusIndex];
        statusTicker.classList.remove("is-changing");
      }, 220);
    }, 4500);
  }

  // Interactive 1: Tourist Design Studio Souvenir Stamp & Color Switcher
  var shirtScene = document.querySelector("[data-shirt-stamp]");
  if (shirtScene) {
    var stamps = ["🎨", "☕", "🏺", "🤖", "🏔️", "✨", "🧶", "🚀"];
    var stampIndex = -1;
    var stampBadge = shirtScene.querySelector(".shirt-interactive-stamp");
    var shirtBody = shirtScene.querySelector(".shirt-body");

    var shirtColors = [
      { base: "#fffaf1", art: "linear-gradient(150deg, #ec775d 0 45%, #f4cd75 45% 70%, #1f6f68 70%)" },
      { base: "#dcecf1", art: "linear-gradient(150deg, #1f6f68 0 40%, #ec775d 40% 75%, #f4cd75 75%)" },
      { base: "#fceee5", art: "linear-gradient(150deg, #be523f 0 50%, #f4cd75 50% 80%, #294b47 80%)" },
      { base: "#ede6f5", art: "linear-gradient(150deg, #6c5794 0 45%, #ec775d 45% 70%, #f4cd75 70%)" }
    ];
    var colorIndex = 0;

    shirtScene.addEventListener("click", function () {
      stampIndex = (stampIndex + 1) % stamps.length;
      colorIndex = (colorIndex + 1) % shirtColors.length;

      if (shirtBody) {
        shirtScene.style.setProperty("--shirt-base", shirtColors[colorIndex].base);
        shirtScene.style.setProperty("--shirt-art-grad", shirtColors[colorIndex].art);
      }

      if (stampBadge) {
        stampBadge.textContent = stamps[stampIndex];
        stampBadge.classList.remove("stamp-pop");
        void stampBadge.offsetWidth;
        stampBadge.classList.add("stamp-pop");
      }
      shirtScene.setAttribute("aria-label", "Souvenir stamped with " + stamps[stampIndex] + ". Click for another design.");
    });
  }

  // Interactive 2: Digital City Query Chips
  var cityChips = document.querySelectorAll(".city-chip");
  var cityPin = document.querySelector(".scene-pin");
  if (cityChips.length && cityPin) {
    cityChips.forEach(function (chip) {
      chip.addEventListener("click", function (e) {
        e.stopPropagation();
        cityChips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        cityPin.style.animation = "none";
        void cityPin.offsetWidth;
        cityPin.style.animation = "cityPinBounce .4s cubic-bezier(.34,1.56,.64,1) 2 alternate";
      });
    });
  }

  // Interactive 3: 3D Parallax Tilt Physics on Desktop
  if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    projectCards.forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var xRatio = (event.clientX - rect.left) / rect.width - 0.5;
        var yRatio = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", (-yRatio * 4.5).toFixed(2) + "deg");
        card.style.setProperty("--tilt-y", (xRatio * 4.5).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  // Interactive 4: Robot Moments Easter Egg & Emotions
  var robotButton = document.querySelector("[data-robot-secret]");
  if (robotButton) {
    var robotTapCount = 0;
    var robotTapTimer;
    var robotScene = robotButton.closest(".scene-robot");
    var robotMessage = robotScene ? robotScene.querySelector(".robot-secret-message") : null;

    robotButton.addEventListener("click", function () {
      robotTapCount += 1;
      window.clearTimeout(robotTapTimer);

      // Trigger playful eye wink on tap
      robotButton.classList.toggle("is-wink", robotTapCount % 2 === 1);

      if (robotTapCount >= 3) {
        robotTapCount = 0;
        if (robotMessage) {
          robotMessage.textContent = "Beep boop! Secret gear found. 🤖✨";
          robotMessage.classList.add("is-visible");
        }

        for (var confettiIndex = 0; confettiIndex < 22; confettiIndex += 1) {
          var confetti = document.createElement("span");
          confetti.className = "robot-confetti";
          confetti.style.setProperty("--confetti-x", (Math.random() * 200 - 100).toFixed(0) + "px");
          confetti.style.setProperty("--confetti-y", (Math.random() * 95 + 40).toFixed(0) + "px");
          confetti.style.animationDelay = (confettiIndex * 16) + "ms";
          robotScene.appendChild(confetti);
          window.setTimeout(function (piece) { piece.remove(); }, 1200, confetti);
        }

        window.setTimeout(function () {
          if (robotMessage) robotMessage.classList.remove("is-visible");
          robotButton.classList.remove("is-wink");
        }, 2800);
        return;
      }

      robotTapTimer = window.setTimeout(function () {
        robotTapCount = 0;
        robotButton.classList.remove("is-wink");
      }, 1200);
    });
  }

  // Privacy-friendly contact form mailto handler
  var contactForm = document.getElementById("applicationContactForm");
  if (contactForm) {
    // Story links can name a scene; accept only the options displayed in the form.
    var scene = new URLSearchParams(window.location.search).get("scene");
    var interest = contactForm.querySelector("#interest");
    if (scene && interest) {
      Array.prototype.some.call(interest.options, function (option) {
        if (option.dataset.scene !== scene) return false;
        interest.value = option.value;
        return true;
      });
    }
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      var formData = new FormData(contactForm);
      var subject = "SeedCore application conversation — " + (formData.get("interest") || "General");
      var body = [
        "Hi SeedCore,",
        "",
        formData.get("message"),
        "",
        "Name: " + formData.get("name"),
        "Email: " + formData.get("email"),
        "Application world: " + (formData.get("interest") || "Not specified")
      ].join("\n");
      window.location.href = "mailto:hello@seedcore.ai?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
});
