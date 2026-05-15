function getStyles(ns: string): string {
  return `
    .${ns}-toolbar {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 4px;
      background: #fff;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 12px;
      padding: 6px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06);
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      line-height: 1;
      color: #111;
      transition: transform 200ms cubic-bezier(0.22,1,0.36,1), opacity 200ms;
      user-select: none;
    }
    .${ns}-toolbar.minimized {
      transform: translateY(12px);
      opacity: 0;
      pointer-events: none;
    }
    .${ns}-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 7px 10px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #333;
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background 120ms, color 120ms;
      white-space: nowrap;
    }
    .${ns}-btn:hover { background: rgba(0,0,0,0.05); }
    .${ns}-btn:active { transform: scale(0.96); }
    .${ns}-btn.active {
      background: #111;
      color: #fff;
    }
    .${ns}-btn.primary {
      background: #111;
      color: #fff;
    }
    .${ns}-btn.primary:hover { background: #333; }
    .${ns}-sep {
      width: 1px;
      height: 20px;
      background: rgba(0,0,0,0.08);
      margin: 0 2px;
    }
    .${ns}-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 9px;
      background: #e5484d;
      color: #fff;
      font-size: 10px;
      font-weight: 600;
    }

    .${ns}-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      background: rgba(0,0,0,0.02);
      cursor: crosshair;
      display: none;
    }
    .${ns}-overlay.active { display: block; }
    .${ns}-overlay .${ns}-hover {
      position: absolute;
      pointer-events: none;
      border: 2px solid #e5484d;
      border-radius: 3px;
      background: rgba(229,72,77,0.06);
      transition: all 80ms ease;
    }
    .${ns}-overlay .${ns}-hover-label {
      position: absolute;
      top: -24px;
      left: 0;
      background: #e5484d;
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 7px;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
    }

    .${ns}-modal {
      position: fixed;
      z-index: 2147483648;
      background: #fff;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 12px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
      padding: 14px;
      width: 320px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      animation: ${ns}-pop 200ms cubic-bezier(0.22,1,0.36,1);
    }
    @keyframes ${ns}-pop {
      from { opacity: 0; transform: scale(0.94) translateY(6px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .${ns}-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      font-weight: 600;
      font-size: 13px;
      color: #111;
    }
    .${ns}-modal-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: #999;
      cursor: pointer;
      padding: 0;
    }
    .${ns}-modal-close:hover { background: rgba(0,0,0,0.05); color: #333; }
    .${ns}-modal-tag {
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-size: 11px;
      color: #666;
      background: rgba(0,0,0,0.04);
      padding: 3px 7px;
      border-radius: 5px;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .${ns}-modal textarea {
      width: 100%;
      min-height: 64px;
      padding: 8px 10px;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 8px;
      font: inherit;
      font-size: 13px;
      resize: vertical;
      outline: none;
      margin-bottom: 10px;
      box-sizing: border-box;
    }
    .${ns}-modal textarea:focus { border-color: #111; }
    .${ns}-modal-actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
    }
    .${ns}-modal-actions .${ns}-btn { padding: 6px 12px; }

    .${ns}-marker {
      position: absolute;
      z-index: 2147483645;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #e5484d;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(229,72,77,0.35);
      cursor: pointer;
      transform: translate(-50%, -50%) scale(1);
      transition: transform 150ms cubic-bezier(0.22,1,0.36,1);
      pointer-events: auto;
      border: 2px solid #fff;
    }
    .${ns}-marker:hover { transform: translate(-50%, -50%) scale(1.15); z-index: 2147483646; }
    .${ns}-marker.hidden-marker { display: none; }
    .${ns}-marker-tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: #111;
      color: #fff;
      font-size: 11px;
      font-weight: 400;
      padding: 6px 10px;
      border-radius: 8px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 150ms;
    }
    .${ns}-marker:hover .${ns}-marker-tooltip { opacity: 1; }
    .${ns}-marker-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: #111;
    }

    .${ns}-toast {
      position: fixed;
      bottom: 80px;
      right: 24px;
      z-index: 2147483649;
      background: #111;
      color: #fff;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      font-weight: 500;
      padding: 10px 16px;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 8px;
      animation: ${ns}-slideUp 250ms cubic-bezier(0.22,1,0.36,1);
      pointer-events: none;
    }
    @keyframes ${ns}-slideUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .${ns}-confirm {
      position: fixed;
      bottom: 80px;
      right: 24px;
      z-index: 2147483648;
      background: #fff;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 12px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
      padding: 14px;
      width: 260px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      animation: ${ns}-pop 200ms cubic-bezier(0.22,1,0.36,1);
    }
    .${ns}-confirm-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 13px;
      color: #111;
    }
    .${ns}-confirm-text {
      color: #555;
      margin-bottom: 12px;
      line-height: 1.4;
    }
    .${ns}-confirm-actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
    }
    .${ns}-confirm-actions .${ns}-btn {
      padding: 6px 12px;
    }
    .${ns}-confirm-actions .${ns}-btn.danger {
      background: #e5484d;
      color: #fff;
    }
    .${ns}-confirm-actions .${ns}-btn.danger:hover { background: #c43a3f; }
  `;
}
