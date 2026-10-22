#!/usr/bin/env python3
"""Render the GitHub README masthead GIF, Open Graph image, and film grain."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
PUBLIC = ROOT / "public"

INK = (16, 20, 17)
PAPER = (231, 239, 233)
MUTED = (163, 178, 168)
BRASS = (224, 176, 122)
MOSS = (157, 206, 180)
LINE = (44, 56, 50)

FRAUNCES = Path("/tmp/fonts/Fraunces.ttf")
MONO = Path("/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf")
MONO_MED = Path("/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Medium.ttf")

PHRASES = [
    ".NET & SQL Server engineer",
    "Legacy .NET, modernized in place",
    "SQL Server design & tuning",
    "ASP.NET Core APIs",
]

RAIL = [
    ("01", "LEGACY .NET"),
    ("02", "SQL SERVER"),
    ("03", "ASP.NET CORE"),
    ("04", "ERP & INSURANCE"),
]


def load_fonts():
    name = ImageFont.truetype(str(FRAUNCES), 78)
    name.set_variation_by_axes([72, 560, 40, 0])
    mono = ImageFont.truetype(str(MONO), 22)
    kicker = ImageFont.truetype(str(MONO_MED), 15)
    job = ImageFont.truetype(str(MONO), 16)
    return name, mono, kicker, job


def tracked(draw, xy, text, font, fill, tracking):
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + tracking
    return x


def render_frame(fonts, phrase, caret):
    name_font, mono, kicker, job = fonts
    image = Image.new("RGB", (880, 340), INK)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 879, 339), outline=LINE)

    tracked(draw, (48, 36), "DHAKA  ·  BANGLADESH", kicker, MUTED, 1.6)
    right = "ASTHA LIFE"
    width = draw.textlength(right, font=kicker) + (len(right) - 1) * 1.6
    tracked(draw, (880 - 48 - width, 36), right, kicker, MUTED, 1.6)

    draw.text((48, 78), "Tanvir", font=name_font, fill=PAPER)
    rail_y = 96
    number_x = 620
    label_x = 668
    for number, label in RAIL:
        draw.text((number_x, rail_y), number, font=kicker, fill=BRASS)
        draw.text((label_x, rail_y), label, font=kicker, fill=MUTED)
        rail_y += 26
    draw.rectangle((48, 188, 216, 190), fill=BRASS)

    prompt = "~  "
    prompt_w = draw.textlength(prompt, font=mono)
    text_y = 214
    draw.text((48, text_y), prompt, font=mono, fill=BRASS)
    draw.text((48 + prompt_w, text_y), phrase, font=mono, fill=PAPER)
    if caret:
        caret_x = 48 + prompt_w + draw.textlength(phrase, font=mono) + 4
        draw.rectangle((caret_x, text_y + 3, caret_x + 10, text_y + 24), fill=BRASS)

    draw.text(
        (48, 276),
        "Executive Officer (IT)  ·  Astha Life Insurance Company Ltd.",
        font=job,
        fill=MUTED,
    )
    return image


def build_gif(fonts):
    frames = []
    durations = []

    def add(phrase, ms, caret=True):
        frames.append(render_frame(fonts, phrase, caret))
        durations.append(ms)

    def hold(phrase, total=1200, step=200):
        elapsed = 0
        visible = True
        while elapsed < total:
            add(phrase, step, caret=visible)
            visible = not visible
            elapsed += step

    def type_in(phrase):
        index = 2
        while index < len(phrase):
            add(phrase[:index], 55, caret=True)
            index += 2
        add(phrase, 55, caret=True)

    def delete(phrase):
        index = len(phrase)
        while index > 0:
            index = max(0, index - 3)
            add(phrase[:index], 32, caret=True)

    hold(PHRASES[0])
    delete(PHRASES[0])
    for phrase in PHRASES[1:]:
        type_in(phrase)
        hold(phrase)
        delete(phrase)
    type_in(PHRASES[0])

    sample = frames[min(8, len(frames) - 1)].quantize(
        colors=96, method=Image.Quantize.MEDIANCUT
    )
    quantized = [
        frame.quantize(palette=sample, dither=Image.Dither.NONE) for frame in frames
    ]
    ASSETS.mkdir(parents=True, exist_ok=True)
    path = ASSETS / "masthead.gif"
    quantized[0].save(
        path,
        save_all=True,
        append_images=quantized[1:],
        duration=durations,
        loop=0,
        disposal=2,
        optimize=True,
    )
    frames[0].save("/tmp/masthead-frame0.png")
    frames[len(frames) // 3].save("/tmp/masthead-mid.png")
    print(f"gif {path} frames={len(frames)} bytes={path.stat().st_size}")


def build_og(fonts):
    name_font, mono, kicker, job = fonts
    big = ImageFont.truetype(str(FRAUNCES), 108)
    big.set_variation_by_axes([96, 560, 40, 0])
    body = ImageFont.truetype(str(MONO), 24)
    image = Image.new("RGB", (1200, 630), INK)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 1199, 629), outline=LINE)
    tracked(draw, (72, 64), "DHAKA  ·  BANGLADESH", kicker, MUTED, 2)
    draw.text((72, 120), "Tanvir", font=big, fill=PAPER)
    draw.rectangle((72, 270, 260, 273), fill=BRASS)
    draw.text((72, 304), ".NET & SQL Server Engineer", font=body, fill=BRASS)
    draw.text(
        (72, 360),
        "Executive Officer (IT)",
        font=body,
        fill=PAPER,
    )
    draw.text(
        (72, 402),
        "Astha Life Insurance Company Ltd.",
        font=body,
        fill=MUTED,
    )
    draw.text(
        (72, 500),
        "Legacy .NET  ·  SQL Server  ·  ASP.NET Core",
        font=job,
        fill=MOSS,
    )
    PUBLIC.mkdir(parents=True, exist_ok=True)
    image.save(PUBLIC / "og.png", optimize=True)


def build_grain():
    import random

    rnd = random.Random(22)
    image = Image.new("RGBA", (160, 160))
    image.putdata(
        [(rnd.randrange(255), rnd.randrange(255), rnd.randrange(255), rnd.randrange(48))
         for _ in range(160 * 160)]
    )
    image.save(PUBLIC / "grain.png")


def main():
    fonts = load_fonts()
    build_grain()
    build_og(fonts)
    build_gif(fonts)


if __name__ == "__main__":
    main()
