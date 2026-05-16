#!/usr/bin/env python3
"""
Convert Amazfit T-Rex 2 SOMH-TGA assets → standard PNG for T-Rex 3 build pipeline.

The zeus build tool expects standard PNG source files; it handles PNG→SOMH-TGA
conversion itself via [PNG2TGA]. Providing SOMH-TGA as source causes [RESIZE] to fail
with "unsupported image format".

Target sizes:
  - Backgrounds: exactly 480x480 (square = T-Rex 3 screen, matches GS-GMT reference)
  - Everything else: proportional scale by 480/454
"""
import struct, os
import numpy as np
from PIL import Image

SRC_DIR = '/home/cos/work/t-rex-faces/presage/assets.orig'
DST_DIR = '/home/cos/work/t-rex-faces/presage/new/assets/480x480-amazfit-t-rex-3'
SCALE   = 480 / 454

EXACT_480 = {
    'idle_bg.png', 'normal_bg_black.png', 'normal_bg_blue.png',
    'normal_bg_green.png', 'normal_bg_red.png',
}


def decode_somh_tga(data: bytes) -> Image.Image:
    """Decode SOMH-TGA palette-indexed image to RGBA PIL Image."""
    id_len   = data[0]
    cm_len   = struct.unpack_from('<H', data, 5)[0]
    bpe      = data[7] // 8
    w        = struct.unpack_from('<H', data, 12)[0]
    h        = struct.unpack_from('<H', data, 14)[0]
    cm_start = 18 + id_len
    px_start = cm_start + cm_len * bpe

    palette  = np.frombuffer(data[cm_start:px_start], dtype=np.uint8).reshape(cm_len, bpe)
    raw      = np.frombuffer(data[px_start:px_start + w * h], dtype=np.uint8).reshape(h, w)
    rgba     = palette[raw]   # SOMH palette is RGBA (not BGRA), use directly
    return Image.fromarray(rgba, 'RGBA')


def convert(filename: str) -> None:
    src = os.path.join(SRC_DIR, filename)
    dst = os.path.join(DST_DIR, filename)

    with open(src, 'rb') as f:
        data = f.read()

    img = decode_somh_tga(data)
    old_w, old_h = img.size

    if filename in EXACT_480:
        new_w, new_h = 480, 480
    else:
        new_w = round(old_w * SCALE)
        new_h = round(old_h * SCALE)

    scaled = img.resize((new_w, new_h), Image.LANCZOS)
    scaled.save(dst, 'PNG')

    tag = 'EXACT' if filename in EXACT_480 else 'scale'
    print(f'  [{tag}] {filename:30s}  {old_w}x{old_h} → {new_w}x{new_h}')


def main():
    files = sorted(f for f in os.listdir(SRC_DIR) if f.endswith('.png'))
    print(f'Converting {len(files)} SOMH-TGA files → standard PNG…')
    for fn in files:
        convert(fn)

    # _empty.png: 1x1 fully transparent PNG (used by invisible touch buttons)
    empty = Image.new('RGBA', (10, 10), (0, 0, 0, 0))
    empty.save(os.path.join(DST_DIR, '_empty.png'), 'PNG')
    print('  [new]   _empty.png                      1x1 transparent')
    print('Done.')


if __name__ == '__main__':
    main()
