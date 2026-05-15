/**
 * Site Annotate — Vanilla JS visual annotation widget for page feedback
 *
 * Drop-in: <script src="scripts/annotator.js"></script>
 * Zero dependencies. Works with any HTML/CSS site.
 */

(function () {
  'use strict';

  const NS = 'siteannotate';
  const STORAGE_KEY = `${NS}:annotations`;

  type IconKey = 'pin' | 'copy' | 'trash' | 'eye' | 'eyeOff' | 'close' | 'check';

  const ICONS: Record<IconKey, string> = {
    pin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v3.76Z"/></svg>`,
    copy: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.75" y="9.75" width="9.5" height="9.5" rx="1.5"/><path d="M14.25 14.25h.5a1.5 1.5 0 0 0 1.5-1.5v-6.5a1.5 1.5 0 0 0-1.5-1.5h-6.5a1.5 1.5 0 0 0-1.5 1.5v.5"/></svg>`,
    trash: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    eye: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="M2 2l20 20"/></svg>`,
    close: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    check: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  };

  // Types

  interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface ElementStyles {
    color: string;
    backgroundColor: string;
    fontSize: string;
    fontFamily: string;
  }

  interface ElementInfo {
    tag: string;
    selector: string;
    id: string | null;
    classes: string[];
    text: string;
    rect: Rect;
    styles: ElementStyles;
  }

  interface Annotation {
    id: string;
    comment: string;
    element: ElementInfo;
    url: string;
    timestamp: number;
  }

  interface AppState {
    annotations: Annotation[];
    selecting: boolean;
    hoverEl: Element | null;
    markersVisible: boolean;
  }

  // State

  let state: AppState = {
    annotations: loadAnnotations(),
    selecting: false,
    hoverEl: null,
    markersVisible: true,
  };

  // Utils

  function uid(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function loadAnnotations(): Annotation[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Annotation[]) : [];
    } catch {
      return [];
    }
  }

  function saveAnnotations(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.annotations));
    } catch {}
  }

  function getSelector(el: Element): string {
    if (el.id) return `#${el.id}`;

    const tag = el.tagName.toLowerCase();
    const classes = Array.from(el.classList)
      .filter((c) => !c.startsWith(NS))
      .join('.');
    if (classes) return `${tag}.${classes}`;

    // nth-child fallback
    let path = tag;
    let curr: Element = el;
    while (curr.parentElement && curr.parentElement !== document.body) {
      const siblings = Array.from(curr.parentElement.children).filter(
        (s) => s.tagName === curr.tagName
      );
      const idx = siblings.indexOf(curr) + 1;
      path = `${curr.parentElement.tagName.toLowerCase()} > ${path}:nth-of-type(${idx})`;
      if (curr.parentElement.id) {
        path = `#${curr.parentElement.id} > ${path}`;
        break;
      }
      curr = curr.parentElement;
      if (path.split(' > ').length >= 5) break;
    }
    return path;
  }

  function getElementInfo(el: HTMLElement): ElementInfo {
    const rect = el.getBoundingClientRect();
    const computed = window.getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      selector: getSelector(el),
      id: el.id || null,
      classes: Array.from(el.classList).filter((c) => !c.startsWith(NS)),
      text: (el.innerText || el.textContent || '').trim().slice(0, 120),
      rect: {
        x: Math.round(rect.x + window.scrollX),
        y: Math.round(rect.y + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      styles: {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize,
        fontFamily: computed.fontFamily.split(',')[0].replace(/["']/g, ''),
      },
    };
  }

  function escapeMD(str: string): string {
    return str.replace(/[\\`*_{}[\]()#+\-.!>|]/g, '\\$&');
  }

  function toMarkdown(annotations: Annotation[]): string {
    const lines: string[] = ['# Site Annotate — Feedback\n'];
    annotations.forEach((a, i) => {
      const el = a.element;
      lines.push(`## ${i + 1}. ${escapeMD(el.selector)}\n`);
      lines.push(`**Comment:** ${a.comment || '(no comment)'}\n`);
      lines.push(
        `**Element:** \`<${el.tag}>\` ${el.id ? `\`#${el.id}\`` : ''} ${el.classes.length ? `\`.${el.classes.join('.')}\`` : ''}\n`
      );
      if (el.text) lines.push(`**Text:** "${escapeMD(el.text)}"\n`);
      lines.push(`**Position:** x:${el.rect.x}, y:${el.rect.y}, ${el.rect.width}×${el.rect.height}\n`);
      lines.push(`**Styles:** color: \`${el.styles.color}\`, bg: \`${el.styles.backgroundColor}\`, font: \`${el.styles.fontSize} ${el.styles.fontFamily}\`\n`);
      lines.push(`**URL:** ${a.url}\n`);
      lines.push('---\n');
    });
    return lines.join('\n');
  }

  // DOM helpers

  function createEl(tag: string, cls = '', html = ''): HTMLElement {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html) el.innerHTML = html;
    return el;
  }

  function on(el: EventTarget, evt: string, fn: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    el.addEventListener(evt, fn, options);
  }

  // Styles

  function injectStyles(): void {
    if (document.getElementById(`${NS}-styles`)) return;
    const style = createEl('style', '', getStyles(NS));
    style.id = `${NS}-styles`;
    document.head.appendChild(style);
  }

  // Components

  function buildToolbar(): HTMLElement {
    const tb = createEl('div', `${NS}-toolbar`);
    tb.id = `${NS}-toolbar`;

    const btnPin = createEl('button', `${NS}-btn`, `${ICONS.pin} Annotate`);
    btnPin.id = `${NS}-btn-pin`;
    on(btnPin, 'click', toggleSelectMode);

    const btnCopy = createEl('button', `${NS}-btn`, `${ICONS.copy} Copy`);
    btnCopy.id = `${NS}-btn-copy`;
    on(btnCopy, 'click', handleCopy);

    const btnToggle = createEl('button', `${NS}-btn`, `${ICONS.eye}`);
    btnToggle.id = `${NS}-btn-toggle`;
    btnToggle.title = 'Toggle markers';
    on(btnToggle, 'click', toggleMarkers);

    const btnClear = createEl('button', `${NS}-btn`, `${ICONS.trash}`);
    btnClear.title = 'Clear all';
    on(btnClear, 'click', handleClear);

    const badge = createEl('span', `${NS}-badge`, '0');
    badge.id = `${NS}-badge`;

    tb.append(btnPin, createEl('span', `${NS}-sep`), btnCopy, badge, createEl('span', `${NS}-sep`), btnToggle, btnClear);
    return tb;
  }

  function buildOverlay(): HTMLElement {
    const ov = createEl('div', `${NS}-overlay`);
    ov.id = `${NS}-overlay`;

    const hover = createEl('div', `${NS}-hover`);
    const label = createEl('div', `${NS}-hover-label`);
    hover.appendChild(label);
    ov.appendChild(hover);

    on(ov, 'mousemove', handleOverlayMove);
    on(ov, 'click', handleOverlayClick);
    on(document, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.selecting) cancelSelectMode();
    });

    on(document, 'click', handleDocClick, true);
    on(document, 'mouseover', handleDocHover, true);
    on(document, 'mouseout', handleDocUnhover, true);

    return ov;
  }

  // Actions

  function toggleSelectMode(): void {
    state.selecting = !state.selecting;
    const overlay = document.getElementById(`${NS}-overlay`);
    const btn = document.getElementById(`${NS}-btn-pin`);
    if (state.selecting) {
      overlay?.classList.add('active');
      btn?.classList.add('active');
      document.body.style.cursor = 'crosshair';
    } else {
      overlay?.classList.remove('active');
      btn?.classList.remove('active');
      document.body.style.cursor = '';
      clearHover();
    }
  }

  function cancelSelectMode(): void {
    state.selecting = false;
    document.getElementById(`${NS}-overlay`)?.classList.remove('active');
    document.getElementById(`${NS}-btn-pin`)?.classList.remove('active');
    document.body.style.cursor = '';
    clearHover();
  }

  function clearHover(): void {
    const hover = document.querySelector(`.${NS}-hover`) as HTMLElement | null;
    if (hover) hover.style.display = 'none';
  }

  function handleOverlayMove(e: MouseEvent): void {
    if (!state.selecting) return;

    const ov = document.getElementById(`${NS}-overlay`);
    if (ov) ov.style.pointerEvents = 'none';
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (ov) ov.style.pointerEvents = '';
    if (!target || target.closest(`.${NS}-toolbar`) || target.closest(`.${NS}-modal`) || target === ov) {
      clearHover();
      return;
    }
    if (target === state.hoverEl) return;
    state.hoverEl = target;

    const rect = target.getBoundingClientRect();
    const hover = document.querySelector(`.${NS}-hover`) as HTMLElement | null;
    const label = document.querySelector(`.${NS}-hover-label`) as HTMLElement | null;
    if (!hover || !label) return;
    hover.style.display = 'block';
    hover.style.left = rect.left + 'px';
    hover.style.top = rect.top + 'px';
    hover.style.width = rect.width + 'px';
    hover.style.height = rect.height + 'px';
    label.textContent = getSelector(target);
  }

  function handleOverlayClick(e: MouseEvent): void {
    if (!state.selecting) return;

    const ov = document.getElementById(`${NS}-overlay`);
    if (ov) ov.style.pointerEvents = 'none';
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (ov) ov.style.pointerEvents = '';
    if (!target || target.closest(`.${NS}-toolbar`) || target.closest(`.${NS}-modal`) || target === ov || target.tagName === 'HTML') return;
    e.preventDefault();
    e.stopPropagation();
    cancelSelectMode();
    openAnnotationModal(target as HTMLElement);
  }

  function handleDocClick(e: MouseEvent): void {
    if (!state.selecting) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(`.${NS}-toolbar`) || target.closest(`.${NS}-modal`) || target.closest(`.${NS}-overlay`)) return;
    if (target.tagName === 'HTML' || target === document.documentElement) return;
    e.preventDefault();
    e.stopPropagation();
    cancelSelectMode();
    openAnnotationModal(target);
  }

  function handleDocHover(e: MouseEvent): void {
    if (!state.selecting) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(`.${NS}-toolbar`) || target.closest(`.${NS}-modal`) || target.closest(`.${NS}-overlay`)) return;
    state.hoverEl = target;
    const rect = target.getBoundingClientRect();
    const hover = document.querySelector(`.${NS}-hover`) as HTMLElement | null;
    const label = document.querySelector(`.${NS}-hover-label`) as HTMLElement | null;
    if (!hover || !label) return;
    hover.style.display = 'block';
    hover.style.position = 'fixed';
    hover.style.left = rect.left + 'px';
    hover.style.top = rect.top + 'px';
    hover.style.width = rect.width + 'px';
    hover.style.height = rect.height + 'px';
    label.textContent = getSelector(target);
  }

  function handleDocUnhover(e: MouseEvent): void {
    if (!state.selecting) return;
    const related = e.relatedTarget as Element | null;
    if (!related || !related.closest || related.closest(`.${NS}-toolbar`) || related.closest(`.${NS}-modal`) || related.closest(`.${NS}-overlay`)) {
      clearHover();
    }
  }

  function openAnnotationModal(target: HTMLElement, existing: Annotation | null = null): void {
    const existingModal = document.querySelector(`.${NS}-modal`);
    if (existingModal) existingModal.remove();

    const info = getElementInfo(target);
    const modal = createEl('div', `${NS}-modal`);
    const isEdit = existing !== null;

    const header = createEl('div', `${NS}-modal-header`);
    header.innerHTML = `${isEdit ? 'Edit' : 'New'} Annotation <button class="${NS}-modal-close">${ICONS.close}</button>`;
    const closeBtn = header.querySelector('button');

    const tag = createEl('div', `${NS}-modal-tag`, info.selector);

    const ta = createEl('textarea') as HTMLTextAreaElement;
    ta.placeholder = 'Describe the issue or feedback...';
    ta.value = existing ? existing.comment : '';

    const actions = createEl('div', `${NS}-modal-actions`);
    const btnCancel = createEl('button', `${NS}-btn`, 'Cancel');
    const btnSave = createEl('button', `${NS}-btn primary`, `${isEdit ? 'Update' : 'Save'}`);
    actions.append(btnCancel, btnSave);

    modal.append(header, tag, ta, actions);
    document.body.appendChild(modal);

    target.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    const rect = target.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = rect.right + 12;
    let top = rect.top;
    if (left + 340 > vw) left = rect.left - 332;
    if (top + 220 > vh) top = vh - 240;
    if (left < 8) left = 8;
    if (top < 8) top = 8;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';

    header.style.cursor = 'move';
    header.style.userSelect = 'none';
    let dragging = false;
    let dragOffX = 0;
    let dragOffY = 0;
    const dragCtrl = new AbortController();
    const dragSig = { signal: dragCtrl.signal };

    function startDrag(e: MouseEvent | TouchEvent): void {
      e.preventDefault();
      dragging = true;
      const ev = 'touches' in e ? e.touches[0] : e;
      const mRect = modal.getBoundingClientRect();
      dragOffX = ev.clientX - mRect.left;
      dragOffY = ev.clientY - mRect.top;
      modal.style.transition = 'none';
    }

    function moveDrag(e: MouseEvent | TouchEvent): void {
      if (!dragging) return;
      const ev = 'touches' in e ? e.touches[0] : e;
      let nx = ev.clientX - dragOffX;
      let ny = ev.clientY - dragOffY;
      const mw = modal.offsetWidth;
      const mh = modal.offsetHeight;
      nx = Math.max(0, Math.min(nx, window.innerWidth - mw));
      ny = Math.max(0, Math.min(ny, window.innerHeight - mh));
      modal.style.left = nx + 'px';
      modal.style.top = ny + 'px';
    }

    function endDrag(): void {
      dragging = false;
      modal.style.transition = '';
    }

    on(header, 'mousedown', startDrag);
    on(header, 'touchstart', startDrag, { passive: false });
    on(document, 'mousemove', moveDrag, dragSig);
    on(document, 'touchmove', moveDrag, { passive: false, signal: dragCtrl.signal });
    on(document, 'mouseup', endDrag, dragSig);
    on(document, 'touchend', endDrag, dragSig);

    function cleanupAndRemove(): void {
      dragCtrl.abort();
      modal.remove();
    }

    ta.focus();

    on(btnCancel, 'click', cleanupAndRemove);
    on(closeBtn, 'click', cleanupAndRemove);
    on(ta, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) btnSave.click();
      if (e.key === 'Escape') cleanupAndRemove();
    });
    on(btnSave, 'click', () => {
      const comment = ta.value.trim();
      if (isEdit) {
        existing!.comment = comment;
        existing.element = info;
        existing.timestamp = Date.now();
      } else {
        state.annotations.push({
          id: uid(),
          comment,
          element: info,
          url: location.href,
          timestamp: Date.now(),
        });
      }
      saveAnnotations();
      renderMarkers();
      updateBadge();
      cleanupAndRemove();
      showToast(`${isEdit ? 'Updated' : 'Saved'} annotation`);
    });
  }

  function renderMarkers(): void {
    document.querySelectorAll(`.${NS}-marker`).forEach((m) => m.remove());
    if (!state.markersVisible) return;
    state.annotations.forEach((a, i) => {
      const { x, y } = a.element.rect;
      const marker = createEl('div', `${NS}-marker`, `${i + 1}`);
      marker.style.left = x + 'px';
      marker.style.top = y + 'px';
      marker.title = a.element.selector;

      const tooltip = createEl('div', `${NS}-marker-tooltip`, a.comment || 'No comment');
      marker.appendChild(tooltip);

      on(marker, 'click', (e: MouseEvent) => {
        e.stopPropagation();
        const el = document.querySelector(a.element.selector);
        if (el instanceof HTMLElement) {
          openAnnotationModal(el, a);
        } else {
          showToast('Original element no longer exists', true);
        }
      });

      document.body.appendChild(marker);
    });
  }

  function updateBadge(): void {
    const badge = document.getElementById(`${NS}-badge`);
    if (badge) badge.textContent = String(state.annotations.length);
  }

  function toggleMarkers(): void {
    state.markersVisible = !state.markersVisible;
    const btn = document.getElementById(`${NS}-btn-toggle`);
    if (btn) btn.innerHTML = state.markersVisible ? ICONS.eye : ICONS.eyeOff;
    renderMarkers();
  }

  function handleCopy(): void {
    if (!state.annotations.length) {
      showToast('No annotations to copy', true);
      return;
    }
    const md = toMarkdown(state.annotations);
    navigator.clipboard.writeText(md).then(() => {
      showToast(`Copied ${state.annotations.length} annotation${state.annotations.length > 1 ? 's' : ''}`);
    }).catch(() => {
      const ta = createEl('textarea') as HTMLTextAreaElement;
      ta.value = md;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast(`Copied ${state.annotations.length} annotation${state.annotations.length > 1 ? 's' : ''}`);
      } catch {
        showToast('Copy failed', true);
      }
      ta.remove();
    });
  }

  function handleClear(): void {
    if (!state.annotations.length) return;
    const existing = document.querySelector(`.${NS}-confirm`);
    if (existing) existing.remove();

    const modal = createEl('div', `${NS}-confirm`);
    const header = createEl('div', `${NS}-confirm-header`, `${ICONS.trash} Clear all?`);
    const text = createEl('div', `${NS}-confirm-text`, 'This will remove all annotations. This action cannot be undone.');
    const actions = createEl('div', `${NS}-confirm-actions`);
    const btnCancel = createEl('button', `${NS}-btn`, 'Cancel');
    const btnClear = createEl('button', `${NS}-btn danger`, 'Clear all');
    actions.append(btnCancel, btnClear);
    modal.append(header, text, actions);
    document.body.appendChild(modal);

    function remove(): void {
      modal.remove();
    }

    on(btnCancel, 'click', remove);
    on(modal, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') remove();
    });
    on(btnClear, 'click', () => {
      state.annotations = [];
      saveAnnotations();
      renderMarkers();
      updateBadge();
      remove();
      showToast('All annotations cleared');
    });
  }

  function showToast(msg: string, isError = false): void {
    document.querySelectorAll(`.${NS}-toast`).forEach((t) => t.remove());
    const toast = createEl('div', `${NS}-toast`, `${isError ? '⚠️' : ICONS.check} ${msg}`);
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'opacity 200ms, transform 200ms';
      setTimeout(() => toast.remove(), 220);
    }, 2200);
  }

  // Init

  function init(): void {
    if (document.getElementById(`${NS}-toolbar`)) return;
    injectStyles();
    document.body.appendChild(buildOverlay());
    document.body.appendChild(buildToolbar());
    renderMarkers();
    updateBadge();

    on(document, 'keydown', (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        toggleSelectMode();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
