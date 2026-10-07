// ---------- Тест: модальное окно со слайдером вопросов ----------
const QUESTIONS = [
  { q: 'Какова основная цель формативного оценивания?', a: ['Выставить итоговую отметку', 'Улучшить процесс обучения', 'Сравнить учеников между собой', 'Отчитаться перед администрацией'], c: 1 },
  { q: 'Когда проводится формативное оценивание?', a: ['Только в конце четверти', 'Непрерывно, в процессе обучения', 'Только во время экзаменов', 'Один раз в учебный год'], c: 1 },
  { q: 'Что такое критерии успеха?', a: ['Список полученных отметок', 'Описание того, что ученик должен продемонстрировать для достижения цели', 'Рейтинг учеников класса', 'План урока учителя'], c: 1 },
  { q: 'Какая обратная связь наиболее эффективна?', a: ['«Молодец!»', 'Отметка без комментариев', 'Конкретная, своевременная, с указанием следующих шагов', 'Общий комментарий для всего класса'], c: 2 },
  { q: 'Для чего используется техника «Светофор»?', a: ['Для поддержания дисциплины', 'Для самооценки учащимися уровня понимания', 'Для проверки посещаемости', 'Для распределения учеников по группам'], c: 1 },
  { q: 'Что такое «Билет на выход»?', a: ['Разрешение покинуть урок раньше', 'Короткое задание в конце урока для проверки понимания', 'Домашнее задание', 'Итоговая контрольная работа'], c: 1 },
  { q: 'Что предполагает взаимооценивание?', a: ['Оценивание работ учителем', 'Оценивание учащимися работ друг друга по критериям', 'Оценивание родителями', 'Автоматическую проверку работ'], c: 1 },
  { q: 'Кому принадлежат слова «Оценивание — это не про отметки. Это про развитие»?', a: ['Дилану Вильяму', 'Андреасу Шляйхеру', 'Джону Хэтти', 'Льву Выготскому'], c: 1 },
  { q: 'Как следует использовать данные формативного оценивания?', a: ['Хранить в электронном журнале', 'Корректировать преподавание и планировать следующие шаги', 'Сообщать только родителям', 'Использовать для итоговой аттестации'], c: 1 },
  { q: 'Какой из вопросов относится к вопросам высокого порядка?', a: ['Когда произошло это событие?', 'Кто автор произведения?', 'Почему, по-вашему, это решение оказалось лучшим?', 'Сколько глав в книге?'], c: 2 },
];
const PASS = 70;
const DURATION = 15 * 60;
const LETTERS = ['A', 'B', 'C', 'D'];

const Quiz = (() => {
  const root = document.getElementById('quiz');
  const q = (s) => root.querySelector(s);
  const track = q('#quizTrack');
  const viewport = q('.quiz-viewport');
  const steps = q('#quizSteps');
  const prevBtn = q('#quizPrev');
  const nextBtn = q('#quizNext');

  let day, idx, answers, mode, left, timer, lastFocus;

  // ----- Рендер -----
  function buildSlides() {
    track.innerHTML = QUESTIONS.map((item, i) => `
      <section class="quiz-slide" data-i="${i}" aria-label="Вопрос ${i + 1}">
        <span class="quiz-qnum">Вопрос ${i + 1} из ${QUESTIONS.length}</span>
        <h4 class="quiz-q">${item.q}</h4>
        <div class="quiz-answers" role="radiogroup">
          ${item.a.map((text, k) => `
            <label class="quiz-answer" data-k="${k}">
              <input type="radio" name="q${i}" value="${k}">
              <span class="quiz-letter">${LETTERS[k]}</span>
              <span class="quiz-text">${text}</span>
              <span class="quiz-mark"></span>
            </label>`).join('')}
        </div>
        <p class="quiz-explain"></p>
      </section>`).join('');
    steps.innerHTML = QUESTIONS.map((_, i) =>
      `<button class="quiz-step" data-i="${i}" aria-label="Перейти к вопросу ${i + 1}">${i + 1}</button>`).join('');
  }

  function go(i) {
    idx = Math.max(0, Math.min(QUESTIONS.length - 1, i));
    track.style.transform = `translateX(-${idx * 100}%)`;
    track.querySelectorAll('.quiz-slide').forEach((s, k) => { s.inert = k !== idx; });
    viewport.style.height = track.children[idx].offsetHeight + 'px';
    update();
  }

  function update() {
    const answered = answers.filter((x) => x != null).length;
    q('#quizBar').style.width = (mode === 'quiz' ? answered / QUESTIONS.length : 1) * 100 + '%';
    q('#quizCounter').textContent = mode === 'quiz'
      ? `Отвечено ${answered} из ${QUESTIONS.length}`
      : `Разбор: вопрос ${idx + 1} из ${QUESTIONS.length}`;

    steps.querySelectorAll('.quiz-step').forEach((b, i) => {
      b.className = 'quiz-step';
      if (i === idx) b.classList.add('current');
      if (mode === 'review') b.classList.add(answers[i] === QUESTIONS[i].c ? 'right' : 'wrong');
      else if (answers[i] != null) b.classList.add('answered');
    });
    steps.children[idx].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });

    prevBtn.disabled = idx === 0;
    const last = idx === QUESTIONS.length - 1;
    if (mode === 'review') {
      nextBtn.textContent = last ? 'К результатам' : 'Далее';
    } else {
      nextBtn.textContent = last ? 'Завершить тест' : 'Далее';
    }
    nextBtn.classList.toggle('finish', last && mode === 'quiz');
  }

  function paintReview() {
    track.querySelectorAll('.quiz-slide').forEach((s, i) => {
      const right = QUESTIONS[i].c;
      s.querySelectorAll('.quiz-answer').forEach((l) => {
        const k = +l.dataset.k;
        l.classList.toggle('correct', k === right);
        l.classList.toggle('incorrect', k === answers[i] && k !== right);
        l.querySelector('input').disabled = true;
      });
      s.querySelector('.quiz-explain').textContent = answers[i] == null
        ? 'Вы не ответили на этот вопрос.'
        : answers[i] === right ? 'Верно!' : `Правильный ответ: ${LETTERS[right]}`;
    });
  }

  function showView(view) {
    root.dataset.view = view; // quiz | result
  }

  // ----- Таймер -----
  function tick() {
    left--;
    renderTime();
    if (left <= 0) { toast('Время вышло'); finish(); }
  }
  function renderTime() {
    const t = q('#quizTime');
    t.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    t.parentElement.classList.toggle('low', left <= 60);
  }

  // ----- Действия -----
  function open(d) {
    day = d;
    idx = 0;
    answers = Array(QUESTIONS.length).fill(null);
    mode = 'quiz';
    left = DURATION;
    if (root.hidden) lastFocus = document.activeElement;
    q('#quizDay').textContent = `ДЕНЬ ${d.n} · ТЕСТ`;
    buildSlides();
    showView('quiz');
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { root.classList.add('show'); go(0); });
    renderTime();
    clearInterval(timer);
    timer = setInterval(tick, 1000);
    q('.quiz-close').focus();
  }

  function close(force) {
    if (!force && mode === 'quiz' && answers.some((x) => x != null)
      && !confirm('Прервать тест? Ваши ответы не сохранятся.')) return;
    clearInterval(timer);
    root.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { root.hidden = true; }, 200);
    lastFocus?.focus();
  }

  function finish() {
    const empty = answers.findIndex((x) => x == null);
    if (empty !== -1 && left > 0) {
      const n = answers.filter((x) => x == null).length;
      toast(`Остались вопросы без ответа: ${n}`);
      return go(empty);
    }
    clearInterval(timer);
    const correct = answers.filter((x, i) => x === QUESTIONS[i].c).length;
    const score = Math.round((correct / QUESTIONS.length) * 100);
    const passed = score >= PASS;
    const spent = DURATION - left;

    q('#quizResult').innerHTML = `
      <div class="result-ring ${passed ? 'pass' : 'fail'}" style="--p:${score}"><span>${score}%</span></div>
      <h3>${passed ? 'Тест пройден!' : 'Тест не пройден'}</h3>
      <p>${passed
        ? 'Отличный результат. Элемент засчитан в прогресс курса.'
        : `Для прохождения нужно набрать не менее ${PASS}%. Повторите материал и попробуйте снова.`}</p>
      <div class="result-stats">
        <div><b>${correct} / ${QUESTIONS.length}</b><small>правильных ответов</small></div>
        <div><b>${Math.floor(spent / 60)}:${String(spent % 60).padStart(2, '0')}</b><small>затрачено времени</small></div>
        <div><b>${PASS}%</b><small>проходной балл</small></div>
      </div>
      <div class="result-actions">
        <button class="btn btn-outline" data-r="review">Разбор ответов</button>
        ${passed
          ? '<button class="btn" data-r="close">Продолжить обучение</button>'
          : '<button class="btn" data-r="retry">Пройти снова</button>'}
      </div>`;
    mode = 'result';
    showView('result');

    day.score = score;
    if (passed && !day.done[3]) complete(day, 3, `Тест пройден: ${score}%`);
    else { const y = scrollY; render(); scrollTo(0, y); }
  }

  // ----- События -----
  track.addEventListener('change', (e) => {
    const slide = e.target.closest('.quiz-slide');
    answers[+slide.dataset.i] = +e.target.value;
    update();
  });
  steps.addEventListener('click', (e) => {
    const b = e.target.closest('.quiz-step');
    if (b) go(+b.dataset.i);
  });
  prevBtn.addEventListener('click', () => go(idx - 1));
  nextBtn.addEventListener('click', () => {
    if (idx < QUESTIONS.length - 1) return go(idx + 1);
    if (mode === 'quiz') finish();
    else { mode = 'result'; showView('result'); }
  });
  q('#quizResult').addEventListener('click', (e) => {
    const act = e.target.closest('[data-r]')?.dataset.r;
    if (act === 'close') close(true);
    if (act === 'retry') open(day);
    if (act === 'review') {
      mode = 'review';
      paintReview();
      showView('quiz');
      go(0);
    }
  });
  root.querySelectorAll('.quiz-close').forEach((b) => b.addEventListener('click', () => close()));
  root.addEventListener('mousedown', (e) => { if (e.target === root) close(); });

  document.addEventListener('keydown', (e) => {
    if (root.hidden) return;
    if (e.key === 'Escape') return close();
    if (root.dataset.view !== 'quiz' || e.target.tagName === 'BUTTON' && e.key === 'Enter') return;
    if (e.key === 'ArrowRight') go(idx + 1);
    if (e.key === 'ArrowLeft') go(idx - 1);
    const k = '1234'.indexOf(e.key) + 1 || 'abcd'.indexOf(e.key.toLowerCase()) + 1;
    if (k && mode === 'quiz') {
      const input = track.children[idx].querySelectorAll('input')[k - 1];
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Свайп на мобильных
  let sx = null;
  viewport.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });
  addEventListener('resize', () => { if (!root.hidden && root.dataset.view === 'quiz') go(idx); });

  return { open };
})();
