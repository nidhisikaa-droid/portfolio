const palette = {
  accent: '#a57cff',
  accentWarm: '#ffb964',
  deep: '#120c2c',
};

function createBlob(ctx, w, h, cx, cy, rx, ry, phase, hue = 258, sat = 68, light = 56, alpha = 0.16) {
  return {
    cx,
    cy,
    rx,
    ry,
    phase,
    hue,
    sat,
    light,
    alpha,
    draw(ctx, t) {
      const x = cx + Math.sin(t * 0.0006 + phase) * rx * 0.18;
      const y = cy + Math.cos(t * 0.0005 + phase * 1.3) * ry * 0.16;
      const gr = ctx.createRadialGradient(x, y, 0, x, y, ry * 0.95);
      gr.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`);
      gr.addColorStop(0.6, `hsla(${hue + 6}, ${sat - 8}%, ${light - 16}%, ${alpha * 0.35})`);
      gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  };
}

function createTinyBeacon(ctx, w, h, cx, cy, r, hue = 44, sat = 92, light = 68, alpha = 0.22) {
  return {
    cx,
    cy,
    r,
    hue,
    sat,
    light,
    alpha,
    draw(ctx, t) {
      const pulse = 0.7 + 0.3 * Math.sin(t * 0.0009 + 1.6);
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * pulse);
      gr.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 1.1})`);
      gr.addColorStop(0.55, `hsla(${hue}, ${sat}%, ${light - 12}%, ${alpha * 0.35})`);
      gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
      ctx.fill();
    },
  };
}

export function initBackground(canvas) {
  const ctx = canvas.getContext('2d');
  let w = 0,
    h = 0;
  let scale = 1;
  let blobs = [];
  let beacons = [];
  let t = 0;
  let last = performance.now();
  let rafId = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    scale = dpr;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    const bigger = Math.max(w, h);
    const base = Math.max(380, Math.min(780, 540 + bigger * 0.22));

    blobs = [
      createBlob(ctx, w, h, w * 0.20, h * 0.28, base * 1.05, base * 0.72, 0.0, 258, 68, 56, 0.17),
      createBlob(ctx, w, h, w * 0.84, h * 0.20, base * 0.88, base * 0.62, 1.2, 252, 66, 50, 0.15),
      createBlob(ctx, w, h, w * 0.70, h * 0.86, base * 0.95, base * 0.72, 2.4, 268, 62, 48, 0.16),
      createBlob(ctx, w, h, w * 0.10, h * 0.82, base * 0.72, base * 0.55, 3.2, 262, 72, 52, 0.14),
      createBlob(ctx, w, h, w * 0.52, h * 0.50, base * 0.62, base * 0.46, 5.0, 44, 80, 66, 0.06),
    ];

    beacons = [
      createTinyBeacon(ctx, w, h, w * 0.90, h * 0.14, 160, 256, 78, 70, 0.22),
      createTinyBeacon(ctx, w, h, w * 0.14, h * 0.16, 130, 44, 92, 70, 0.18),
    ];

    if (w > 760) {
      beacons.push(
        createTinyBeacon(ctx, w, h, w * 0.52, h * 0.10, 180, 280, 68, 66, 0.16),
      );
    }
  }

  function frame(now) {
    const dt = Math.min(60, now - last);
    last = now;
    t += dt;

    ctx.clearRect(0, 0, w, h);

    const scroll = window.scrollY || 0;
    const px = scroll * 0.05;
    const py = scroll * 0.025;

    for (let i = 0; i < blobs.length; i++) {
      const b = blobs[i];
      b.cx += (b.cx - px - i * 60 - b.cx) * 0.002;
      b.cy += (b.cy - py - i * 40 - b.cy) * 0.002;
      b.draw(ctx, t);
    }

    for (const b of beacons) {
      b.draw(ctx, t);
    }

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (rafId) return;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function observeVisibility() {
    if (typeof document === 'undefined') return;
    if (!document.hidden && document.visibilityState !== 'hidden') {
      start();
    } else {
      stop();
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  start();

  if (typeof document !== 'undefined' && document.hasOwnProperty('addEventListener')) {
    document.addEventListener('visibilitychange', observeVisibility, { passive: true });
  }

  return { resize, start, stop };
}
