// ---------- Сторис дней: полноэкранный просмотрщик ----------
const Stories = (() => {
  const root = document.getElementById('sv');
  const stage = document.getElementById('svStage');
  const backdrop = root.querySelector('.sv-backdrop');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PALETTE = {
    intro: ['var(--primary)', '#0b3954'],
    video: ['#1fb5b9', '#0f3d4c'],
    text: ['#8b3fd9', '#35106b'],
    task: ['#16a34a', '#0a4026'],
    test: ['#f08a18', '#8a2c0b'],
    zoom: ['#2563eb', '#172a6b'],
    final: ['#0f4c5c', 'var(--primary)'],
  };
  const DESC = {
    video: 'Посмотрите видеолекцию тренера: живые примеры и практика, которую можно применить уже завтра.',
    text: 'Изучите ключевые подходы, определения и мнения экспертов. Всё самое важное — коротко.',
    task: 'Разработайте своё задание с элементами формативного оценивания и загрузите файл на проверку.',
    test: '10 вопросов по теме дня. Наберите от 70%, чтобы засчитать шаг.',
    zoom: 'Живая встреча с тренером: разберём ваши вопросы и практические кейсы.',
  };
  const DUR = { intro: 4500, step: 5000, final: 7000 };
  const SLIDES = TEMPLATE.length + 2; // интро + шаги + итог
  const X = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  let dayN, slide, card, fill, paused = false, busy = false, closing = false, lastFocus;

  // ----- Разметка -----
  const blobs = '<div class="sv-blobs"><i></i><i></i><i></i></div>';
  const total = () => TEMPLATE.reduce((s, e) => s + e.min, 0);

  function subtitle(d) {
    const mod = `Модуль ${moduleOf(d.n).n} · `;
    if (d.locked) return `${mod}Откроется после дня ${d.n - 1}`;
    if (dayComplete(d)) return `${mod}Выполнено`;
    return mod + (d.n === CURRENT_DAY ? 'Сегодня · ' : '') + fmtMin(total());
  }

  function cardEl(d) {
    const el = document.createElement('div');
    el.className = 'sv-card';
    el.innerHTML = `
      <div class="sv-bars">${'<i><b></b></i>'.repeat(SLIDES)}</div>
      <div class="sv-top">
        <span class="sv-ava">${d.n}</span>
        <div class="sv-who"><b>День ${d.n} · ${d.title}</b><small>${subtitle(d)}</small></div>
        <button class="sv-btn" data-sv="pause" aria-label="Пауза">${I.pause}</button>
        <button class="sv-btn" data-sv="close" aria-label="Закрыть">${X}</button>
      </div>
      <div class="sv-slides"></div>`;
    return el;
  }

  function slideHtml(d, k) {
    const today = d.n === CURRENT_DAY;
    const firstUndone = d.done.findIndex((x) => !x);

    if (k === 0) {
      const [c1, c2] = PALETTE.intro;
      const chip = d.locked ? 'Скоро откроется' : dayComplete(d) ? 'Пройден' : today ? 'Сегодня' : `День ${d.n} из ${days.length}`;
      return `
        <div class="sv-slide s-intro" style="--c1:${c1};--c2:${c2}">
          ${blobs}
          <div class="sv-content">
            <span class="a sv-chip">${chip}</span>
            <span class="a sv-mod">Модуль ${moduleOf(d.n).n} · ${moduleOf(d.n).title}</span>
            <div class="a sv-bignum">${String(d.n).padStart(2, '0')}</div>
            <h2 class="a">${d.title}</h2>
            <p class="a">${today ? 'Сегодня' : 'В этот день'} вас ждёт ${TEMPLATE.length} шагов · ${fmtMin(total())}</p>
            <div class="a sv-icons">${TEMPLATE.map((e, j) =>
              `<span style="--j:${j}" class="${d.done[j] ? 'ok' : ''}">${d.done[j] ? I.check : ICONS[e.type]}</span>`).join('')}</div>
          </div>
          <div class="a sv-hint">Нажмите справа, чтобы продолжить ${ARROW}</div>
        </div>`;
    }

    if (k <= TEMPLATE.length) {
      const j = k - 1;
      const e = TEMPLATE[j];
      const [c1, c2] = PALETTE[e.type];
      const status = d.done[j]
        ? `<span class="a sv-status ok">${I.check}${e.type === 'video' ? 'Просмотрено' : 'Выполнено'}</span>`
        : d.locked ? '<span class="a sv-status">Откроется позже</span>'
        : j === firstUndone ? '<span class="a sv-status next">Ваш следующий шаг</span>'
        : '<span class="a sv-status">Впереди</span>';
      const desc = e.type === 'zoom'
        ? `${DESC.zoom} ${14 + d.n} сентября, 15:00 (Астана).`
        : DESC[e.type];
      return `
        <div class="sv-slide s-step" style="--c1:${c1};--c2:${c2}">
          ${blobs}
          <div class="sv-content">
            <span class="a sv-chip">Шаг ${k} из ${TEMPLATE.length} · ${e.min} минут</span>
            <div class="a sv-orb"><span class="orb-ring"></span><span class="orb-ring r2"></span><span class="orb-ic">${ICONS[e.type]}</span></div>
            <h2 class="a">${e.name}</h2>
            <p class="a">${desc}</p>
            ${status}
          </div>
        </div>`;
    }

    const [c1, c2] = PALETTE.final;
    const complete = dayComplete(d);
    const title = complete ? 'День выполнен!' : d.locked ? 'Скоро откроется' : today ? 'Готовы начать?' : 'План дня';
    const cta = d.locked ? 'Понятно'
      : complete ? 'Повторить материал'
      : d.done.some(Boolean) ? 'Продолжить день' : 'Начать день';
    return `
      <div class="sv-slide s-final" style="--c1:${c1};--c2:${c2}">
        ${blobs}
        <div class="sv-content">
          <span class="a sv-chip">${complete ? 'Отличная работа' : 'Что вы сделаете'}</span>
          <h2 class="a">${title}</h2>
          <ul class="sv-plan">${TEMPLATE.map((e, j) => `
            <li class="a ${d.done[j] ? 'ok' : ''}">
              <span class="sv-check">${d.done[j] ? I.check : ''}</span>
              <span>${e.name}</span><small>${e.min} мин</small>
            </li>`).join('')}</ul>
          <button class="a sv-cta" data-sv="go">${cta} ${d.locked ? '' : ARROW}</button>
        </div>
      </div>`;
  }

  // Колбэк по окончании анимации; таймер подстраховывает, если onfinish не придёт
  function whenDone(anim, fn) {
    let ran = false;
    const run = () => { if (!ran) { ran = true; fn(); } };
    anim.onfinish = run;
    setTimeout(run, anim.effect.getTiming().duration + 100);
  }

  // ----- Слайды -----
  function show(k, dir = 1) {
    slide = k;
    const d = days[dayN - 1];
    const host = card.querySelector('.sv-slides');
    host.querySelectorAll('.out').forEach((x) => x.remove());
    const old = host.firstElementChild;
    host.insertAdjacentHTML('beforeend', slideHtml(d, k));
    const el = host.lastElementChild;
    el.querySelectorAll('.a').forEach((a, i) => a.style.setProperty('--i', i));

    if (old && !reduce) {
      old.classList.add('out');
      old.animate([
        { opacity: 1, transform: 'none', filter: 'blur(0)' },
        { opacity: 0, transform: `scale(1.08) translateX(${-dir * 30}px)`, filter: 'blur(12px)' },
      ], { duration: 450, easing: 'ease', fill: 'forwards' }).onfinish = () => old.remove();
      el.animate([
        { opacity: 0, transform: `scale(.94) translateX(${dir * 40}px)` },
        { opacity: 1, transform: 'none' },
      ], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
    } else old?.remove();

    if (k === SLIDES - 1) {
      if (!d.seen) { d.seen = true; renderDays(); }
      if (dayComplete(d)) setTimeout(() => burstFrom(card, .35), 350);
    }
    startFill();
  }

  function startFill() {
    fill?.cancel();
    const bars = card.querySelectorAll('.sv-bars b');
    bars.forEach((b, i) => { b.style.transform = `scaleX(${i < slide ? 1 : 0})`; });
    const dur = slide === 0 ? DUR.intro : slide === SLIDES - 1 ? DUR.final : DUR.step;
    fill = bars[slide].animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: dur, fill: 'forwards' });
    fill.onfinish = next;
    if (paused || busy) fill.pause();
  }

  function next() {
    if (slide < SLIDES - 1) show(slide + 1, 1);
    else nextDay();
  }
  function prev() {
    if (slide > 0) show(slide - 1, -1);
    else if (dayN > 1) switchDay(dayN - 1, -1);
    else show(0, -1);
  }
  function nextDay() { dayN < days.length ? switchDay(dayN + 1, 1) : close(); }
  function prevDay() { if (dayN > 1) switchDay(dayN - 1, -1); else bounce(); }

  // 3D-куб между днями
  function switchDay(n, dir) {
    if (busy) return;
    busy = true;
    fill?.cancel();
    const oldCard = card;
    dayN = n;
    card = cardEl(days[n - 1]);
    stage.appendChild(card);
    show(0);
    syncPauseBtn();
    if (reduce) { oldCard.remove(); busy = false; if (!paused) fill.play(); return; }

    const D = 700, ease = 'cubic-bezier(.65,0,.35,1)';
    oldCard.style.transformOrigin = dir > 0 ? '100% 50%' : '0% 50%';
    card.style.transformOrigin = dir > 0 ? '0% 50%' : '100% 50%';
    oldCard.animate([
      { transform: 'translateX(0) rotateY(0)', filter: 'brightness(1)' },
      { transform: `translateX(${-dir * 100}%) rotateY(${-dir * 90}deg)`, filter: 'brightness(.35)' },
    ], { duration: D, easing: ease, fill: 'forwards' });
    const newCard = card;
    whenDone(card.animate([
      { transform: `translateX(${dir * 100}%) rotateY(${dir * 90}deg)`, filter: 'brightness(.35)' },
      { transform: 'translateX(0) rotateY(0)', filter: 'brightness(1)' },
    ], { duration: D, easing: ease }), () => {
      oldCard.remove();
      newCard.style.transformOrigin = '';
      if (card !== newCard || root.hidden) return; // просмотрщик уже закрыт или сменился день
      busy = false;
      if (!paused) fill.play();
    });
  }

  function bounce() {
    if (reduce) return;
    card.animate([{ transform: 'none' }, { transform: 'translateX(18px)' }, { transform: 'none' }],
      { duration: 320, easing: 'cubic-bezier(.3,1.6,.5,1)' });
  }

  function setPaused(v) {
    paused = v;
    if (fill && !busy) v ? fill.pause() : fill.play();
    card.classList.toggle('paused', v);
    syncPauseBtn();
  }
  function syncPauseBtn() {
    const b = card.querySelector('[data-sv="pause"]');
    b.innerHTML = paused ? I.play : I.pause;
    b.setAttribute('aria-label', paused ? 'Продолжить' : 'Пауза');
    card.classList.toggle('paused', paused);
  }

  // ----- Открытие / закрытие (из кружка и обратно) -----
  function circleMorph(rect) {
    const r = stage.getBoundingClientRect();
    return [
      {
        transform: `translate(${rect.left + rect.width / 2 - (r.left + r.width / 2)}px, ${rect.top + rect.height / 2 - (r.top + r.height / 2)}px) scale(${rect.width / r.width})`,
        clipPath: `circle(${r.width / 2}px at 50% 50%)`,
      },
      { transform: 'none', clipPath: `circle(${Math.hypot(r.width, r.height) / 2}px at 50% 50%)` },
    ];
  }

  function open(n, rect) {
    if (!root.hidden) return;
    dayN = n;
    paused = false;
    busy = false;
    lastFocus = document.activeElement;
    stage.innerHTML = '';
    card = cardEl(days[n - 1]);
    stage.appendChild(card);
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    show(0);
    if (!reduce && rect) {
      busy = true;
      fill.pause();
      backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
      whenDone(stage.animate(circleMorph(rect), { duration: 620, easing: 'cubic-bezier(.2,.9,.25,1)' }), () => {
        if (root.hidden || closing) return;
        busy = false;
        if (!paused) fill.play();
      });
    }
    card.querySelector('[data-sv="close"]').focus({ preventScroll: true });
  }

  function close(after) {
    if (root.hidden || closing) return;
    closing = true;
    fill?.pause();
    const ring = document.querySelector(`.story-item[data-day="${dayN}"] .story-ring`);
    const rect = ring?.getBoundingClientRect();
    const visible = rect && rect.bottom > 0 && rect.top < innerHeight;
    const done = () => {
      root.hidden = true;
      fill?.cancel();
      stage.getAnimations().forEach((a) => a.cancel());
      stage.style.transform = '';
      stage.innerHTML = '';
      root.style.removeProperty('--bd');
      document.body.style.overflow = '';
      closing = false;
      lastFocus?.focus({ preventScroll: true });
      after?.();
    };
    if (reduce) return done();

    const from = stage.style.transform || 'none';
    stage.style.transform = '';
    backdrop.animate([{ opacity: getComputedStyle(backdrop).opacity }, { opacity: 0 }], { duration: 380, fill: 'forwards' });
    const frames = visible
      ? circleMorph(rect).reverse()
      : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.85)' }];
    frames[0].transform = from;
    whenDone(stage.animate(frames, { duration: 480, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' }), () => {
      backdrop.getAnimations().forEach((a) => a.cancel());
      done();
    });
  }

  // ----- Конфетти -----
  function confetti(x, y, n = 80) {
    if (reduce) return;
    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    document.body.appendChild(layer);
    const colors = ['#18999D', '#5eead4', '#f5b041', '#f97316', '#8b3fd9', '#22c55e', '#ffffff', '#ef4444'];
    let left = n;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.style.cssText = `left:${x}px;top:${y}px;background:${colors[i % colors.length]};` +
        (i % 3 === 0 ? 'border-radius:50%;width:8px;height:8px;' : '');
      layer.appendChild(p);
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
      const v = 160 + Math.random() * 320;
      const dx = Math.cos(a) * v, dy = Math.sin(a) * v;
      const rot = (Math.random() - 0.5) * 1080;
      p.animate([
        { transform: 'translate(-50%,-50%) rotate(0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) rotate(${rot / 2}deg) scale(1)`, opacity: 1, offset: 0.45 },
        { transform: `translate(${dx * 1.25}px,${dy + 380}px) rotate(${rot}deg) scale(.6)`, opacity: 0 },
      ], { duration: 1500 + Math.random() * 900, easing: 'cubic-bezier(.15,.7,.4,1)' }).onfinish = () => {
        p.remove();
        if (--left === 0) layer.remove();
      };
    }
  }
  function burstFrom(el, yFrac = 0.5) {
    const r = el.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height * yFrac);
  }

  // ----- События -----
  stage.addEventListener('click', (e) => {
    const act = e.target.closest('[data-sv]')?.dataset.sv;
    if (act === 'close') close();
    if (act === 'pause') setPaused(!paused);
    if (act === 'go') {
      const d = days[dayN - 1];
      if (d.locked) return close();
      if (!dayComplete(d)) burstFrom(e.target.closest('button'));
      selected = d.n;
      const firstUndone = d.done.findIndex((x) => !x);
      if (firstUndone !== -1) d.open.add(firstUndone);
      render();
      setTimeout(() => close(() => {
        const target = firstUndone !== -1 ? document.getElementById('el-' + firstUndone) : document.querySelector('.day-card');
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }), dayComplete(d) ? 0 : 450);
    }
  });

  // тап — листать, удержание — пауза, свайп вбок — другой день, свайп вниз — закрыть
  let down = null, holdT = null, held = false;
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || busy || closing) return;
    down = { x: e.clientX, y: e.clientY };
    held = false;
    holdT = setTimeout(() => { held = true; setPaused(true); card.classList.add('holding'); }, 220);
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) clearTimeout(holdT);
    if (dy > 0 && dy > Math.abs(dx)) {
      stage.style.transform = `translateY(${dy}px) scale(${1 - Math.min(dy, 400) / 1600})`;
      root.style.setProperty('--bd', 1 - Math.min(dy / 400, 0.7));
    }
  });
  function release(e, cancelled) {
    if (!down) return;
    clearTimeout(holdT);
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    down = null;
    if (held) { held = false; card.classList.remove('holding'); setPaused(false); }
    if (!cancelled && dy > 120 && dy > Math.abs(dx)) return close();
    if (stage.style.transform) {
      const from = stage.style.transform;
      stage.style.transform = '';
      root.style.removeProperty('--bd');
      stage.animate([{ transform: from }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    }
    if (cancelled) return;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) return dx < 0 ? nextDay() : prevDay();
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && !e.wasHeld) {
      const r = stage.getBoundingClientRect();
      (e.clientX - r.left) < r.width * 0.3 ? prev() : next();
    }
  }
  stage.addEventListener('pointerup', (e) => {
    if (held) { e.wasHeld = true; }
    release(e, false);
  });
  stage.addEventListener('pointercancel', (e) => release(e, true));

  root.querySelector('.sv-prev').addEventListener('click', prevDay);
  root.querySelector('.sv-next').addEventListener('click', nextDay);
  backdrop.addEventListener('click', () => close());

  document.addEventListener('keydown', (e) => {
    if (root.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowDown') nextDay();
    else if (e.key === 'ArrowUp') prevDay();
    else if (e.key === ' ' && !e.target.closest('button')) { e.preventDefault(); setPaused(!paused); }
  });
  document.addEventListener('visibilitychange', () => {
    if (!root.hidden && document.hidden) setPaused(true);
  });

  return { open, confetti };
})();
