/*
=============================================================================
  TEXTBOOK SHELL — Shared JavaScript
  All chapter pages link to this file. Load at end of <body>.
=============================================================================
*/

/* ── NAV PANEL ── */
function toggleNav() {
  document.getElementById('navPanel').classList.toggle('open');
  document.getElementById('navOverlay').classList.toggle('open');
}
function closeNav() {
  document.getElementById('navPanel').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('open');
}

/* ── POP-UPS (key terms & citations) ── */
function togglePopup(el) {
  const popup = el.querySelector(':scope > .popup-box');
  document.querySelectorAll('.popup-box.active').forEach(p => {
    if (p !== popup) p.classList.remove('active');
  });
  popup.classList.toggle('active');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.key-term') && !e.target.closest('.citation'))
    document.querySelectorAll('.popup-box.active').forEach(p => p.classList.remove('active'));
});

/* ── SENSITIVE / EXPLICIT MEDIA (blurred image, click to reveal / re-blur) ── */
function toggleSensitive(btn) {
  const wrap = btn.closest('.sensitive-media');
  if (!wrap) return;
  const revealed = wrap.classList.toggle('revealed');
  const reveal = wrap.querySelector('.sensitive-reveal');
  if (reveal) reveal.setAttribute('aria-pressed', revealed ? 'true' : 'false');
}

/* ── QUESTION STATE ── */
const qState = {};

/* ── MCQ / TRUE-FALSE ── */
function selectMCQ(el, qId) {
  if (qState[qId]?.locked) return;
  document.querySelectorAll(`#${qId} .answer-option`).forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  if (!qState[qId]) qState[qId] = { attempts: 0 };
  qState[qId].selected = el.querySelector('.answer-letter').textContent.trim();
}

function submitMCQ(qId, correct, explanation) {
  const state = qState[qId];
  if (!state || !state.selected) { alert('Please select an answer.'); return; }
  if (state.locked) return;
  const opts = document.querySelectorAll(`#${qId} .answer-option`);
  const letters = ['A','B','C','D','E'];
  if (state.selected === correct) {
    opts.forEach((o,i) => { if (letters[i] === correct) o.classList.add('correct'); });
    showExp(qId, '✓ Correct! ' + explanation, true);
  } else {
    opts.forEach((o,i) => {
      if (letters[i] === state.selected) o.classList.add('incorrect');
      if (letters[i] === correct) o.classList.add('correct');
    });
    showExp(qId, '✗ Incorrect. ' + explanation, false);
  }
  state.locked = true;
}

/* ── MATCHING ── */
function clearMatchFeedback(qId) {
  document.querySelectorAll(`#${qId} .match-select`).forEach(s => s.classList.remove('correct','incorrect'));
  const exp = document.getElementById(qId + '-exp');
  if (exp) exp.classList.remove('show');
}

function submitMatch(qId, explanation) {
  const selects = document.querySelectorAll(`#${qId} .match-select`);
  let allCorrect = true;
  selects.forEach(s => {
    if (s.value === s.dataset.correct) s.classList.add('correct');
    else { s.classList.add('incorrect'); allCorrect = false; }
  });
  showExp(qId, (allCorrect ? '✓ All correct! ' : '✗ Some answers are incorrect. ') + explanation, allCorrect);
  if (allCorrect) selects.forEach(s => s.disabled = true);
}

/* ── SORTING (drag-and-drop) ── */
let dragSrc = null;
document.addEventListener('dragstart', e => {
  if (e.target.classList.contains('sort-item')) {
    dragSrc = e.target;
    e.target.style.opacity = '0.4';
  }
});
document.addEventListener('dragend', e => {
  if (e.target.classList.contains('sort-item')) e.target.style.opacity = '';
});
document.addEventListener('dragover', e => {
  const item = e.target.closest('.sort-item');
  if (item && item !== dragSrc) {
    e.preventDefault();
    const list = item.parentElement;
    const items = [...list.children];
    const srcIdx = items.indexOf(dragSrc);
    const tgtIdx = items.indexOf(item);
    if (srcIdx < tgtIdx) list.insertBefore(dragSrc, item.nextSibling);
    else list.insertBefore(dragSrc, item);
  }
});

function submitSort(qId, explanation) {
  const items = document.querySelectorAll(`#${qId} .sort-item`);
  const orders = [...items].map(i => parseInt(i.dataset.order));
  let correct = true;
  for (let i = 0; i < orders.length - 1; i++) {
    if (orders[i] > orders[i + 1]) { correct = false; break; }
  }
  items.forEach((item, i) => {
    if (orders[i] === i + 1) item.classList.add('correct');
    else item.classList.add('incorrect');
  });
  showExp(qId, (correct ? '✓ Correct order! ' : '✗ Not quite. ') + explanation, correct);
  if (correct) items.forEach(i => i.setAttribute('draggable', 'false'));
}

/* ── FILL-IN-THE-BLANK ── */
function submitFITB(qId, correct, alternatesStr, explanation = '') {
  const input = document.getElementById(qId + '-input');
  const val = input.value.trim().toLowerCase();
  const accepted = [correct.toLowerCase(), ...alternatesStr.split(',').map(s => s.trim().toLowerCase())];
  const isCorrect = accepted.includes(val);
  input.classList.add(isCorrect ? 'correct' : 'incorrect');
  input.disabled = true;
  if (!isCorrect) input.value = correct.charAt(0).toUpperCase() + correct.slice(1);
  showExp(qId, (isCorrect ? '✓ Correct! ' : `✗ The correct answer is "${correct}". `) + explanation, isCorrect);
}

/* ── CLICK-ON-TARGET ── */
function handleCOTClick(e, qId) {
  if (qState[qId]?.locked) return;
  const wrap = document.getElementById(qId + '-wrap');
  const circle = document.getElementById(qId + '-circle');
  const btn = document.getElementById(qId + '-btn');
  const rect = wrap.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  circle.style.left = x + 'px';
  circle.style.top = y + 'px';
  circle.style.display = 'block';
  if (!qState[qId]) qState[qId] = {};
  qState[qId].x = x;
  qState[qId].y = y;
  btn.disabled = false;
}

function submitCOT(qId, explanation) {
  const state = qState[qId];
  if (!state || state.x === undefined) return;
  if (state.locked) return;
  const wrap = document.getElementById(qId + '-wrap');
  const img = wrap.querySelector('img');
  const tx = parseFloat(wrap.dataset.targetX) / 100 * img.offsetWidth;
  const ty = parseFloat(wrap.dataset.targetY) / 100 * img.offsetHeight;
  const tr = parseFloat(wrap.dataset.targetR);
  const dist = Math.sqrt((state.x - tx) ** 2 + (state.y - ty) ** 2);
  const isCorrect = dist <= tr;
  const circle = document.getElementById(qId + '-circle');
  circle.style.border = `3px solid ${isCorrect ? '#16A34A' : '#6D28D9'}`;
  circle.style.background = isCorrect ? 'rgba(22,163,74,0.2)' : 'rgba(109,40,217,0.2)';
  showExp(qId, (isCorrect ? '✓ Correct! ' : '✗ Not quite. ') + explanation, isCorrect);
  state.locked = true;
  document.getElementById(qId + '-btn').disabled = true;
}

/* ── SHARED FEEDBACK DISPLAY ── */
function showExp(qId, text, wasCorrect) {
  const box = document.getElementById(qId + '-exp');
  box.textContent = text;
  box.classList.add('show');
  box.style.background = wasCorrect ? '#F0FDF4' : '#FFFBEB';
  box.style.borderColor = wasCorrect ? '#86EFAC' : '#FCD34D';
  box.style.color = wasCorrect ? '#166534' : '#78350F';
}

/* ── SCROLL-TRACKING TOC ── */
const _sections = document.querySelectorAll('section[id]');
const _tocLinks = document.querySelectorAll('#tocList a');
window.addEventListener('scroll', () => {
  let current = '';
  _sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  _tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}, { passive: true });

/* ── PRINT / PDF ── */
function downloadPDF() { window.print(); }

/* ── YOUTUBE LAZY-LOAD FACADE ── */
(function () {
  function initFacades() {
    document.querySelectorAll('.video-wrapper iframe[src*="youtube"]').forEach(function (iframe) {
      var match = iframe.src.match(/embed\/([^?&"]+)/);
      if (!match) return;
      var ytId = match[1];
      var realSrc = iframe.src;
      var title = iframe.getAttribute('title') || 'Video';

      // Prevent the iframe from loading until the user clicks play
      iframe.src = '';

      var facade = document.createElement('div');
      facade.className = 'yt-facade';
      facade.style.backgroundImage =
        'url(https://img.youtube.com/vi/' + ytId + '/maxresdefault.jpg)';
      facade.setAttribute('role', 'button');
      facade.setAttribute('tabindex', '0');
      facade.setAttribute('aria-label', 'Play video: ' + title);
      facade.innerHTML = '<div class="yt-play-btn" aria-hidden="true"></div>';

      function loadEmbed() {
        iframe.src = realSrc;
        facade.remove();
      }
      facade.addEventListener('click', loadEmbed);
      facade.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadEmbed(); }
      });

      iframe.parentElement.appendChild(facade);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFacades);
  } else {
    initFacades();
  }
})();

/* ── FIGURE LIGHTBOX ── */
(function () {
  // Open lightbox: show img at full natural resolution, capped by viewport
  function openLightbox(imgSrc, captionHTML, opts) {
    if (document.getElementById('lbOverlay')) return; // already open
    opts = opts || {};
    const titleText = opts.title || 'Image';

    const overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.id = 'lbOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', titleText);

    const downloadBtn = opts.download
      ? '<a class="lb-download" href="' + imgSrc + '" download="' + opts.download + '">&#8595; Download</a>'
      : '';

    overlay.innerHTML =
      '<div class="lb-modal">' +
        '<div class="lb-header">' +
          '<span class="lb-title">' + titleText + '</span>' +
          '<div class="lb-header-actions">' +
            downloadBtn +
            '<button class="lb-close" aria-label="Close">&times;</button>' +
          '</div>' +
        '</div>' +
        '<div class="lb-body">' +
          '<img src="' + imgSrc + '" alt="' + titleText + '">' +
          (captionHTML ? '<p class="lb-caption">' + captionHTML + '</p>' : '') +
        '</div>' +
      '</div>';

    // Close on background click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });
    // Close button
    overlay.querySelector('.lb-close').addEventListener('click', closeLightbox);

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', escHandler);

    // Shift focus into modal for accessibility
    overlay.querySelector('.lb-close').focus();
  }

  function closeLightbox() {
    const overlay = document.getElementById('lbOverlay');
    if (!overlay) return;
    overlay.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escHandler);
  }

  function escHandler(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  // Inject enlarge button into every .textbook-figure that contains an <img>
  function attachEnlargeButtons() {
    document.querySelectorAll('.textbook-figure').forEach(function (figure) {
      const img = figure.querySelector('img');
      if (!img || figure.querySelector('.fig-enlarge-btn')) return; // already attached

      const caption = figure.querySelector('figcaption');
      const captionHTML = caption ? caption.innerHTML : '';

      const btn = document.createElement('button');
      btn.className = 'fig-enlarge-btn';
      btn.setAttribute('aria-label', 'Enlarge image');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openLightbox(img.src, captionHTML);
      });
      figure.appendChild(btn);
    });
  }

  // Global opener for standalone image "guides": a full-screen viewer with a
  // download button, over a dimmed backdrop. Call from markup, e.g.:
  //   openImageGuide('img/SET.png', 'A Visual Guide to SET', 'SET.png')
  window.openImageGuide = function (src, title, downloadName) {
    openLightbox(src, '', { title: title || 'Guide', download: downloadName || '' });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachEnlargeButtons);
  } else {
    attachEnlargeButtons(); // DOM already ready
  }
})();
