document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------
     PRICING TOGGLE
     ------------------------- */
  const monthlyBtn = document.getElementById("monthly-btn");
  const yearlyBtn = document.getElementById("yearly-btn");
  const proPrice = document.getElementById("pro-price");

  if (monthlyBtn && yearlyBtn && proPrice) {
    const MONTHLY = "$19.00";
    const YEARLY = "$30.00";

    function setPrice(isYearly) {
      proPrice.textContent = isYearly ? YEARLY : MONTHLY;
      yearlyBtn.classList.toggle("active", isYearly);
      monthlyBtn.classList.toggle("active", !isYearly);
    }

    monthlyBtn.addEventListener("click", () => setPrice(false));
    yearlyBtn.addEventListener("click", () => setPrice(true));
    setPrice(false);
  }

  /* -------------------------
     TESTIMONIAL SLIDER
     ------------------------- */
  const container = document.querySelector(".testimonial-slider-container");
  if (container) {
    const track = container.querySelector(".testimonial-slider");
    const cards = Array.from(container.querySelectorAll(".testimonial-card"));
    const left = container.querySelector(".left-arrow");
    const right = container.querySelector(".right-arrow");
    const dotsWrapper = container.querySelector(".pagination-dots");

    // Safe checks
    if (!track || cards.length === 0 || !left || !right || !dotsWrapper) {
      console.warn("Slider missing elements — skipping slider init.");
    } else {
      let currentIndex = 0;
      let slidesPerView = window.innerWidth <= 768 ? 1 : 2;

      function getCardFullWidth(card) {
        const w = card.getBoundingClientRect().width;
        const style = getComputedStyle(card);
        const ml = parseFloat(style.marginLeft) || 0;
        const mr = parseFloat(style.marginRight) || 0;
        return Math.round(w + ml + mr);
      }

      function totalViews() {
        return Math.max(1, cards.length - slidesPerView + 1);
      }

      function createDots() {
        dotsWrapper.innerHTML = "";
        const views = totalViews();
        for (let i = 0; i < views; i++) {
          const dot = document.createElement("span");
          dot.className = "dot" + (i === 0 ? " active" : "");
          dot.dataset.index = i;
          dot.addEventListener("click", () => {
            currentIndex = i;
            update();
          });
          dotsWrapper.appendChild(dot);
        }
      }

      function update() {
        slidesPerView = window.innerWidth <= 768 ? 1 : 2;
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > totalViews() - 1) currentIndex = totalViews() - 1;

        const cardWidth = getCardFullWidth(cards[0]);
        const translateX = -currentIndex * cardWidth;

        track.style.transition = "transform 0.45s cubic-bezier(.22,.61,.36,1)";
        track.style.transform = `translateX(${translateX}px)`;

        left.disabled = currentIndex === 0;
        right.disabled = currentIndex >= totalViews() - 1;

        const dots = Array.from(dotsWrapper.querySelectorAll(".dot"));
        dots.forEach(d => d.classList.remove("active"));
        if (dots[currentIndex]) dots[currentIndex].classList.add("active");
      }

      function next() { if (currentIndex < totalViews() - 1) { currentIndex++; update(); } }
      function prev() { if (currentIndex > 0) { currentIndex--; update(); } }

      // Drag / swipe
      let isDown = false;
      let startX = 0;

      track.addEventListener("mousedown", (e) => { isDown = true; startX = e.clientX; track.style.transition = "none"; });
      window.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        const matrix = getComputedStyle(track).transform;
        let baseX = 0;
        if (matrix && matrix !== "none") baseX = new DOMMatrixReadOnly(matrix).m41;
        track.style.transform = `translateX(${baseX + dx}px)`;
      });
      window.addEventListener("mouseup", (e) => {
        if (!isDown) return; isDown = false;
        const dx = e.clientX - startX;
        if (dx < -50) next();
        else if (dx > 50) prev();
        else update();
      });

      // Touch events
      track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; track.style.transition = "none"; });
      track.addEventListener("touchmove", (e) => {
        const dx = e.touches[0].clientX - startX;
        const matrix = getComputedStyle(track).transform;
        let baseX = 0;
        if (matrix && matrix !== "none") baseX = new DOMMatrixReadOnly(matrix).m41;
        track.style.transform = `translateX(${baseX + dx}px)`;
      });
      track.addEventListener("touchend", (e) => {
        const endX = (e.changedTouches && e.changedTouches[0].clientX) || startX;
        const dx = endX - startX;
        if (dx < -50) next();
        else if (dx > 50) prev();
        else update();
      });

      left.addEventListener("click", prev);
      right.addEventListener("click", next);
      window.addEventListener("resize", () => { slidesPerView = window.innerWidth <= 768 ? 1 : 2; createDots(); update(); });

      // init
      createDots();
      update();
    }
  }

  /* -------------------------
     FAQ ACCORDION
     ------------------------- */
  const faqToggles = document.querySelectorAll(".js-faq-toggle");
  faqToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest(".faq-item");
      if (!item) return;
      const wasExpanded = item.classList.contains("expanded");
      // close other items (accordion behavior)
      document.querySelectorAll(".faq-item.expanded").forEach(i => {
        if (i !== item) {
          i.classList.remove("expanded");
          const btn = i.querySelector(".arrow-btn");
          if (btn) btn.classList.remove("expanded"), btn.setAttribute("aria-expanded","false");
        }
      });
      if (wasExpanded) {
        item.classList.remove("expanded");
        const btn = item.querySelector(".arrow-btn");
        if (btn) btn.classList.remove("expanded"), btn.setAttribute("aria-expanded","false");
      } else {
        item.classList.add("expanded");
        const btn = item.querySelector(".arrow-btn");
        if (btn) btn.classList.add("expanded"), btn.setAttribute("aria-expanded","true");
      }
    });
  });

});
