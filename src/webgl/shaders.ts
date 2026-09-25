/**
 * THE LEDGER FIELD — shaders.
 *
 * Every transaction in `ledger.ts` is one instance of a thin quad. Where that quad goes is not
 * decided on the CPU and animated property by property; it is decided here, three times over,
 * and the vertex shader blends between the three according to a single scroll-driven `uPhase`.
 * That is what lets one world become another instead of one section replacing another:
 *
 *   phase 0  COLLAPSED   every transaction packed into the shape of the headline figure.
 *                        The number is literally made of the things that produced it.
 *   phase 1  FLOWED      spread along real time, income above the rule, spending below.
 *   phase 2  FOLDED      time discarded, day-of-month kept. Twelve months land on top of one
 *                        another and the commitments stack into columns. This is the moment
 *                        the site is built around: the reader's own repetition, made visible
 *                        by removing information rather than adding any.
 *
 * One draw call, ~470 instances, no per-frame CPU work beyond three uniforms.
 */

export const vert = /* glsl */ `
  attribute float aT;      // -1 … 0, position in the recorded year
  attribute float aDom;    //  0 … 1, position within its own month
  attribute float aMag;    //  0 … 1, magnitude against the largest transaction
  attribute float aSign;   // +1 in, -1 out, 0 a transfer (which is neither)
  attribute float aSeed;   //  0 … 1, per-instance noise
  attribute vec2  aHero;   // where it sits while it is still part of the number

  uniform float uPhase;    // 0 → 2, scrubbed by scroll
  uniform float uReveal;   // 0 → 1, the opening
  uniform float uCursor;   // -1 … 0, the reader's position in time
  uniform vec2  uView;     // viewport, in pixels — the camera is 1 unit : 1 px
  uniform float uTime;
  uniform float uVel;      // scroll velocity, -1 … 1

  varying float vAlpha;
  varying float vSign;
  varying float vNear;

  void main() {
    float halfW = uView.x * 0.5;
    float halfH = uView.y * 0.5;

    // ── the three worlds ────────────────────────────────────────────────────────────────
    vec2 pHero = aHero;

    float lane = uView.y * (0.045 + aMag * 0.33);
    vec2 pFlow = vec2(
      (aT + 0.5) * uView.x * 0.94,
      aSign * lane + (aSign == 0.0 ? (aSeed - 0.5) * 0.05 * uView.y : 0.0)
    );

    vec2 pFold = vec2(
      (aDom - 0.5) * uView.x * 0.8,
      aSign * lane + (aSign == 0.0 ? (aSeed - 0.5) * 0.05 * uView.y : 0.0)
    );

    // Blend. The transition into the fold is eased per-instance so the months arrive as a
    // shuffle rather than as one rigid slab.
    float p1 = clamp(uPhase, 0.0, 1.0);
    float p2 = clamp(uPhase - 1.0, 0.0, 1.0);
    float lag = smoothstep(0.0, 1.0, clamp(p2 * 1.35 - aSeed * 0.35, 0.0, 1.0));
    vec2 pos = mix(mix(pHero, pFlow, smoothstep(0.0, 1.0, p1)), pFold, lag);

    // ── the bar itself ──────────────────────────────────────────────────────────────────
    float hHero = 2.0 + aMag * 7.0;
    float hOpen = uView.y * (0.006 + aMag * 0.10);
    float h = mix(hHero, hOpen, smoothstep(0.0, 1.0, p1));
    float w = mix(2.2, 2.0, p1);

    // Scroll velocity smears the bars along their own axis. It exists only while the hand is
    // moving and is gone the instant it stops, which is the difference between weight and a
    // rendering fault.
    h += abs(uVel) * 30.0 * aMag;

    // The opening: each bar arrives on its own beat, from slightly below.
    float r = clamp((uReveal - aSeed * 0.35) * 1.6, 0.0, 1.0);
    r = 1.0 - pow(1.0 - r, 3.0);
    pos.y += (1.0 - r) * -40.0;

    // ── the reader's cursor, as a position in time ──────────────────────────────────────
    // Bars ahead of the cursor have not happened yet at the moment being read. They do not
    // vanish — they lose their colour and their confidence.
    float ahead = step(uCursor, aT);
    float near = 1.0 - smoothstep(0.0, 0.10, abs(aT - uCursor));
    vNear = near * (1.0 - p2);
    pos.y += near * aSign * 10.0 * (1.0 - p2);

    vec2 local = position.xy * vec2(w, h * r);
    vec4 world = vec4(pos + local, 0.0, 1.0);

    vAlpha = r * mix(1.0, 0.16, ahead * (1.0 - p1 * 0.6));
    vSign = aSign;

    gl_Position = projectionMatrix * modelViewMatrix * world;
  }
`;

export const frag = /* glsl */ `
  precision mediump float;

  uniform vec3 uIn;
  uniform vec3 uOut;
  uniform vec3 uMoved;
  uniform vec3 uAcc;
  uniform float uFade;   // the whole field leaving, as the page moves past it

  varying float vAlpha;
  varying float vSign;
  varying float vNear;

  void main() {
    vec3 c = vSign > 0.5 ? uIn : (vSign < -0.5 ? uOut : uMoved);
    // Under the cursor a bar takes the accent — the one place the lime appears in the field,
    // and it appears as the answer to a question the reader asked with their hand.
    c = mix(c, uAcc, vNear * 0.85);
    float a = vAlpha * uFade;
    if (a < 0.004) discard;
    gl_FragColor = vec4(c, a);
  }
`;
