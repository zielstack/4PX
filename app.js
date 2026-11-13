/**
 * 4PX Express — Interactive Application Engine
 * Handles telemetry clocks, interactive routing corridors, leadership switch,
 * cargo tracking simulation modal, and quote submission toast.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initLiveClocks();
  initNavbar();
  initTradeRoutesTabs();
  initLeadershipSlider();
  initTrackingModal();
  initFooterLogoStrip();
});

/**
 * 1. Live Global Operations Clocks
 * Updates Los Angeles (US HQ) and Shenzhen (Global HQ) times in real-time.
 */
function initLiveClocks() {
  const laClockEl = document.getElementById('clock-la');
  const szxClockEl = document.getElementById('clock-szx');

  function updateTimes() {
    const now = new Date();

    // Los Angeles Time (America/Los_Angeles)
    const laTimeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Shenzhen Time (Asia/Shanghai)
    const szxTimeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Shanghai',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    if (laClockEl) laClockEl.textContent = `${laTimeStr} PST`;
    if (szxClockEl) szxClockEl.textContent = `${szxTimeStr} CST`;
  }

  updateTimes();
  setInterval(updateTimes, 1000);
}

/**
 * 2. Sticky Navbar & Mobile Drawer
 */
function initNavbar() {
  const navbar = document.querySelector('.site-navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }

  // Active section tracking
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (targetLink) targetLink.classList.add('active');
      } else {
        if (targetLink) targetLink.classList.remove('active');
      }
    });
  });
}

/**
 * 3. Trade Corridors Interactive Tabs
 */
const routeCorridorsData = {
  transpacific: {
    title: 'US WEST COAST ⇄ GREATER BAY AREA (LAX/LGB ⇄ SZX/HKG)',
    indicator: 'PRIMARY EXPEDITED CORRIDOR // DAILY SCHEDULED RUNS',
    desc: 'Direct multimodal supply chain connection between Los Angeles/Long Beach gateways and Shenzhen/Hong Kong cargo terminals. Daily dedicated air charter space combined with accelerated ocean freight vessel sailings.',
    transitAir: '18 - 36 HOURS',
    transitOcean: '11 - 14 DAYS',
    frequency: '7X WEEKLY AIR / 3X OCEAN',
    originHub: 'LOS ANGELES (LAX / LGB)',
    originSub: 'PACIFIC GATEWAY // CALIFORNIA',
    destHub: 'SHENZHEN / HKG (SZX / HKG)',
    destSub: 'GREATER BAY INDUSTRIAL NETWORK',
    modeBadge: 'AIR FREIGHT + DIRECT VESSEL'
  },
  midwest: {
    title: 'US MIDWEST & EAST COAST ⇄ EAST ASIA (ORD/JFK ⇄ PVG/NRT)',
    indicator: 'INTERMODAL TRANSIT // AUTOMOTIVE & HI-TECH',
    desc: 'Connecting Chicago O’Hare and New York JFK cargo consolidation centers with Shanghai Pudong and Tokyo Narita. Synchronized bonded linehaul trucking across the US inland manufacturing belt.',
    transitAir: '24 - 48 HOURS',
    transitOcean: '16 - 20 DAYS',
    frequency: '5X WEEKLY DIRECT',
    originHub: 'CHICAGO / NEW YORK (ORD / JFK)',
    originSub: 'MIDWEST & ATLANTIC INLAND HUBS',
    destHub: 'SHANGHAI & TOKYO (PVG / NRT)',
    destSub: 'YANGTZE RIVER DELTA & JAPAN',
    modeBadge: 'HEAVY AIR + RAIL INTERMODAL'
  },
  transatlantic: {
    title: 'NORTH AMERICA ⇄ EUROPEAN HUBS (LAX/JFK ⇄ FRA/AMS/LHR)',
    indicator: 'TRANSATLANTIC TRADE CORRIDOR // PHARMA & LUXURY',
    desc: 'Direct transshipment connections serving Frankfurt, Amsterdam Schiphol, and London Heathrow. Specialized cold-chain and bonded temperature-controlled solutions for time-sensitive cargo.',
    transitAir: '24 - 36 HOURS',
    transitOcean: '10 - 15 DAYS',
    frequency: 'DAILY FLIGHT BLOCKS',
    originHub: 'LOS ANGELES / JFK',
    originSub: 'WEST HOLLYWOOD / LAX CONTROL',
    destHub: 'FRANKFURT / AMSTERDAM',
    destSub: 'CENTRAL EUROPEAN DISTRIBUTION',
    modeBadge: 'TEMP-CONTROLLED AIR FREIGHT'
  },
  intraAsia: {
    title: 'INTRA-ASIA HIGH FREQUENCY FEEDER (SZX ⇄ SIN/BKK/ICN)',
    indicator: 'CROSS-BORDER REGIONAL HUB // RAPID DISPATCH',
    desc: 'High-density air and land feeder routes connecting Shenzhen headquarters with Singapore, Bangkok, Seoul Incheon, and Southeast Asian manufacturing centers for instant supply chain inventory replenishments.',
    transitAir: 'SAME DAY / 24 HRS',
    transitOcean: '3 - 5 DAYS',
    frequency: 'MULTIPLE DAILY DEPARTURES',
    originHub: 'SHENZHEN HQ (SZX)',
    originSub: 'GLOBAL FULFILLMENT MATRIX',
    destHub: 'SOUTHEAST ASIA (SIN / BKK / ICN)',
    destSub: 'CROSS-BORDER CONSUMER NETWORKS',
    modeBadge: 'REGIONAL EXPRESS FEEDER'
  }
};

function initTradeRoutesTabs() {
  const tabButtons = document.querySelectorAll('.route-tab-btn');
  const titleEl = document.getElementById('route-title');
  const indicatorEl = document.getElementById('route-indicator');
  const descEl = document.getElementById('route-desc');
  const metricAirEl = document.getElementById('route-metric-air');
  const metricOceanEl = document.getElementById('route-metric-ocean');
  const metricFreqEl = document.getElementById('route-metric-freq');
  const originHubEl = document.getElementById('schematic-origin-hub');
  const originSubEl = document.getElementById('schematic-origin-sub');
  const destHubEl = document.getElementById('schematic-dest-hub');
  const destSubEl = document.getElementById('schematic-dest-sub');
  const modeBadgeEl = document.getElementById('schematic-mode-badge');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const routeKey = btn.getAttribute('data-route');
      const data = routeCorridorsData[routeKey];
      if (!data) return;

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (titleEl) titleEl.textContent = data.title;
      if (indicatorEl) indicatorEl.textContent = data.indicator;
      if (descEl) descEl.textContent = data.desc;
      if (metricAirEl) metricAirEl.textContent = data.transitAir;
      if (metricOceanEl) metricOceanEl.textContent = data.transitOcean;
      if (metricFreqEl) metricFreqEl.textContent = data.frequency;
      if (originHubEl) originHubEl.textContent = data.originHub;
      if (originSubEl) originSubEl.textContent = data.originSub;
      if (destHubEl) destHubEl.textContent = data.destHub;
      if (destSubEl) destSubEl.textContent = data.destSub;
      if (modeBadgeEl) modeBadgeEl.textContent = data.modeBadge;
    });
  });
}

/**
 * 4. Leadership Section Interactive Switcher (Grace Lee, Emily Chen, David Zhang)
 * Grace Lee is permanently positioned first in sequence.
 */
const leadershipSlides = [
  {
    id: 0,
    tag: '—— OPERATIONAL ID // EXEC-01-GRACE',
    name: 'GRACE LEE',
    role: 'DIRECTOR OF GLOBAL OPERATIONS // U.S. LEAD',
    quote: '"Innovation and integrity are the cornerstones of our journey to bridge the global trade gap."',
    dossierLabel: 'DOSSIER SUMMARY:',
    bio: 'Responsible for overriding international logistics coordination and business development across the primary US-Asia high-velocity corridors. Directing air and ocean cargo strategies, warehouse fulfillment operations, and strategic client accounts.',
    clearance: 'LEVEL-01 EXECUTIVE',
    station: 'GLOBAL_HQ // LA',
    email: 'grace@fourpxlogistic.com',
    photo: 'Grace.jpg',
    photoAlt: 'Grace Lee - Director of Global Operations at 4PX Express',
    badgeVisionary: 'VISIONARY',
    badgeTitle: 'HEAD OF LOGISTICS STRATEGY',
    pageIndicator: '01 / 03'
  },
  {
    id: 1,
    tag: '—— OPERATIONAL ID // EXEC-02-EMILY',
    name: 'EMILY CHEN',
    role: 'VP OF CROSS-BORDER OPERATIONS // APAC EXPANSION',
    quote: '"Precision cross-border routing and compliant customs speed turn global trade lanes into continuous competitive advantage."',
    dossierLabel: 'OPERATIONAL DIRECTIVE:',
    bio: 'Directing Asian port consolidation, automated bonded warehouse networks, and high-frequency intra-Asia and transpacific air routes. Overseeing regional distribution hubs connecting Shenzhen, Hong Kong, and North American maritime gateways.',
    clearance: 'LEVEL-01 OPERATIONS',
    station: 'SHENZHEN HQ // APAC',
    email: 'operations@fourpxlogistic.com',
    photo: 'Emily.png',
    photoAlt: 'Emily Chen - VP of Cross-Border Operations at 4PX Express',
    badgeVisionary: 'OPERATIONS LEAD',
    badgeTitle: 'VP CROSS-BORDER NETWORK',
    pageIndicator: '02 / 03'
  },
  {
    id: 2,
    tag: '—— OPERATIONAL ID // EXEC-03-DAVID',
    name: 'DAVID ZHANG',
    role: 'CHIEF TECHNOLOGY OFFICER // GLOBAL FREIGHT FLEET',
    quote: '"Real-time telemetry and algorithmic vessel routing are rewriting the speed limits of international supply chains."',
    dossierLabel: 'TECHNICAL MANDATE:',
    bio: 'Leading enterprise EDI 856/940 system architectures, predictive cargo tracking telemetry, and global carrier block-space allocations across primary commercial air freighters and container alliances. Harmonizing multi-modal digital logistics.',
    clearance: 'LEVEL-01 TECHNOLOGY',
    station: 'WEST COAST // LAX HUB',
    email: 'freight@fourpxlogistic.com',
    photo: 'DAVID.png',
    photoAlt: 'David Zhang - Chief Technology Officer at 4PX Express',
    badgeVisionary: 'TECH PIONEER',
    badgeTitle: 'CHIEF TECHNOLOGY OFFICER',
    pageIndicator: '03 / 03'
  }
];

function initLeadershipSlider() {
  let currentSlide = 0;
  const prevBtn = document.getElementById('leadership-prev');
  const nextBtn = document.getElementById('leadership-next');
  const tagEl = document.getElementById('leadership-tag');
  const nameEl = document.getElementById('leadership-name');
  const roleEl = document.getElementById('leadership-role');
  const quoteEl = document.getElementById('leadership-quote');
  const dossierLabelEl = document.getElementById('leadership-dossier-label');
  const bioEl = document.getElementById('leadership-bio');
  const clearanceEl = document.getElementById('leadership-clearance');
  const stationEl = document.getElementById('leadership-station');
  const mailBtnEl = document.getElementById('leadership-mail');
  const pageIndicatorEl = document.getElementById('leadership-page');
  const photoEl = document.getElementById('leadership-photo');
  const badgeVisionaryEl = document.getElementById('leadership-badge-visionary');
  const badgeTitleEl = document.getElementById('leadership-badge-title');
  const tabPills = document.querySelectorAll('.leader-tab-pill');
  const previewCards = document.querySelectorAll('.exec-preview-card');

  function renderSlide(index) {
    const data = leadershipSlides[index];
    if (!data) return;

    if (tagEl) tagEl.textContent = data.tag;
    if (nameEl) nameEl.textContent = data.name;
    if (roleEl) roleEl.textContent = data.role;
    if (quoteEl) quoteEl.textContent = data.quote;
    if (dossierLabelEl) dossierLabelEl.textContent = data.dossierLabel;
    if (bioEl) bioEl.textContent = data.bio;
    if (clearanceEl) clearanceEl.textContent = data.clearance;
    if (stationEl) stationEl.textContent = data.station;
    if (pageIndicatorEl) pageIndicatorEl.textContent = data.pageIndicator;

    if (mailBtnEl) {
      mailBtnEl.href = `mailto:${data.email}`;
      mailBtnEl.setAttribute('aria-label', `Email ${data.name}`);
      mailBtnEl.setAttribute('title', `Contact ${data.name} via Email`);
    }

    if (photoEl) {
      photoEl.src = data.photo;
      photoEl.alt = data.photoAlt;
    }

    if (badgeVisionaryEl) badgeVisionaryEl.textContent = data.badgeVisionary;
    if (badgeTitleEl) badgeTitleEl.textContent = data.badgeTitle;

    // Update active tab pill state
    tabPills.forEach(pill => {
      const pIdx = parseInt(pill.getAttribute('data-leader'), 10);
      if (pIdx === index) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update active preview card state
    previewCards.forEach(card => {
      const cIdx = parseInt(card.getAttribute('data-leader'), 10);
      if (cIdx === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + leadershipSlides.length) % leadershipSlides.length;
      renderSlide(currentSlide);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % leadershipSlides.length;
      renderSlide(currentSlide);
    });
  }

  // Pill click listeners
  tabPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const idx = parseInt(pill.getAttribute('data-leader'), 10);
      if (!isNaN(idx)) {
        currentSlide = idx;
        renderSlide(currentSlide);
      }
    });
  });

  // Preview card click listeners
  previewCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-leader'), 10);
      if (!isNaN(idx)) {
        currentSlide = idx;
        renderSlide(currentSlide);
        // Smooth scroll to showcase card if viewing on mobile
        const showcaseCard = document.querySelector('.leadership-frame-card');
        if (showcaseCard && window.innerWidth < 900) {
          showcaseCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });
}

/**
 * 5. Tracking Modal & Shipment Telemetry Simulator
 */
function initTrackingModal() {
  const modalOverlay = document.getElementById('tracking-modal');
  const closeBtn = document.getElementById('close-tracking-modal');
  const trackingForm = document.getElementById('hero-tracking-form');
  const trackingInput = document.getElementById('hero-tracking-input');
  const modalNumberEl = document.getElementById('modal-tracking-number');

  function openModal(trackingId) {
    if (!modalOverlay) return;
    const finalId = trackingId && trackingId.trim() !== '' ? trackingId.trim().toUpperCase() : '4PX-US982410-X';
    if (modalNumberEl) modalNumberEl.textContent = finalId;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (trackingForm) {
    trackingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = trackingInput ? trackingInput.value : '';
      openModal(val);
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 6. Automatically Scrolling Footer Logo Carousel Strip
 * Continuous smooth infinite marquee with pause on hover/touch and arrow nudging.
 */
function initFooterLogoStrip() {
  const track = document.getElementById('footer-logo-track');
  const prevBtn = document.getElementById('logo-strip-prev');
  const nextBtn = document.getElementById('logo-strip-next');
  const viewport = document.getElementById('footer-logo-viewport');

  if (!track) return;

  // Manual nudge on arrow clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.classList.add('paused');
      const curTransform = window.getComputedStyle(track).transform;
      let curX = 0;
      if (curTransform !== 'none') {
        const matrix = new DOMMatrixReadOnly(curTransform);
        curX = matrix.m41;
      }
      track.style.transition = 'transform 0.4s ease';
      track.style.transform = `translateX(${curX + 160}px)`;
      setTimeout(() => {
        track.style.transition = '';
        track.style.transform = '';
        track.classList.remove('paused');
      }, 700);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.classList.add('paused');
      const curTransform = window.getComputedStyle(track).transform;
      let curX = 0;
      if (curTransform !== 'none') {
        const matrix = new DOMMatrixReadOnly(curTransform);
        curX = matrix.m41;
      }
      track.style.transition = 'transform 0.4s ease';
      track.style.transform = `translateX(${curX - 160}px)`;
      setTimeout(() => {
        track.style.transition = '';
        track.style.transform = '';
        track.classList.remove('paused');
      }, 700);
    });
  }

  // Mobile Touch Pause & Resume
  if (viewport) {
    viewport.addEventListener('touchstart', () => {
      track.classList.add('paused');
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      track.classList.remove('paused');
    }, { passive: true });
  }
}

/**
 * 7. Hero Background Video Autoplay Controller
 * Guarantees seamless looping video background with high visibility.
 */
function initHeroVideo() {
  const video = document.getElementById('hero-video-player') || document.querySelector('.hero-bg-video');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  const startPlayback = () => {
    const promise = video.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Fallback for strict browser autoplay policies
        const trigger = () => {
          video.play();
          window.removeEventListener('click', trigger);
          window.removeEventListener('touchstart', trigger);
          window.removeEventListener('scroll', trigger);
        };
        window.addEventListener('click', trigger, { once: true });
        window.addEventListener('touchstart', trigger, { once: true });
        window.addEventListener('scroll', trigger, { once: true });
      });
    }
  };

  if (video.readyState >= 2) {
    startPlayback();
  } else {
    video.addEventListener('loadeddata', startPlayback, { once: true });
  }
}


