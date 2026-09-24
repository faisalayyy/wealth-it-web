"""Build public/og.png — the card that appears when a link to the site is shared.

Run it after changing the headline:  python3 scripts/make-og.py

The type is converted to outlines here

Text as paths, because the renderer on the other side (sharp/librsvg) has no idea what
Plus Jakarta Sans is and would quietly substitute something else.
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

SRC = "/Users/faisalsmac/Documents/Wealth-it/app/node_modules/@expo-google-fonts/plus-jakarta-sans"
FACES = {
    400: f"{SRC}/400Regular/PlusJakartaSans_400Regular.ttf",
    700: f"{SRC}/700Bold/PlusJakartaSans_700Bold.ttf",
}
fonts = {w: TTFont(p) for w, p in FACES.items()}


def draw(text, x, y, size, weight=400, fill="#F2F4F1", tracking=0.0):
    """One <g> per string: glyph outlines, advanced by the font's own metrics."""
    f = fonts[weight]
    upem = f["head"].unitsPerEm
    cmap, glyphs, hmtx = f.getBestCmap(), f.getGlyphSet(), f["hmtx"]
    scale = size / upem
    track = tracking * size / scale          # tracking is in em, applied in font units
    out, pen_x = [], 0.0
    for ch in text:
        name = cmap.get(ord(ch))
        if name is None:
            pen_x += upem * 0.3
            continue
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        d = pen.getCommands()
        if d:
            out.append(f'<path transform="translate({pen_x:.1f} 0)" d="{d}"/>')
        pen_x += hmtx[name][0] + track
    body = "".join(out)
    return (f'<g transform="translate({x} {y}) scale({scale:.6f} {-scale:.6f})" fill="{fill}">'
            f'{body}</g>')


W, H = 1200, 630
parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
    f'<rect width="{W}" height="{H}" fill="#0B0D0C"/>',
    # a hairline frame, the way the app carries elevation
    f'<rect x="32" y="32" width="{W-64}" height="{H-64}" rx="36" fill="#141817" stroke="#262C29"/>',
    # the mark
    '<rect x="88" y="88" width="64" height="64" rx="18" fill="#C8F24E"/>',
    '<path d="M104 132l12-13 8 8 20-22" fill="none" stroke="#0B0D0C" stroke-width="7"'
    ' stroke-linecap="round" stroke-linejoin="round"/>',
    draw("Wealth-it", 172, 133, 34, 700, "#F2F4F1", -0.03),
    # the headline
    draw("Know where you stand,", 88, 320, 64, 700, "#F2F4F1", -0.035),
    draw("without telling anyone.", 88, 400, 64, 700, "#F2F4F1", -0.035),
    # the line under it
    draw("A personal finance app that keeps your money on your phone.", 88, 470, 25, 400, "#8A918D", -0.01),
    # the claims, as the site states them
    '<circle cx="95" cy="537" r="5" fill="#C8F24E"/>',
    draw("No account", 112, 545, 22, 400, "#CBEE66", -0.01),
    '<circle cx="285" cy="537" r="5" fill="#C8F24E"/>',
    draw("No server", 302, 545, 22, 400, "#CBEE66", -0.01),
    '<circle cx="460" cy="537" r="5" fill="#C8F24E"/>',
    draw("No analytics", 477, 545, 22, 400, "#CBEE66", -0.01),
    "</svg>",
]
import os, subprocess, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
svg = os.path.join(root, "scripts", ".og.svg")
open(svg, "w").write("".join(parts))

# sharp comes with Astro, so there is nothing to install to turn the SVG into the PNG.
node = ("const sharp=require('sharp'),fs=require('fs');"
        "sharp(fs.readFileSync(process.argv[1])).png({compressionLevel:9})"
        ".toFile(process.argv[2]).then(i=>console.log('og.png',i.width+'x'+i.height));")
out = os.path.join(root, "public", "og.png")
subprocess.run(["node", "-e", node, svg, out], cwd=root, check=True)
os.remove(svg)
