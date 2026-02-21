/* ═══════════════════════════════════════════════
   Wedding Invitation Script
   ═══════════════════════════════════════════════ */

/* ── Force scroll to top on page load ── */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

const CONFIG = {
  groomName: "김태진",
  brideName: "박영경",
  groomParentName: "김명길 · 이애란",
  brideParentName: "박갑순 · 강자영",
  weddingDate: "2026-11-14T11:00:00+09:00",
  venue: "그랜드모먼트 6층 시그니처홀",
  address: "부산광역시 남구 황령대로 401-9 그랜드모먼트",
};

const PHOTOS = [
  "https://images.unsplash.com/photo-1465495976277-4387d4b0d799?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80",
];

let lightboxIndex = 0;

/* ── Intro — 3-Slide Cinematic ── */
function initIntro() {
  const intro = document.getElementById("intro");
  const enterBtn = document.getElementById("introEnter");
  if (!intro || !enterBtn) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    intro.remove();
    startHeroCascade();
    return;
  }

  document.body.classList.add("intro-active");

  const slides = intro.querySelectorAll(".intro-slide");
  const totalSlides = slides.length;
  let current = 0;

  // Activate first slide
  slides[0].classList.add("is-active");

  // Auto-advance slides
  const SLIDE_DURATION = 2800; // ms per slide
  const slideTimer = setInterval(() => {
    const prev = current;
    current++;
    if (current >= totalSlides) {
      clearInterval(slideTimer);
      // Show enter button on last slide
      enterBtn.classList.add("is-visible");
      return;
    }
    slides[prev].classList.remove("is-active");
    slides[prev].classList.add("is-prev");
    slides[current].classList.add("is-active");

    // Show enter button on last slide
    if (current === totalSlides - 1) {
      setTimeout(() => {
        enterBtn.classList.add("is-visible");
      }, 800);
    }
  }, SLIDE_DURATION);

  function closeIntro() {
    clearInterval(slideTimer);
    intro.classList.add("is-closing");
    document.body.classList.remove("intro-active");
    setTimeout(() => {
      intro.remove();
      startHeroCascade();
    }, 1000);
  }

  enterBtn.addEventListener("click", closeIntro);

  const skipBtn = document.getElementById("introSkip");
  if (skipBtn) skipBtn.addEventListener("click", closeIntro);
}

function startHeroCascade() {
  const items = document.querySelectorAll(".cascade");
  items.forEach((el, i) => {
    const delay = parseInt(el.dataset.delay || "0", 10);
    setTimeout(() => el.classList.add("is-visible"), 200 + delay * 180);
  });
}

/* ── Calendar ── */
function renderCalendar() {
  const date = new Date(CONFIG.weddingDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const targetDay = date.getDate();
  const today = new Date();

  const grid = document.getElementById("calendarDays");
  const label = document.getElementById("calendarMonthLabel");
  if (!grid || !label) return;

  label.textContent = `${year}년 ${month + 1}월`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  let html = "";

  for (let i = 0; i < firstDay; i++) {
    html += '<span class="empty"></span>';
  }

  for (let d = 1; d <= lastDate; d++) {
    const dayOfWeek = (firstDay + d - 1) % 7;
    const classes = [];

    if (d === targetDay) classes.push("target");
    if (dayOfWeek === 0) classes.push("sunday");
    if (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === d
    ) {
      classes.push("today");
    }

    html += `<span class="${classes.join(" ")}">${d}</span>`;
  }

  grid.innerHTML = html;
}

/* ── Countdown ── */
function updateCountdown() {
  const el = document.getElementById("countdownText");
  if (!el) return;

  const target = new Date(CONFIG.weddingDate).getTime();
  const diff = target - Date.now();

  if (diff <= 0) {
    el.textContent = "Today";
    return;
  }

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  el.textContent = `D-${days}`;
}

/* ── Clipboard ── */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/* ── Toast ── */
function showToast(message) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add("is-visible");

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

/* ── Copy Buttons ── */
function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ok = await copyToClipboard(btn.dataset.copy);
      showToast(ok ? "복사되었습니다" : "복사에 실패했습니다");
    });
  });
}

/* ── RSVP ── */
function initRsvpForm() {
  const form = document.getElementById("rsvpForm");
  const feedback = document.getElementById("rsvpFeedback");
  if (!form || !feedback) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const text = [
      `[${CONFIG.groomName} ♥ ${CONFIG.brideName} 결혼식 참석의사]`,
      `이름: ${data.get("name")}`,
      `구분: ${data.get("side")}`,
      `참석: ${data.get("attending")}`,
      `동행 인원: ${data.get("guests")}명`,
      `메시지: ${data.get("message") || "-"}`,
    ].join("\n");

    const ok = await copyToClipboard(text);
    if (ok) {
      showToast("참석의사가 복사되었습니다");
      feedback.textContent = "신랑 또는 신부에게 전달해 주세요.";
      form.reset();
    } else {
      feedback.textContent = "복사에 실패했습니다. 다시 시도해 주세요.";
    }
  });
}

/* ── Gallery / Lightbox ── */
function initGallery() {
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lightboxImage");
  const lbClose = document.getElementById("lightboxClose");
  const lbPrev = document.getElementById("lightboxPrev");
  const lbNext = document.getElementById("lightboxNext");
  const lbCounter = document.getElementById("lightboxCounter");

  if (!lightbox || !lbImage) return;

  function show(index) {
    lightboxIndex = ((index % PHOTOS.length) + PHOTOS.length) % PHOTOS.length;
    lbImage.src = PHOTOS[lightboxIndex];
    lightbox.classList.add("is-active");
    document.body.style.overflow = "hidden";
    if (lbCounter) lbCounter.textContent = `${lightboxIndex + 1} / ${PHOTOS.length}`;
  }

  function close() {
    lightbox.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".gallery-item").forEach((btn) => {
    btn.addEventListener("click", () => show(Number(btn.dataset.index || 0)));
  });

  if (lbClose) lbClose.addEventListener("click", close);
  if (lbPrev) lbPrev.addEventListener("click", () => show(lightboxIndex - 1));
  if (lbNext) lbNext.addEventListener("click", () => show(lightboxIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-active")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(lightboxIndex - 1);
    if (e.key === "ArrowRight") show(lightboxIndex + 1);
  });

  // Touch swipe
  let startX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) < 50) return;
    show(diff > 0 ? lightboxIndex - 1 : lightboxIndex + 1);
  }, { passive: true });
}

/* ── Contact Modal ── */
function initContactModal() {
  const overlay = document.getElementById("contactModal");
  const openBtn = document.getElementById("contactOpen");
  const closeBtn = document.getElementById("contactClose");
  if (!overlay || !openBtn || !closeBtn) return;

  function open() {
    overlay.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-active")) close();
  });
}

/* ── Scroll Reveal (all types) ── */
function initReveal() {
  const reveals = document.querySelectorAll(".reveal");
  const clips = document.querySelectorAll(".clip-reveal");
  const textLines = document.querySelectorAll(".text-line");

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((t) => t.classList.add("is-visible"));
    clips.forEach((t) => t.classList.add("is-visible"));
    textLines.forEach((t) => t.classList.add("is-visible"));
    return;
  }

  // Standard reveal
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((t) => revealObs.observe(t));

  // Clip reveal (section titles)
  const clipObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          clipObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3, rootMargin: "0px 0px -20px 0px" }
  );
  clips.forEach((t) => clipObs.observe(t));

  // Text line stagger reveal
  const lineObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reveal all lines in the parent container with stagger
          const parent = entry.target.closest(".greeting-quote, .greeting-body");
          if (parent) {
            const siblings = parent.querySelectorAll(".text-line:not(.is-visible)");
            siblings.forEach((line, i) => {
              line.style.setProperty("--line-delay", `${i * 0.15}s`);
              line.classList.add("is-visible");
            });
          } else {
            entry.target.classList.add("is-visible");
          }
          lineObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -30px 0px" }
  );

  // Observe first line in each group
  document.querySelectorAll(".greeting-quote, .greeting-body").forEach((group) => {
    const first = group.querySelector(".text-line");
    if (first) lineObs.observe(first);
  });
}

/* ── Bottom Nav ── */
function initBottomNav() {
  const nav = document.getElementById("bottomNav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a"));
  const sectionIds = links.map((a) => a.dataset.section).filter(Boolean);
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  // Show nav after scrolling past hero
  const hero = document.getElementById("top");

  if (hero) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle("is-visible", !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    heroObserver.observe(hero);
  } else {
    nav.classList.add("is-visible");
  }

  // Active state
  if (sections.length === 0) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => {
            a.classList.toggle("active", a.dataset.section === entry.target.id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => sectionObserver.observe(s));
}

/* ── Gallery Stagger ── */
function initStagger() {
  const items = document.querySelectorAll(".stagger");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Find all stagger siblings within the same parent
          const parent = entry.target.closest(".gallery");
          if (parent) {
            const siblings = parent.querySelectorAll(".stagger:not(.is-visible)");
            siblings.forEach((el, i) => {
              el.style.setProperty("--stagger-delay", `${i * 0.12}s`);
              el.classList.add("is-visible");
            });
            observer.unobserve(entry.target);
          } else {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  // Observe only the first stagger item per gallery
  const gallery = document.getElementById("galleryGrid");
  if (gallery) {
    const first = gallery.querySelector(".stagger");
    if (first) observer.observe(first);
  }
}

/* ── Hero Parallax ── */
function initParallax() {
  const photo = document.querySelector(".hero-photo");
  const frame = document.querySelector(".hero-photo-frame");
  if (!photo || !frame) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = frame.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Only apply when hero is in view
      if (rect.bottom > 0 && rect.top < viewH) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const offset = (progress - 0.5) * 60; // max ±30px shift
        photo.style.transform = `translateY(${offset}px) scale(1.08)`;
      }
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ── D-day Count-up Animation ── */
function initCountUp() {
  const el = document.getElementById("countdownText");
  if (!el) return;

  const target = new Date(CONFIG.weddingDate).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return;

  const finalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  let started = false;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        observer.disconnect();
        animateCount(el, finalDays);
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(el.closest(".calendar-section") || el);
}

function animateCount(el, target) {
  const duration = 1600; // ms
  const start = performance.now();
  // Ease out cubic
  function ease(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(ease(progress) * target);
    el.textContent = `D-${current}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  el.textContent = "D-0";
  requestAnimationFrame(frame);
}

/* ── Share ── */
function initShare() {
  const nativeBtn = document.getElementById("shareNative");
  const copyBtn = document.getElementById("shareCopy");
  const url = window.location.href;
  const title = `${CONFIG.groomName} ♥ ${CONFIG.brideName} 결혼식에 초대합니다`;
  const text = `2026년 11월 14일 토요일 오전 11시\n그랜드모먼트 6층 시그니처홀`;

  if (nativeBtn) {
    if (navigator.share) {
      nativeBtn.addEventListener("click", async () => {
        try {
          await navigator.share({ title, text, url });
        } catch {
          /* user cancelled */
        }
      });
    } else {
      // Fallback: copy link if Web Share API not supported
      nativeBtn.addEventListener("click", async () => {
        const ok = await copyToClipboard(url);
        showToast(ok ? "링크가 복사되었습니다" : "공유에 실패했습니다");
      });
    }
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const ok = await copyToClipboard(url);
      showToast(ok ? "링크가 복사되었습니다" : "복사에 실패했습니다");
    });
  }
}

/* ── Line Art Draw Animation ── */
function initLineArt() {
  const linearts = document.querySelectorAll(".lineart");
  if (!linearts.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    linearts.forEach((la) => la.classList.add("is-drawn"));
    return;
  }

  linearts.forEach((la) => {
    const paths = la.querySelectorAll(".lineart-path");
    paths.forEach((path, i) => {
      let len = 200;
      try {
        if (typeof path.getTotalLength === "function") {
          len = path.getTotalLength();
        } else if (path.tagName.toLowerCase() === "circle") {
          const r = parseFloat(path.getAttribute("r") || 0);
          len = 2 * Math.PI * r;
        }
      } catch (e) {
        len = 200;
      }
      // Use CSS custom properties only — no inline style overrides
      path.style.setProperty("--path-len", String(len));
      path.style.setProperty("--draw-delay", `${i * 0.12}s`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-drawn");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3, rootMargin: "0px 0px -20px 0px" }
  );

  linearts.forEach((la) => observer.observe(la));
}

/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
      ticking = false;
    });
  }, { passive: true });
}

/* ── Account Accordion ── */
function initAccountAccordion() {
  document.querySelectorAll(".account-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
    });
  });
}

/* ── Init ── */
document.addEventListener("DOMContentLoaded", () => {
  initIntro();
  renderCalendar();
  updateCountdown();
  initCopyButtons();
  initRsvpForm();
  initGallery();
  initContactModal();
  initReveal();
  initStagger();
  initParallax();
  initCountUp();
  initBottomNav();
  initShare();
  initAccountAccordion();
  initScrollProgress();
  initLineArt();

  setInterval(updateCountdown, 60000);
});
