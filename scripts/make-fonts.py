"""Rebuild public/fonts — the brand face, subset to Latin and compressed to woff2.

Run it when the app's font changes:  python3 scripts/make-fonts.py
Needs fontTools and brotli, and the app repo checked out beside this one.
"""
import os
from fontTools.subset import main as subset_main

SRC = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
                   "app", "node_modules", "@expo-google-fonts", "plus-jakarta-sans")
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "fonts")
os.makedirs(OUT, exist_ok=True)

# Google's own "latin" subset range, plus the punctuation this site actually sets.
UNICODES = ("U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
            "U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD")

FACES = [("400Regular", 400), ("500Medium", 500), ("600SemiBold", 600), ("700Bold", 700)]

for folder, weight in FACES:
    src = f"{SRC}/{folder}/PlusJakartaSans_{folder}.ttf"
    dst = f"{OUT}/plus-jakarta-sans-{weight}.woff2"
    subset_main([
        src,
        f"--unicodes={UNICODES}",
        "--layout-features+=tnum,ss01,ss02",   # tabular figures must survive the subset
        "--flavor=woff2",
        "--desubroutinize",
        f"--output-file={dst}",
    ])
    print(f"{os.path.basename(dst)}  {os.path.getsize(dst)/1024:.1f} KB  (from {os.path.getsize(src)/1024:.1f} KB)")
