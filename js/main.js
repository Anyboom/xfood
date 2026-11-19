/* XFOOD Store — интерактив витрины: меню-шит, фильтры каталога,
   выбор размера/цвета в карточках и появление блоков при скролле.
   Ванильный JS, без библиотек. */
(() => {
  'use strict';

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- меню-шит на мобильных ----- */

  /**
   * Переключает раскрытие меню-шита.
   * @param {HTMLButtonElement} button
   * @param {HTMLElement} sheet
   * @returns {void}
   */
  const initMenuSheet = () => {
    const button = document.querySelector('.header__menu');
    const sheet = document.getElementById('menu-sheet');
    if (!button || !sheet) return;

    const setExpanded = (expanded) => {
      button.setAttribute('aria-expanded', String(expanded));
      sheet.hidden = !expanded;
    };

    button.addEventListener('click', () => {
      setExpanded(button.getAttribute('aria-expanded') !== 'true');
    });

    sheet.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setExpanded(false));
    });
  };

  /* ----- фильтры каталога ----- */

  /**
   * Проверяет, проходит ли карточка фильтр.
   * @param {HTMLElement} card
   * @param {string} filter
   * @returns {boolean}
   */
  const matchesFilter = (card, filter) => filter === 'all' || card.dataset.cat === filter;

  /**
   * Обновляет активное состояние чипов-фильтров.
   * @param {HTMLButtonElement[]} buttons
   * @param {HTMLButtonElement} activeButton
   * @returns {void}
   */
  const updateFilterState = (buttons, activeButton) => {
    buttons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  /**
   * Показывает карточки выбранной категории, остальные прячет.
   * @param {HTMLElement[]} cards
   * @param {string} filter
   * @returns {void}
   */
  const applyFilter = (cards, filter) => {
    cards.forEach((card) => {
      card.hidden = !matchesFilter(card, filter);
    });
  };

  const initCatalogFilters = () => {
    const buttons = Array.from(document.querySelectorAll('.filter'));
    const cards = Array.from(document.querySelectorAll('.product'));
    if (buttons.length === 0 || cards.length === 0) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        updateFilterState(buttons, button);
        applyFilter(cards, button.dataset.filter);
      });
    });
  };

  /* ----- выбор размера/цвета в карточках ----- */

  /**
   * Обновляет подпись CTA: показывает выбранный размер/цвет.
   * @param {HTMLElement} card
   * @returns {void}
   */
  const updateStockLabel = (card) => {
    const label = card.querySelector('.product__link-label');
    const selected = card.querySelector('.size[aria-pressed="true"]');
    if (!label) return;
    label.textContent = selected ? `Проверить: ${selected.textContent.trim()}` : 'Проверить остаток';
  };

  /**
   * Делегированные клики по чипам размера/цвета —
   * один активный чип на карточку, повторный клик снимает выбор.
   * @returns {void}
   */
  const initSizeSelection = () => {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.size');
      if (!button) return;
      const card = button.closest('.product');
      if (!card) return;

      const isSelected = button.getAttribute('aria-pressed') === 'true';
      card.querySelectorAll('.size').forEach((chip) => {
        chip.setAttribute('aria-pressed', String(chip === button && !isSelected));
      });
      updateStockLabel(card);
    });
  };

  /* ----- появление блоков при скролле ----- */

  const initReveal = () => {
    const items = document.querySelectorAll('.reveal');
    if (items.length === 0 || REDUCED_MOTION) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach((item) => observer.observe(item));
  };

  /* ----- запуск ----- */

  const main = () => {
    initMenuSheet();
    initCatalogFilters();
    initSizeSelection();
    initReveal();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main, { once: true });
  } else {
    main();
  }
})();
