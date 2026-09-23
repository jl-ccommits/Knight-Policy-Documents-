"""Synthesizes the soundtrack for the QuickQuote animation.

Reads the cue list the page exports (sfx.json, written by render.mjs) and
produces soundtrack.wav: a plucky I-V-vi-IV ukulele-style loop plus cartoon
sound effects (pops, clicks, whooshes, a success chime, confetti crackle).
Everything is generated from scratch, so there are no licensing concerns.
"""
import json
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
HERE = Path(__file__).parent
rng = np.random.default_rng(5)


def env(n, attack=0.004, decay=8.0):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1)
    return a * np.exp(-t * decay)


def sweep(f0, f1, dur, decay=30.0, shape='sine'):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / dur)
    ph = 2 * np.pi * np.cumsum(f) / SR
    w = np.sin(ph) if shape == 'sine' else np.sign(np.sin(ph)) * 0.4
    return w * env(n, 0.002, decay)


def tone(freq, dur, decay=6.0, partials=((1, 1.0),)):
    n = int(dur * SR)
    t = np.arange(n) / SR
    w = sum(a * np.sin(2 * np.pi * freq * m * t) for m, a in partials)
    return w * env(n, 0.003, decay)


def lowpass(x, alpha):
    """One-pole lowpass; alpha may be an array (time-varying cutoff)."""
    y = np.empty_like(x)
    acc = 0.0
    a = np.broadcast_to(alpha, x.shape)
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def noise(dur):
    return rng.standard_normal(int(dur * SR))


def whoosh(dur=0.45):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    x = lowpass(noise(dur), 0.02 + 0.25 * np.sin(np.pi * t) ** 2)
    return x * np.sin(np.pi * t) ** 1.5 * 2.2


def pluck(freq, dur, bright=0.5, decay=0.996):
    """Karplus-Strong plucked string, vectorised one period at a time."""
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    y = np.zeros(n + p + 1)
    y[: p + 1] = lowpass(rng.uniform(-1, 1, p + 1), bright)
    for s in range(p + 1, n + p + 1, p):
        e = min(s + p, n + p + 1)
        y[s:e] = decay * 0.5 * (y[s - p:e - p] + y[s - p - 1:e - p - 1])
    out = y[p + 1:]
    return out * env(len(out), 0.001, 1.2)


def layer(parts, total):
    """Sum (offset_seconds, signal) pairs into one buffer of `total` seconds."""
    out = np.zeros(int(total * SR))
    for off, sig in parts:
        i = int(off * SR)
        m = max(0, min(len(sig), len(out) - i))
        out[i:i + m] += sig[:m]
    return out


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


SFX = {
    'pop': lambda: sweep(260, 900, 0.10, 32) * 0.8,
    'pop2': lambda: sweep(480, 1400, 0.08, 38) * 0.6,
    'paper': lambda: lowpass(noise(0.07), 0.35) * env(int(0.07 * SR), 0.001, 55) * 0.5,
    'whoosh': lambda: whoosh(0.45) * 0.28,
    'swish': lambda: whoosh(0.22) * 0.18,
    'sparkle': lambda: layer([(i * 0.05, tone(f, 0.35, 14, ((1, 1), (2.01, .3))))
                              for i, f in enumerate([2093, 2637, 3136, 4186])], 0.6) * 0.12,
    'boing': lambda: (lambda n: np.sin(2 * np.pi * np.cumsum(220 + 90 * np.sin(np.arange(n) / SR * 2 * np.pi * 14)
                                                              * np.exp(-np.arange(n) / SR * 6)) / SR)
                      * env(n, 0.003, 7))(int(0.45 * SR)) * 0.45,
    'click': lambda: layer([(0, tone(3200, 0.03, 160) * 0.5),
                            (0, lowpass(noise(0.012), 0.6) * env(int(0.012 * SR), 0.0005, 300) * 0.4)], 0.03),
    'chomp': lambda: layer([(0, sweep(520, 140, 0.12, 22) * 0.8), (0.1, sweep(300, 700, 0.07, 40) * 0.5)], 0.2),
    'step': lambda: layer([(0, lowpass(noise(0.04), 0.12) * env(int(0.04 * SR), 0.002, 90) * 0.9),
                           (0, tone(140, 0.05, 60) * 0.35)], 0.05),
    'hop': lambda: sweep(300, 820, 0.16, 14) * 0.35,
    'scribble': lambda: (lambda n: lowpass(noise(n / SR), 0.45) * (0.5 + 0.5 * np.sin(np.arange(n) / SR * 2 * np.pi * 22))
                         * env(n, 0.01, 6) * 0.35)(int(0.24 * SR)),
    'ding': lambda: tone(1568, 0.3, 14, ((1, 1), (2, .25))) * 0.16,
    'type': lambda: layer([(0, tone(1900, 0.025, 180) * 0.25),
                           (0, lowpass(noise(0.02), 0.5) * env(int(0.02 * SR), 0.0005, 200) * 0.3)], 0.025),
    'tick': lambda: tone(2600, 0.02, 220) * 0.18,
    'blip': lambda: tone(988, 0.12, 30, ((1, 1), (3, .15))) * 0.22,
    'chime': lambda: layer([(i * 0.09, tone(midi(m), 1.2, 3.5, ((1, 1), (2, .35), (3, .12))))
                            for i, m in enumerate([72, 76, 79, 84, 88])], 1.6) * 0.22,
    'confetti': lambda: layer([(rng.uniform(0, 0.7), lowpass(noise(0.02), 0.7) * env(int(0.02 * SR), 0.0005, 250)
                                * rng.uniform(.1, .35)) for _ in range(40)], 0.8),
}


def music(duration):
    """Bouncy 108 bpm loop: bass on the beat, uke strums, glockenspiel hook."""
    bpm = 108
    beat = 60 / bpm
    n = int((duration + 2) * SR)
    L = np.zeros(n)
    R = np.zeros(n)
    chords = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C G Am F
    roots = [36, 43, 45, 41]
    hook = [79, 76, 79, 81, 79, 76, 74, 76]  # simple sing-song motif (8ths)

    def add(buf, sig, t, gain):
        i = int(t * SR)
        if i >= n:
            return
        m = min(len(sig), n - i)
        buf[i:i + m] += sig[:m] * gain

    bar = 0
    t = 0.0
    while t < duration:
        c = chords[bar % 4]
        r = roots[bar % 4]
        for b in range(4):
            tb = t + b * beat
            bass = pluck(midi(r + (12 if b == 2 else 0)), 0.9, 0.2, 0.994)
            add(L, bass, tb, 0.35)
            add(R, bass, tb, 0.35)
            if b in (1, 3):  # off-beat uke strum
                for k, note in enumerate(c + [c[0] + 12]):
                    s = pluck(midi(note + 12), 0.7, 0.55, 0.993)
                    add(L, s, tb + k * 0.012, 0.16)
                    add(R, s, tb + k * 0.012 + 0.006, 0.16)
            # light shaker on every 8th
            for h in (0, 0.5):
                sh = lowpass(noise(0.05), 0.9) * env(int(0.05 * SR), 0.004, 70) * 0.04
                sh = sh - lowpass(sh, 0.3)
                add(L, sh, tb + h * beat, 0.8)
                add(R, sh, tb + h * beat, 0.6)
        if bar % 2 == 1 and 1 <= bar <= 7:  # glock hook on alternate bars
            for i, m in enumerate(hook):
                g = tone(midi(m + 12), 0.5, 7, ((1, 1), (2.76, .2)))
                add(L, g, t + i * beat / 2, 0.05)
                add(R, g, t + i * beat / 2, 0.07)
        bar += 1
        t += 4 * beat
    return L, R


def main():
    cues = json.loads((HERE / 'sfx.json').read_text())
    duration = cues['duration']
    n = int(duration * SR)
    mL, mR = music(duration)
    fade = np.ones(n)
    fin = int(0.4 * SR)
    fade[:fin] = np.linspace(0, 1, fin)
    fout = int(1.6 * SR)
    fade[-fout:] = np.linspace(1, 0, fout)
    bed = np.stack([mL[:n], mR[:n]]) * fade
    bed *= 0.16 / max(1e-9, np.sqrt(np.mean(bed ** 2)))  # music bed at a fixed loudness

    fx = np.zeros((2, n))
    for i, cue in enumerate(cues['sfx']):
        sig = SFX[cue['k']]()
        start = int(cue['t'] * SR)
        if start >= n:
            continue
        m = min(len(sig), n - start)
        pan = 0.5 + 0.25 * np.sin(i * 1.7)  # gentle stereo spread
        fx[0, start:start + m] += sig[:m] * (1 - pan) * 2
        fx[1, start:start + m] += sig[:m] * pan * 2
    fx *= 0.8 / max(1e-9, np.abs(fx).max())

    mix = np.tanh((bed + fx) * 1.1) * 0.95  # soft limiter
    pcm = (mix.T * 32767).astype(np.int16)
    out = HERE / (sys.argv[1] if len(sys.argv) > 1 else 'soundtrack.wav')
    with wave.open(str(out), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f'wrote {out} ({duration}s)')


if __name__ == '__main__':
    main()
