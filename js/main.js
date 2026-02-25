(function () {
  'use strict';

  // ----- Preloader (макс. 3 секунды) -----
  var preloader = document.getElementById('preloader');
  if (preloader) {
    var preloaderDone = false;
    var PRELOADER_MAX_MS = 3000;
    var PRELOADER_FADE_MS = 500;

    function hidePreloader() {
      if (preloaderDone) return;
      preloaderDone = true;
      preloader.classList.add('preloader--hidden');
      setTimeout(function () {
        preloader.remove();
      }, PRELOADER_FADE_MS);
    }

    var preloaderTimer = setTimeout(hidePreloader, PRELOADER_MAX_MS);
    if (document.readyState === 'complete') {
      clearTimeout(preloaderTimer);
      hidePreloader();
    } else {
      window.addEventListener('load', function () {
        clearTimeout(preloaderTimer);
        hidePreloader();
      });
    }
  }

  // ----- Header scroll -----
  const header = document.getElementById('header');
  function onScrollHeader() {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  // ----- Hero video fallback (when videos/hero.mp4 is missing) -----
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.addEventListener('error', function () {
      heroVideo.style.display = 'none';
    });
  }

  // ----- Cycle video fallback (when videos/bg_cycles.mp4 is missing) -----
  var cycleVideo = document.getElementById('cycleVideo');
  if (cycleVideo) {
    cycleVideo.addEventListener('error', function () {
      cycleVideo.style.display = 'none';
    });
  }

  // ----- Hamburger & Nav -----
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 900) toggleMenu();
    });
  });

  // ----- Smooth scroll for anchors (плавное торможение) -----
  (function () {
    var headerH = 70;
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function smoothScrollTo(el) {
      var target = el.getBoundingClientRect().top + window.pageYOffset - headerH;
      var start = window.pageYOffset;
      var distance = target - start;
      var duration = Math.min(1200, Math.abs(distance) * 0.8);
      var startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var ease = easeInOutCubic(progress);
        window.scrollTo(0, start + distance * ease);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          if (window.innerWidth <= 900 && document.getElementById('navMenu').classList.contains('open')) {
            document.getElementById('hamburger').click();
          }
          smoothScrollTo(el);
        }
      });
    });
  })();

  // ----- Reveal on scroll (fade in) -----
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
  );
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ----- Interview text animation (word reveal on scroll) -----
  (function () {
    var textifyEls = document.querySelectorAll('[data-textify]');
    var stagger = 0.04;
    var duration = 0.4;

    function wrapWords(el) {
      var text = el.textContent;
      el.textContent = '';
      var words = text.split(/(\s+)/);
      var delayIndex = 0;
      words.forEach(function (word) {
        if (/^\s+$/.test(word)) {
          el.appendChild(document.createTextNode(word));
        } else {
          var span = document.createElement('span');
          span.className = 'text-reveal-word';
          span.style.transitionDelay = (delayIndex * stagger) + 's';
          span.textContent = word;
          el.appendChild(span);
          delayIndex++;
        }
      });
      el.classList.add('text-reveal');
    }

    textifyEls.forEach(wrapWords);

    var textRevealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('text-reveal-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.text-reveal').forEach(function (el) {
      textRevealObserver.observe(el);
    });
  })();

  // ----- Parallax for section backgrounds -----
  const parallaxSections = document.querySelectorAll('.section--parallax .section__bg');
  function parallax() {
    const scrolled = window.pageYOffset;
    parallaxSections.forEach(function (bg) {
      const section = bg.closest('.section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const windowCenter = window.innerHeight / 2;
      const diff = center - windowCenter;
      const rate = Math.min(1, Math.max(-1, diff / window.innerHeight));
      bg.style.transform = 'translateY(' + rate * 30 + 'px)';
    });
  }
  window.addEventListener('scroll', parallax, { passive: true });
  window.addEventListener('resize', parallax);

  // ----- Back to top -----
  const backToTop = document.getElementById('backToTop');
  const backToTopObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.boundingClientRect.top < 0) {
          backToTop.classList.add('visible');
        } else if (entry.boundingClientRect.top >= -100) {
          backToTop.classList.remove('visible');
        }
      });
    },
    { threshold: 0 }
  );
  const heroSection = document.getElementById('hero');
  if (heroSection) backToTopObserver.observe(heroSection);

  window.addEventListener('scroll', function () {
    if (window.scrollY > window.innerHeight * 0.6) backToTop.classList.add('visible');
    else if (window.scrollY < 200) backToTop.classList.remove('visible');
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----- Gallery lightbox -----
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const gallerySrcs = Array.from(galleryItems).map(function (item) {
    return item.querySelector('img').src;
  });
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = gallerySrcs[currentIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + gallerySrcs.length) % gallerySrcs.length;
    lightboxImg.src = gallerySrcs[currentIndex];
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % gallerySrcs.length;
    lightboxImg.src = gallerySrcs[currentIndex];
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // ----- Custom video player (supports multiple players) -----
  function initCustomPlayer(playerEl) {
    var video = playerEl.querySelector('video');
    var overlay = playerEl.querySelector('.custom-player__overlay');
    var controls = playerEl.querySelector('.custom-player__controls');
    if (!video || !overlay || !controls) return;

    var playBtn = overlay.querySelector('.custom-player__play');
    var playPauseBtn = controls.querySelector('.custom-player__btn--play');
    var progressWrap = controls.querySelector('.custom-player__progress');
    var progressBar = progressWrap && progressWrap.querySelector('.custom-player__progress-bar');
    var progressLoaded = progressWrap && progressWrap.querySelector('.custom-player__progress-loaded');
    var timeEls = controls.querySelectorAll('.custom-player__time');
    var currentTimeEl = timeEls[0];
    var durationEl = timeEls[2];
    var volumeBtn = controls.querySelector('.custom-player__btn--volume');
    var volumeRange = controls.querySelector('.custom-player__volume');
    var fullscreenBtn = controls.querySelector('.custom-player__btn--fullscreen');

    var controlsTimeout;
    function showControls() {
      controls.classList.add('visible');
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(function () {
        if (!video.paused) controls.classList.remove('visible');
      }, 3000);
    }

    playerEl.addEventListener('mousemove', showControls);
    playerEl.addEventListener('mouseleave', function () {
      if (!video.paused) controls.classList.remove('visible');
    });
    playerEl.addEventListener('touchstart', showControls);

    function formatTime(sec) {
      if (!isFinite(sec) || isNaN(sec)) return '0:00';
      var m = Math.floor(sec / 60);
      var s = Math.floor(sec % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function updateProgress() {
      if (video.duration && video.duration > 0) {
        var percent = (video.currentTime / video.duration) * 100;
        if (progressBar) progressBar.style.width = percent + '%';
        if (currentTimeEl) currentTimeEl.textContent = formatTime(video.currentTime);
      }
    }

    function updateLoaded() {
      if (video.buffered.length && video.duration > 0 && progressLoaded) {
        var percent = (video.buffered.end(0) / video.duration) * 100;
        progressLoaded.style.width = percent + '%';
      }
    }

    video.addEventListener('loadedmetadata', function () {
      if (durationEl) durationEl.textContent = formatTime(video.duration);
    });
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('progress', updateLoaded);

    function togglePlay() {
      if (video.paused) {
        video.play();
        overlay.classList.add('hidden');
        if (playPauseBtn) playPauseBtn.classList.add('playing');
      } else {
        video.pause();
        overlay.classList.remove('hidden');
        if (playPauseBtn) playPauseBtn.classList.remove('playing');
      }
    }

    if (playBtn) playBtn.addEventListener('click', function (e) { e.stopPropagation(); togglePlay(); });
    overlay.addEventListener('click', togglePlay);
    if (playPauseBtn) playPauseBtn.addEventListener('click', function (e) { e.stopPropagation(); togglePlay(); });
    video.addEventListener('click', function (e) { e.stopPropagation(); togglePlay(); });

    video.addEventListener('play', function () {
      overlay.classList.add('hidden');
      if (playPauseBtn) playPauseBtn.classList.add('playing');
    });
    video.addEventListener('pause', function () {
      overlay.classList.remove('hidden');
      if (playPauseBtn) playPauseBtn.classList.remove('playing');
    });

    if (progressWrap) {
      progressWrap.addEventListener('click', function (e) {
        var rect = progressWrap.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        video.currentTime = x * video.duration;
      });
    }

    if (volumeBtn && volumeRange) {
      function updateVolumeIcon() {
        if (video.volume === 0) volumeBtn.classList.add('muted');
        else volumeBtn.classList.remove('muted');
      }
      volumeRange.addEventListener('input', function () {
        video.volume = parseFloat(this.value);
        updateVolumeIcon();
      });
      volumeBtn.addEventListener('click', function () {
        if (video.volume > 0) {
          video.volume = 0;
          volumeRange.value = 0;
        } else {
          video.volume = 1;
          volumeRange.value = 1;
        }
        updateVolumeIcon();
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', function () {
        if (!document.fullscreenElement) {
          playerEl.requestFullscreen().catch(function () {});
        } else {
          document.exitFullscreen();
        }
      });
    }

    document.addEventListener('fullscreenchange', function () {
      if (document.fullscreenElement === playerEl) {
        playerEl.classList.add('fullscreen');
      } else {
        playerEl.classList.remove('fullscreen');
      }
    });
  }

  var players = document.querySelectorAll('.custom-player');
  for (var i = 0; i < players.length; i++) {
    initCustomPlayer(players[i]);
  }

  // ----- Strawberry Picking Game -----
  var strawberryGame = document.getElementById('strawberryGame');
  if (!strawberryGame) return;

  var gameStart = document.getElementById('gameStart');
  var gameEnd = document.getElementById('gameEnd');
  var gameStartBtn = document.getElementById('gameStartBtn');
  var gameAgainBtn = document.getElementById('gameAgainBtn');
  var gameHud = document.getElementById('gameHud');
  var gameArena = document.getElementById('gameArena');
  var gameBerries = document.getElementById('gameBerries');
  var gameParticles = document.getElementById('gameParticles');
  var gameFloatText = document.getElementById('gameFloatText');
  var gameTimerFill = document.getElementById('gameTimerFill');
  var gameTimerSec = document.getElementById('gameTimerSec');
  var gameScoreEl = document.getElementById('gameScore');
  var gameComboEl = document.getElementById('gameCombo');
  var gameBasketCount = document.getElementById('gameBasketCount');
  var gameFinalScore = document.getElementById('gameFinalScore');

  var GAME_DURATION = 30;
  var SPAWN_INTERVAL_MIN = 280;
  var SPAWN_INTERVAL_MAX = 550;
  var MAX_BERRIES = 15;
  var MAX_WEEDS = 6;
  var BERRY_LIFETIME = 4500;
  var WEED_LIFETIME = 4000;
  var GOLDEN_CHANCE = 0.12;
  var WEED_CHANCE = 0.22;
  var WEED_PENALTY = 2;
  var COMBO_TIMEOUT = 800;

  var gameState = {
    running: false,
    score: 0,
    berriesPicked: 0,
    timeLeft: GAME_DURATION,
    timerId: null,
    spawnId: null,
    combo: 0,
    comboTimeoutId: null,
    berryCount: 0,
    weedCount: 0,
    hasPlayed: false
  };

  function getArenaRect() {
    return gameArena.getBoundingClientRect();
  }

  function randomInRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function spawnBerry() {
    if (!gameState.running || gameState.berryCount >= MAX_BERRIES) return;
    var rect = getArenaRect();
    var padding = 50;
    var x = padding + Math.random() * (rect.width - padding * 2);
    var y = padding + Math.random() * (rect.height - padding * 2);
    var isGolden = Math.random() < GOLDEN_CHANCE;
    var points = isGolden ? 3 : 1;

    var berry = document.createElement('div');
    berry.className = 'berry' + (isGolden ? ' golden' : '');
    berry.innerHTML = '🍓';
    berry.dataset.points = points;
    berry.dataset.golden = isGolden ? '1' : '0';
    berry.dataset.type = 'berry';
    berry.style.left = x + 'px';
    berry.style.top = y + 'px';
    berry.style.marginLeft = '-28px';
    berry.style.marginTop = '-28px';

    berry.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!gameState.running || berry.classList.contains('picked')) return;
      if (berry.dataset.disappearId) clearTimeout(parseInt(berry.dataset.disappearId, 10));
      pickBerry(berry, x, y, points, isGolden);
    });

    gameBerries.appendChild(berry);
    gameState.berryCount++;

    var disappearId = setTimeout(function () {
      if (berry.parentNode && !berry.classList.contains('picked')) {
        berry.classList.add('picked');
        berry.dataset.disappearId = '';
        gameState.berryCount--;
        berry.style.animation = 'berryFadeOut 0.4s ease forwards';
        setTimeout(function () {
          if (berry.parentNode) berry.parentNode.removeChild(berry);
        }, 400);
      }
    }, BERRY_LIFETIME);
    berry.dataset.disappearId = String(disappearId);
  }

  function spawnWeed() {
    if (!gameState.running || gameState.weedCount >= MAX_WEEDS) return;
    var rect = getArenaRect();
    var padding = 50;
    var x = padding + Math.random() * (rect.width - padding * 2);
    var y = padding + Math.random() * (rect.height - padding * 2);

    var weed = document.createElement('div');
    weed.className = 'berry weed';
    weed.innerHTML = '🌿';
    weed.dataset.type = 'weed';
    weed.style.left = x + 'px';
    weed.style.top = y + 'px';
    weed.style.marginLeft = '-28px';
    weed.style.marginTop = '-28px';

    weed.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!gameState.running || weed.classList.contains('picked')) return;
      if (weed.dataset.disappearId) clearTimeout(parseInt(weed.dataset.disappearId, 10));
      pickWeed(weed, x, y);
    });

    gameBerries.appendChild(weed);
    gameState.weedCount++;

    var disappearId = setTimeout(function () {
      if (weed.parentNode && !weed.classList.contains('picked')) {
        weed.classList.add('picked');
        weed.dataset.disappearId = '';
        gameState.weedCount--;
        weed.style.animation = 'berryFadeOut 0.4s ease forwards';
        setTimeout(function () {
          if (weed.parentNode) weed.parentNode.removeChild(weed);
        }, 400);
      }
    }, WEED_LIFETIME);
    weed.dataset.disappearId = String(disappearId);
  }

  function pickBerry(berry, x, y, points, isGolden) {
    berry.classList.add('picked');
    gameState.berryCount--;

    gameState.combo++;
    if (gameState.comboTimeoutId) clearTimeout(gameState.comboTimeoutId);
    gameState.comboTimeoutId = setTimeout(function () {
      gameState.combo = 0;
      gameComboEl.textContent = '';
    }, COMBO_TIMEOUT);

    var comboBonus = gameState.combo >= 3 ? Math.min(gameState.combo, 5) : 1;
    var add = points * comboBonus;
    gameState.score += add;
    gameState.berriesPicked++;

    gameScoreEl.textContent = gameState.score;
    gameBasketCount.textContent = gameState.berriesPicked;
    gameTimerFill.style.transform = 'scaleX(' + (gameState.timeLeft / GAME_DURATION) + ')';

    if (gameState.combo >= 2) {
      gameComboEl.textContent = 'x' + gameState.combo + '!';
    }

    showFloatingPoint(x, y, (points * comboBonus), isGolden || comboBonus > 1);
    createParticles(x, y, isGolden);
    setTimeout(function () {
      if (berry.parentNode) berry.parentNode.removeChild(berry);
    }, 350);
  }

  function pickWeed(weed, x, y) {
    weed.classList.add('picked');
    gameState.weedCount--;

    gameState.combo = 0;
    if (gameState.comboTimeoutId) clearTimeout(gameState.comboTimeoutId);
    gameComboEl.textContent = '';

    var penalty = WEED_PENALTY;
    gameState.score = Math.max(0, gameState.score - penalty);

    gameScoreEl.textContent = gameState.score;
    gameTimerFill.style.transform = 'scaleX(' + (gameState.timeLeft / GAME_DURATION) + ')';

    showFloatingPoint(x, y, -penalty, false, true);
    createParticles(x, y, false, true);
    setTimeout(function () {
      if (weed.parentNode) weed.parentNode.removeChild(weed);
    }, 350);
  }

  function showFloatingPoint(x, y, points, golden, negative) {
    var el = document.createElement('span');
    el.className = 'float-point' + (golden ? ' golden' : '') + (negative ? ' negative' : '');
    el.textContent = (negative ? '' : '+') + points;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.transform = 'translate(-50%, -50%)';
    gameFloatText.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 800);
  }

  function createParticles(x, y, golden, isWeed) {
    var colors = isWeed ? ['#5a7d4a', '#6b8e5a', '#4a6b3a'] : (golden ? ['#ffd700', '#ffec8b', '#ffa500'] : ['#c41e3a', '#e85a6f', '#ff8a9a']);
    for (var i = 0; i < 8; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var angle = (Math.PI * 2 * i) / 8 + Math.random();
      var dist = 30 + Math.random() * 40;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      gameParticles.appendChild(p);
      setTimeout(function (part) {
        if (part.parentNode) part.parentNode.removeChild(part);
      }, 500, p);
    }
  }

  function gameTick() {
    if (!gameState.running) return;
    gameState.timeLeft -= 1;
    gameTimerSec.textContent = gameState.timeLeft;
    gameTimerFill.style.transform = 'scaleX(' + (gameState.timeLeft / GAME_DURATION) + ')';
    if (gameState.timeLeft <= 0) {
      endGame();
    }
  }

  function startGame() {
    gameState.running = true;
    gameState.score = 0;
    gameState.berriesPicked = 0;
    gameState.timeLeft = GAME_DURATION;
    gameState.combo = 0;
    gameState.berryCount = 0;
    gameState.weedCount = 0;
    gameComboEl.textContent = '';
    gameScoreEl.textContent = '0';
    gameBasketCount.textContent = '0';
    gameTimerSec.textContent = GAME_DURATION;
    gameTimerFill.style.transform = 'scaleX(1)';

    gameStart.classList.add('hidden');
    gameEnd.classList.add('hidden');
    gameHud.classList.remove('hidden');

    while (gameBerries.firstChild) gameBerries.removeChild(gameBerries.firstChild);
    while (gameFloatText.firstChild) gameFloatText.removeChild(gameFloatText.firstChild);

    gameState.timerId = setInterval(gameTick, 1000);
    function scheduleSpawn() {
      if (!gameState.running) return;
      if (Math.random() < WEED_CHANCE) {
        spawnWeed();
      } else {
        spawnBerry();
      }
      var delay = SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);
      gameState.spawnId = setTimeout(scheduleSpawn, delay);
    }
    scheduleSpawn();
  }

  function endGame() {
    gameState.running = false;
    gameState.hasPlayed = true;
    if (gameState.timerId) clearInterval(gameState.timerId);
    if (gameState.spawnId) clearTimeout(gameState.spawnId);
    if (gameState.comboTimeoutId) clearTimeout(gameState.comboTimeoutId);
    var items = gameBerries.querySelectorAll('.berry');
    for (var i = 0; i < items.length; i++) {
      if (items[i].dataset.disappearId) clearTimeout(parseInt(items[i].dataset.disappearId, 10));
    }
    gameTimerFill.style.transform = 'scaleX(0)';
    gameFinalScore.textContent = gameState.berriesPicked;
    gameEnd.classList.remove('hidden');
  }

  gameStartBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    startGame();
  });

  gameEnd.addEventListener('click', function (e) {
    var btn = e.target.closest('#gameAgainBtn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      startGame();
    }
  });

  gameAgainBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    startGame();
  });
})();
