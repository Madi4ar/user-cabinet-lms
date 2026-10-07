// ---------- Данные ----------
const TITLES = [
  'Введение в формативное оценивание',
  'Цели обучения и критерии успеха',
  'Обратная связь, которая работает',
  'Инструменты формативного оценивания',
  'Взаимо- и самооценивание',
  'Вопросы высокого порядка',
  'Дифференциация на основе данных',
  'Цифровые инструменты оценивания',
  'Портфолио и рефлексия',
  'Итоговый проект',
];

const ICONS = {
  video: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/></svg>',
  text: '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  task: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 12l2 2 4-4"/></svg>',
  test: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 9h6M9 13h6M9 17h3"/></svg>',
  zoom: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/></svg>',
};
const I = {
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
  vol: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
  full: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  dots: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>',
  playCircle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff" stroke="none"/><path d="M10 8l6 4-6 4z" fill="currentColor" stroke="none" style="color:var(--primary)"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  ext: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  chevDown: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z"/></svg>',
  comment: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4z"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-2-6z"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
};

const TEMPLATE = [
  { type: 'video', name: 'Видеолекция', min: 15, color: 'blue' },
  { type: 'text', name: 'Теоретический материал', min: 20, color: 'purple' },
  { type: 'task', name: 'Практическое задание', min: 30, color: 'green' },
  { type: 'test', name: 'Тест', min: 15, color: 'orange' },
  { type: 'zoom', name: 'Онлайн-встреча (Zoom)', min: 10, color: 'blue' },
];

// Лента: автор «поста» и стартовые комментарии
const AUTHORS = {
  video: 'Айгерим Садыкова, тренер',
  text: 'Айгерим Садыкова, тренер',
  task: 'Куратор курса',
  test: 'Куратор курса',
  zoom: 'Айгерим Садыкова, тренер',
};
const SEED_COMMENTS = [
  [{ name: 'Динара К.', text: 'Очень полезный пример с «билетом на выход», попробую завтра на уроке!', time: '2 ч назад' },
   { name: 'Марат Б.', text: 'А можно получить слайды из видео?', time: '1 ч назад' }],
  [{ name: 'Салтанат Ж.', text: 'Цитата Шляйхера — в самую точку.', time: '3 ч назад' }],
  [{ name: 'Асель Т.', text: 'Можно сдавать задание для начальной школы?', time: '5 ч назад' },
   { name: 'Куратор курса', text: 'Да, подойдёт любой предмет и любая возрастная группа.', time: '4 ч назад', staff: true }],
  [],
  [{ name: 'Ерлан Н.', text: 'Будет ли запись встречи?', time: 'вчера' }],
];

// Модули курса и дни внутри них (нумерация дней сквозная)
const MODULES = [
  { n: 1, title: 'Основы формативного оценивания', days: [1, 2] },
  { n: 2, title: 'Обратная связь и инструменты', days: [3, 4] },
  { n: 3, title: 'Вовлечение учащихся', days: [5, 6, 7] },
  { n: 4, title: 'Данные и рефлексия', days: [8, 9, 10] },
];
const moduleOf = (dayN) => MODULES.find((m) => m.days.includes(dayN));

const CURRENT_DAY = 4;
const BASE_DONE = 56; // демо: элементы курса вне дневной программы, чтобы старт был 72 из 100
const TOTAL = 100;

const days = TITLES.map((title, i) => {
  const n = i + 1;
  return {
    n, title,
    locked: n > CURRENT_DAY,
    done: TEMPLATE.map((_, j) => n < CURRENT_DAY || (n === CURRENT_DAY && j === 0)),
    file: null,
    readMore: false,
    seen: n < CURRENT_DAY, // история дня просмотрена
    open: new Set([n === CURRENT_DAY ? 1 : 0]),
    social: TEMPLATE.map((_, j) => ({
      likes: 8 + ((n * 7 + j * 5) % 23),
      liked: false,
      saved: false,
      showComments: false,
      comments: [...SEED_COMMENTS[j]],
    })),
  };
});

let selected = CURRENT_DAY;
let currentEl = 0;

// ---------- Утилиты ----------
const $ = (s) => document.querySelector(s);
const fmtMin = (m) => {
  const h = Math.floor(m / 60), r = m % 60;
  return [h && `${h} час`, r && `${r} минут`].filter(Boolean).join(' ');
};
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), 2200);
}
const dayComplete = (d) => d.done.every(Boolean);

// ---------- Рендер ----------
function renderProgress() {
  const doneCount = BASE_DONE + days.reduce((s, d) => s + d.done.filter(Boolean).length, 0);
  const pct = Math.round((doneCount / TOTAL) * 100);
  $('#ring').style.setProperty('--p', pct);
  $('#ringText').textContent = pct + '%';
  $('#progressText').textContent = `${doneCount} из ${TOTAL} элементов`;
}

function storyState(d) {
  if (d.locked) return 'locked';
  if (dayComplete(d)) return 'done';
  return d.seen ? 'seen' : 'new';
}

function moduleState(m) {
  const list = m.days.map((n) => days[n - 1]);
  if (list.every(dayComplete)) return 'done';
  if (list[0].locked) return 'locked';
  return 'current';
}

function storyHtml(d) {
  const st = storyState(d);
  const today = d.n === CURRENT_DAY;
  return `
    <button class="story-item ${st} ${d.n === selected ? 'active' : ''}" data-day="${d.n}"
      aria-label="День ${d.n}: ${d.title}${st === 'locked' ? ' (закрыт)' : ''}">
      <span class="story-ring">
        <span class="story-ava"><b>${d.n}</b><small>день</small></span>
        ${st === 'done' ? `<span class="story-badge ok">${I.check}</span>` : ''}
        ${st === 'locked' ? `<span class="story-badge lock">${I.lock}</span>` : ''}
        ${today && st !== 'done' ? '<span class="story-today">сегодня</span>' : ''}
      </span>
      <span class="story-label">День ${d.n}</span>
    </button>`;
}

// Боковое меню: курс и модули под «Мое обучение»; выделен модуль, в котором человек учится сейчас
function renderNavModules(viewMod) {
  const learningDay = days.find((d) => !d.locked && !dayComplete(d));
  const learningMod = learningDay && moduleOf(learningDay.n);
  $('#navModules').innerHTML = `
    <div class="nav-course" title="Формативное оценивание">Формативное оценивание</div>
    ${MODULES.map((m) => {
      const st = moduleState(m);
      const doneDays = m.days.filter((n) => dayComplete(days[n - 1])).length;
      const learning = m === learningMod;
      return `
        <a href="#" class="nav-mod ${st} ${learning ? 'learning' : ''} ${m === viewMod ? 'viewing' : ''}" data-mod="${m.n}"
           title="Модуль ${m.n}. ${m.title}" ${m === viewMod ? 'aria-current="true"' : ''}>
          <span class="nav-mod-dot">${st === 'done' ? I.check : st === 'locked' ? I.lock : ''}</span>
          <span class="nav-mod-text">
            <b>Модуль ${m.n}</b>
            <small>${learning ? `Сейчас: день ${learningDay.n} из ${days.length}` : m.title}</small>
            ${learning ? `<span class="nav-mod-bar"><i style="width:${(doneDays / m.days.length) * 100}%"></i></span>` : ''}
          </span>
        </a>`;
    }).join('')}`;
}

function renderDays() {
  const activeMod = moduleOf(selected);
  // Вкладки модулей
  $('#moduleTabs').innerHTML = MODULES.map((m) => {
    const st = moduleState(m);
    const doneDays = m.days.filter((n) => dayComplete(days[n - 1])).length;
    return `
      <button class="mod-tab ${st} ${m === activeMod ? 'active' : ''}" data-mod="${m.n}" title="${m.title}">
        <span class="mod-tab-ic">${st === 'done' ? I.check : st === 'locked' ? I.lock : m.n}</span>
        <span>Модуль ${m.n}</span>
        <small>${doneDays}/${m.days.length}</small>
      </button>`;
  }).join('');

  renderNavModules(activeMod);

  // Дни, сгруппированные по модулям
  $('#daysList').innerHTML = MODULES.map((m) => {
    const st = moduleState(m);
    const doneDays = m.days.filter((n) => dayComplete(days[n - 1])).length;
    return `
      <div class="mod-group ${st} ${m === activeMod ? 'active' : ''}" data-mod="${m.n}">
        <div class="mod-head" title="Модуль ${m.n}. ${m.title}">
          <b>Модуль ${m.n}</b><span>${m.title}</span>
        </div>
        <div class="mod-bar"><i style="width:${(doneDays / m.days.length) * 100}%"></i></div>
        <div class="mod-days">${m.days.map((n) => storyHtml(days[n - 1])).join('')}</div>
      </div>`;
  }).join('');
  $('#prevDay').disabled = selected === 1;
  $('#nextDay').disabled = selected === days.length;
  $('#daysList .active')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}

// ---------- Пост ленты (аккордеон) ----------
function statusTag(el, j, d) {
  if (d.done[j]) return `<span class="done-tag">${I.checkCircle}${el.type === 'video' ? 'Просмотрено' : 'Выполнено'}</span>`;
  if (j === currentEl) return '<span class="now-tag">Сейчас</span>';
  return '';
}

function preview(el, d) {
  switch (el.type) {
    case 'video': return `Видео 15:24 · ${d.title}. Практика для современной школы.`;
    case 'text': return 'Формативное оценивание — это процесс получения и интерпретации данных об обучении учащихся, который используется для корректировки преподавания…';
    case 'task': return d.file ? `Загружен файл: ${escapeHtml(d.file)}` : 'Разработайте задание с элементами формативного оценивания и загрузите файл (PDF, DOC, DOCX).';
    case 'test': return `10 вопросов · проходной балл 70%${d.score != null ? ` · ваш результат: ${d.score}%` : ''}`;
    case 'zoom': return `${14 + d.n} сентября, 15:00 (Астана) · Встреча с тренером: разбор практических примеров.`;
  }
}

const escapeHtml = (t) => t.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const initials = (name) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function commentsHtml(s) {
  return s.comments.map((c) => `
    <div class="comment">
      <span class="c-ava ${c.staff ? 'staff' : ''} ${c.me ? 'me' : ''}">${initials(c.name)}</span>
      <div>
        <div class="c-bubble"><b>${c.name}</b>${c.staff ? '<span class="c-badge">Команда курса</span>' : ''}<p>${escapeHtml(c.text)}</p></div>
        <small>${c.time}</small>
      </div>
    </div>`).join('') || '<p class="c-empty">Пока нет комментариев. Будьте первым!</p>';
}

// Свёрнутая видеолекция: кадр видео с кнопкой Play, чтобы сразу было понятно, что это видео
function videoPeek(j, d) {
  return `
    <button class="video-peek" data-act="watch" aria-label="Смотреть видеолекцию: ${d.title}">
      <span class="vp-frame">
        <span class="vp-brand"><i></i>Beyim Ustaz</span>
        <span class="vp-title">${d.title}</span>
        <span class="vp-speaker"></span>
      </span>
      <span class="vp-play">${I.play}</span>
      <span class="vp-dur">${d.done[j] ? `${I.check} Просмотрено · ` : ''}15:24</span>
      <span class="vp-cta">Смотреть видеолекцию</span>
      <span class="vp-bar"><i style="width:${d.done[j] ? 100 : 0}%"></i></span>
    </button>`;
}

function postHtml(el, j, d) {
  const open = d.open.has(j);
  const s = d.social[j];
  return `
    <article class="post ${open ? 'open' : ''}" id="el-${j}" data-j="${j}">
      <header class="post-head" data-act="toggle" role="button" tabindex="0" aria-expanded="${open}" aria-controls="body-${j}">
        <span class="el-icon ${el.color}">${ICONS[el.type]}</span>
        <div class="post-who">
          <h3>${j + 1}. ${el.name}</h3>
          <small>${AUTHORS[el.type]} · ${I.clock}${el.min} минут</small>
        </div>
        ${statusTag(el, j, d)}
        <span class="post-chev">${I.chevDown}</span>
      </header>
      ${el.type === 'video' ? videoPeek(j, d) : `<p class="post-preview" data-act="toggle">${preview(el, d)}</p>`}
      <div class="post-body" id="body-${j}" ${open ? '' : 'inert'}><div class="post-inner"><div class="post-pad">${elementBody(el, j, d)}</div></div></div>
      <footer class="post-actions">
        <button class="pa ${s.liked ? 'on like' : ''}" data-act="like" aria-pressed="${s.liked}" aria-label="Нравится">${I.heart}<span>${s.likes}</span></button>
        <button class="pa ${s.showComments ? 'on' : ''}" data-act="comments" aria-expanded="${s.showComments}" aria-label="Комментарии">${I.comment}<span>${s.comments.length}</span></button>
        <button class="pa ${s.saved ? 'on save' : ''}" data-act="save" aria-pressed="${s.saved}">${I.bookmark}<span>${s.saved ? 'Сохранено' : 'Сохранить'}</span></button>
        <button class="pa pa-open" data-act="toggle">${open ? 'Свернуть' : 'Открыть'}</button>
      </footer>
      <div class="post-comments" ${s.showComments ? '' : 'hidden'}>
        <div class="c-list">${commentsHtml(s)}</div>
        <form class="c-form">
          <span class="c-ava me">ЕЕ</span>
          <input name="text" placeholder="Напишите комментарий…" autocomplete="off" maxlength="500">
          <button class="c-send" aria-label="Отправить">${I.send}</button>
        </form>
      </div>
    </article>`;
}

function elementBody(el, j, d) {
  switch (el.type) {
    case 'video': return `
      <div class="video" id="video">
        <div class="video-brand"><i></i>Beyim Ustaz</div>
        <h5>${d.title}</h5>
        <div class="sub">Практика для современной школы</div>
        <button class="video-play" data-act="play" aria-label="Воспроизвести">${I.play}</button>
        <div class="controls">
          <div class="bar" data-act="seek"><i id="vbar"></i></div>
          <div class="ctrl-row">
            <button class="pp" data-act="play">${I.play}</button>
            <span id="vtime">0:00 / 15:24</span>
            <button class="sp">${I.vol}</button><span>1x</span><button>${I.full}</button><button>${I.dots}</button>
          </div>
        </div>
      </div>`;
    case 'text': return `
      <div class="theory">
        <div>
          <h4>${d.title}: ключевые подходы</h4>
          <p>Формативное оценивание — это процесс получения и интерпретации данных об обучении учащихся, который используется для корректировки преподавания и поддержки дальнейшего развития. Его основная цель — улучшить качество обучения, а не выставить отметку.</p>
          <div class="quote"><span class="mark">“</span><div><q>Оценивание — это не про отметки. Это про развитие.</q><small>— Андреас Шляйхер (ОЭСР)</small></div></div>
          <div class="extra ${d.readMore ? 'show' : ''}" id="extra">
            <p>Ключевые стратегии: прояснение целей обучения и критериев успеха; организация эффективных обсуждений и заданий; обратная связь, продвигающая обучение; вовлечение учащихся во взаимооценивание и самооценивание.</p>
          </div>
          <button class="more ${d.readMore ? 'open' : ''}" data-act="more">${d.readMore ? 'Свернуть' : 'Читать далее'} ${I.chevDown}</button>
        </div>
        <div class="book">Формативное<br>оценивание</div>
      </div>`;
    case 'task': return `
      <h4>Разработайте задание с элементами формативного оценивания</h4>
      <p>Создайте задание для своих учеников с использованием инструментов формативного оценивания. Вы можете выбрать любой предмет и возрастную группу.</p>
      <label class="upload" id="drop">
        <span class="upload-ico">${I.upload}</span>
        <span><b>${d.file ? d.file : 'Загрузите файл с вашим заданием'}</b><small>${d.file ? 'Файл отправлен на проверку' : 'Допустимые форматы: PDF, DOC, DOCX (до 10 МБ)'}</small></span>
        <span class="btn ${d.file ? 'btn-outline' : ''}">${d.file ? 'Заменить файл' : 'Выбрать файл'}</span>
        <input type="file" id="fileInput" accept=".pdf,.doc,.docx" hidden>
      </label>`;
    case 'test': return `
      <div class="row">
        <div><h4>Проверьте свои знания</h4><p>Тест состоит из 10 вопросов. Для успешного прохождения необходимо набрать не менее 70%.</p></div>
        ${d.done[j]
          ? `<div class="test-actions"><span class="btn btn-ghost">${I.check} Пройден: ${d.score ?? 90}%</span>
             <button class="btn btn-outline" data-act="test">Пройти снова</button></div>`
          : `<div class="test-actions">${d.score != null ? `<span class="test-fail">Последний результат: ${d.score}%</span>` : ''}
             <button class="btn" data-act="test">${I.playCircle} ${d.score != null ? 'Пройти снова' : 'Начать тест'}</button></div>`}
      </div>`;
    case 'zoom': return `
      <div class="row">
        <div><h4>Встреча с тренером</h4><p>Обсудим практические примеры и ответим на ваши вопросы.</p></div>
        <div class="zoom">${I.cal}<span>${14 + d.n} сентября, 15:00 (Астана)</span>
          <a class="btn btn-outline" href="#" data-act="zoom">Перейти в Zoom ${I.ext}</a></div>
      </div>`;
  }
}

function renderDay() {
  const d = days[selected - 1];
  const mod = moduleOf(d.n);
  $('#dayLabel').innerHTML = `<span class="crumb-mod" title="${mod.title}">Модуль ${mod.n} · ${mod.title}</span><span class="crumb-sep">›</span>День ${d.n}`;
  $('#dayTitle').textContent = d.title;
  $('#dayLead').textContent = `В этом уроке мы рассмотрим тему «${d.title.toLowerCase()}», практическое применение в разных предметах и возрастных группах.`;
  $('#dayTime').textContent = fmtMin(TEMPLATE.reduce((s, e) => s + e.min, 0));
  $('#planCount').textContent = `${TEMPLATE.length} элементов`;

  const firstUndone = d.done.findIndex((x) => !x);
  currentEl = firstUndone === -1 ? 0 : firstUndone;

  if (d.locked) {
    $('#elements').innerHTML = `<div class="locked-box">${I.lock}<div><b>День ${d.n} пока закрыт</b></div><div>Он откроется после завершения дня ${d.n - 1}.</div></div>`;
    $('#dayFooter').style.display = 'none';
    $('#toggleAll').hidden = true;
  } else {
    $('#toggleAll').hidden = false;
    $('#toggleAll').textContent = d.open.size === TEMPLATE.length ? 'Свернуть все' : 'Развернуть все';
    $('#elements').innerHTML = TEMPLATE.map((el, j) => postHtml(el, j, d)).join('');
    const complete = dayComplete(d);
    $('#dayFooter').style.display = '';
    $('#dayFooter').innerHTML = `
      <span class="ok">${I.check}</span>
      <span>${complete
        ? 'Все элементы этого дня выполнены. День отмечен как выполненный.'
        : 'После завершения всех элементов этого дня он будет отмечен как выполненный, и вы сможете перейти к следующему дню.'}</span>
      <span class="state ${complete ? 'done' : ''}">${complete ? 'День выполнен' : 'День будет отмечен автоматически'}</span>`;
    bindDay(d);
  }

  $('#planList').innerHTML = TEMPLATE.map((el, j) => `
    <li data-el="${j}" class="${!d.locked && j === currentEl && !d.done[j] ? 'current' : ''} ${d.done[j] ? 'done' : ''}">
      <span class="dot">${d.done[j] ? I.check : ''}</span>
      <span>${el.name}<small>${el.min} минут</small></span>
    </li>`).join('');
}

function render() {
  renderDays();
  renderDay();
  renderProgress();
}

// ---------- Действия ----------
function complete(d, j, msg) {
  if (d.done[j]) return;
  d.done[j] = true;
  const next = d.done.findIndex((x) => !x);
  if (next !== -1) d.open.add(next); // раскрываем следующий шаг в ленте
  if (dayComplete(d) && days[d.n]) {
    days[d.n].locked = false;
    toast(`День ${d.n} выполнен! День ${d.n + 1} открыт 🎉`);
    Stories.confetti(innerWidth / 2, innerHeight * 0.4, 120);
  } else if (msg) toast(msg);
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
}

let timer = null;
function bindDay(d) {
  // Видео (симуляция воспроизведения)
  const video = $('#video');
  let sec = 0;
  const total = 15 * 60 + 24;
  const update = () => {
    $('#vbar').style.width = (sec / total) * 100 + '%';
    $('#vtime').textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} / 15:24`;
  };
  clearInterval(timer);
  video.querySelectorAll('[data-act="play"]').forEach((b) => b.addEventListener('click', () => {
    const playing = video.classList.toggle('playing');
    video.querySelector('.pp').innerHTML = playing ? I.pause : I.play;
    clearInterval(timer);
    if (playing) timer = setInterval(() => {
      sec = Math.min(total, sec + 20);
      update();
      if (sec >= total) { clearInterval(timer); complete(d, 0, 'Видеолекция просмотрена'); }
    }, 100);
  }));
  video.querySelector('[data-act="seek"]').addEventListener('click', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    sec = Math.round(((e.clientX - r.left) / r.width) * total);
    update();
  });

  // Теория
  $('[data-act="more"]').addEventListener('click', (e) => {
    const open = d.readMore = $('#extra').classList.toggle('show');
    e.currentTarget.classList.toggle('open', open);
    e.currentTarget.firstChild.textContent = open ? 'Свернуть ' : 'Читать далее ';
    if (open) setTimeout(() => complete(d, 1, 'Теоретический материал изучен'), 600);
  });

  // Практика: загрузка файла
  const input = $('#fileInput');
  const drop = $('#drop');
  const accept = (file) => {
    if (!file) return;
    if (!/\.(pdf|docx?)$/i.test(file.name)) return toast('Неверный формат файла');
    if (file.size > 10 * 1024 * 1024) return toast('Файл больше 10 МБ');
    d.file = file.name;
    if (d.done[2]) { render(); toast('Файл заменён'); } else complete(d, 2, 'Задание отправлено на проверку');
  };
  input.addEventListener('change', () => accept(input.files[0]));
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('drag'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('drag'); }));
  drop.addEventListener('drop', (e) => accept(e.dataTransfer.files[0]));

  // Тест
  $('[data-act="test"]').addEventListener('click', () => Quiz.open(d));

  // Zoom
  $('[data-act="zoom"]').addEventListener('click', (e) => {
    e.preventDefault();
    complete(d, 4, 'Подключение к Zoom…');
  });
}

// ---------- Лента: аккордеон, лайки, комментарии ----------
const curDay = () => days[selected - 1];

function syncToggleAll() {
  $('#toggleAll').textContent = curDay().open.size === TEMPLATE.length ? 'Свернуть все' : 'Развернуть все';
}

function setOpen(post, open) {
  const d = curDay();
  const j = +post.dataset.j;
  open ? d.open.add(j) : d.open.delete(j);
  post.classList.toggle('open', open);
  post.querySelector('.post-head').setAttribute('aria-expanded', open);
  post.querySelector('.post-body').inert = !open;
  post.querySelector('.pa-open').textContent = open ? 'Свернуть' : 'Открыть';
  if (!open) post.querySelector('.video.playing .pp')?.click(); // пауза видео при сворачивании
  syncToggleAll();
}

$('#elements').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-act]');
  const post = e.target.closest('.post');
  if (!btn || !post) return;
  const s = curDay().social[+post.dataset.j];
  switch (btn.dataset.act) {
    case 'toggle':
      setOpen(post, !post.classList.contains('open'));
      break;
    case 'watch':
      setOpen(post, true);
      setTimeout(() => post.querySelector('.video:not(.playing) .video-play')?.click(), 320);
      break;
    case 'like':
      s.liked = !s.liked;
      s.likes += s.liked ? 1 : -1;
      btn.classList.toggle('on', s.liked);
      btn.classList.toggle('like', s.liked);
      btn.setAttribute('aria-pressed', s.liked);
      btn.querySelector('span').textContent = s.likes;
      btn.classList.remove('pop');
      if (s.liked) { void btn.offsetWidth; btn.classList.add('pop'); }
      break;
    case 'save':
      s.saved = !s.saved;
      btn.classList.toggle('on', s.saved);
      btn.classList.toggle('save', s.saved);
      btn.setAttribute('aria-pressed', s.saved);
      btn.querySelector('span').textContent = s.saved ? 'Сохранено' : 'Сохранить';
      toast(s.saved ? 'Добавлено в сохранённые' : 'Удалено из сохранённых');
      break;
    case 'comments': {
      s.showComments = !s.showComments;
      const box = post.querySelector('.post-comments');
      box.hidden = !s.showComments;
      btn.classList.toggle('on', s.showComments);
      btn.setAttribute('aria-expanded', s.showComments);
      if (s.showComments) box.querySelector('input').focus();
      break;
    }
  }
});

$('#elements').addEventListener('keydown', (e) => {
  if (e.target.classList.contains('post-head') && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    e.target.click();
  }
});

$('#elements').addEventListener('submit', (e) => {
  e.preventDefault();
  const post = e.target.closest('.post');
  const input = e.target.elements.text;
  const text = input.value.trim();
  if (!text) return;
  const s = curDay().social[+post.dataset.j];
  s.comments.push({ name: 'Ерлан Есенов', text, time: 'только что', me: true });
  input.value = '';
  const list = post.querySelector('.c-list');
  list.innerHTML = commentsHtml(s);
  list.lastElementChild.classList.add('new');
  post.querySelector('[data-act="comments"] span').textContent = s.comments.length;
});

$('#toggleAll').addEventListener('click', () => {
  const openAll = curDay().open.size !== TEMPLATE.length;
  document.querySelectorAll('.post').forEach((p) => setOpen(p, openAll));
});

// Навигация по дням
$('#daysList').addEventListener('click', (e) => {
  const tab = e.target.closest('.story-item');
  if (!tab) return;
  const origin = tab.querySelector('.story-ring').getBoundingClientRect();
  selected = +tab.dataset.day;
  render();
  Stories.open(selected, origin);
});
// Вкладка модуля: переходим к первому незавершённому открытому дню модуля
function goToModule(m) {
  selected = m.days.find((n) => !days[n - 1].locked && !dayComplete(days[n - 1])) ?? m.days[0];
  render();
  $(`.mod-group[data-mod="${m.n}"]`).scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' });
}
$('#moduleTabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.mod-tab');
  if (tab) goToModule(MODULES[+tab.dataset.mod - 1]);
});
$('#navModules').addEventListener('click', (e) => {
  const item = e.target.closest('[data-mod]');
  if (!item) return;
  e.preventDefault();
  goToModule(MODULES[+item.dataset.mod - 1]);
  closeMenu();
  $('.days').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
$('#prevDay').addEventListener('click', () => { if (selected > 1) { selected--; render(); } });
$('#nextDay').addEventListener('click', () => { if (selected < days.length) { selected++; render(); } });

// План дня
$('#planToggle').addEventListener('click', (e) => {
  const hidden = $('#plan').classList.toggle('hidden');
  e.currentTarget.classList.toggle('collapsed', hidden);
  e.currentTarget.querySelector('span').textContent = hidden ? 'Показать план дня' : 'Скрыть план дня';
});
$('#planList').addEventListener('click', (e) => {
  const li = e.target.closest('li');
  const el = li && $('#el-' + li.dataset.el);
  if (!el) return;
  setOpen(el, true);
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.add('focus');
  setTimeout(() => el.classList.remove('focus'), 1400);
});

// Мобильное меню
const closeMenu = () => { $('#sidebar').classList.remove('open'); $('#backdrop').classList.remove('show'); };
$('#burger').addEventListener('click', () => { $('#sidebar').classList.add('open'); $('#backdrop').classList.add('show'); });
$('#backdrop').addEventListener('click', closeMenu);

render();
