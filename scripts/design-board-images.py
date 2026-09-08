"""Build data-URI substitutions for a design board page.

Crops are fractional (left, top, right, bottom) of the original so the subject
stays in frame — these phone shots are not centre-weighted.
"""
import base64, io, json, sys
from pathlib import Path
from PIL import Image, ImageEnhance

SRC = Path('/home/claude/gbl/content/photos')

# token -> (filename, crop box or None, output width)
SPEC = {
    'IMG_BASE':    ('16-wicker-baskets-square.jpg',      (0.04, 0.10, 1.00, 0.90), 1000),
    'IMG_ROUND':   ('15-wicker-baskets-round.jpg',       (0.02, 0.12, 1.00, 0.88),  520),
    'IMG_BLOOM':   ('09-artificial-flowers.jpg',         (0.18, 0.52, 0.95, 1.00),  620),
    'IMG_BEAR_LG': ('13-large-teddy-bears.jpg',          (0.36, 0.33, 1.00, 0.97),  520),
    'IMG_BEAR_KC': ('10-teddy-keychain-bouquet.jpg',     None,                      520),
    'IMG_CREAM':   ('01-meidian-hand-cream-set.jpg',     None,                      520),
    'IMG_GLOSS':   ('02-emelie-lip-gloss-and-lip-oils.jpg', None,                   520),
    'IMG_OIL':     ('02-emelie-lip-gloss-and-lip-oils.jpg', (0.00, 0.34, 0.52, 1.00),  520),
    'IMG_BLUSH':   ('03-emelie-blush-palette.jpg',       None,                      520),
    'IMG_SOAP':    ('04-paper-soap-tubes.jpg',           None,                      520),
    'IMG_COMPACT': ('05-mocallure-mini-compacts.jpg',    None,                      520),
    'IMG_MASK':    ('06-bioaqua-sheet-masks.jpg',        None,                      520),
    'IMG_HUDA':    ('07-hudamoji-lip-gloss.jpg',         None,                      520),
    'IMG_NAILS':   ('08-merrycolor-press-on-nails.jpg',  None,                      520),
    'IMG_GLITTER': ('12-glitter-powder-set.jpg',         None,                      520),
    'IMG_RIBBON':  ('11-satin-ribbon-rolls.jpg',         None,                      620),
}

SQUARE = {'IMG_OIL', 'IMG_ROUND', 'IMG_BEAR_LG', 'IMG_BEAR_KC', 'IMG_CREAM', 'IMG_GLOSS',
          'IMG_BLUSH', 'IMG_SOAP', 'IMG_COMPACT', 'IMG_MASK', 'IMG_HUDA',
          'IMG_NAILS', 'IMG_GLITTER'}

out = {}
for token, (name, box, width) in SPEC.items():
    im = Image.open(SRC / name).convert('RGB')
    w, h = im.size
    if box:
        im = im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))
    if token in SQUARE:
        w, h = im.size
        side = min(w, h)
        # bias the square crop upward — subjects sit high in these frames
        top = max(0, int((h - side) * 0.34))
        im = im.crop(((w - side) // 2, top, (w - side) // 2 + side, top + side))
    w, h = im.size
    im = im.resize((width, max(1, round(h * width / w))), Image.LANCZOS)
    # these were shot in low light; a small lift makes them readable on cream
    im = ImageEnhance.Brightness(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.05)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=74, optimize=True, progressive=True)
    out[token] = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
    print(f'{token:12} {name:38} {len(buf.getvalue())//1024:>4} KB', file=sys.stderr)

Path('/home/claude/gbl/scripts/.design-images.json').write_text(json.dumps(out))
print(f'total {sum(len(v) for v in out.values())//1024} KB base64', file=sys.stderr)
