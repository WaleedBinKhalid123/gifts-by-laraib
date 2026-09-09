import base64, io, json, sys
from pathlib import Path
from PIL import Image, ImageEnhance

SRC = Path('content/photos')
SPEC = {
  'TRAY':    ('15-wicker-baskets-round.jpg',       (0.03, 0.14, 1.00, 0.86), 1100, False),
  'BEAR':    ('13-large-teddy-bears.jpg',          (0.00, 0.24, 0.50, 0.98),  560, True),
  'ROSES':   ('09-artificial-flowers.jpg',         (0.60, 0.46, 1.00, 0.80),  560, True),
  'GYPS':    ('09-artificial-flowers.jpg',         (0.05, 0.02, 0.62, 0.42),  560, True),
  'NAILS':   ('08-merrycolor-press-on-nails.jpg',  None,                      560, True),
  'HUDA':    ('07-hudamoji-lip-gloss.jpg',         None,                      560, True),
  'CREAM':   ('01-meidian-hand-cream-set.jpg',     None,                      560, True),
  'MASK':    ('06-bioaqua-sheet-masks.jpg',        None,                      560, True),
  'GLITTER': ('12-glitter-powder-set.jpg',         None,                      560, True),
  'RIBBON':  ('11-satin-ribbon-rolls.jpg',         (0.00, 0.00, 0.55, 1.00),  560, True),
  'KEYRING': ('10-teddy-keychain-bouquet.jpg',     None,                      560, True),
}
out = {}
for token, (name, box, width, square) in SPEC.items():
    im = Image.open(SRC / name).convert('RGB'); w, h = im.size
    if box: im = im.crop((int(box[0]*w), int(box[1]*h), int(box[2]*w), int(box[3]*h)))
    if square:
        w, h = im.size; side = min(w, h)
        top = max(0, int((h - side) * 0.34))
        im = im.crop(((w-side)//2, top, (w-side)//2+side, top+side))
    w, h = im.size
    im = im.resize((width, max(1, round(h*width/w))), Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(1.07); im = ImageEnhance.Color(im).enhance(1.06)
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=76, optimize=True, progressive=True)
    out[token] = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
    print(f'{token:9} {len(buf.getvalue())//1024:>4} KB', file=sys.stderr)
Path('scripts/.design2-images.json').write_text(json.dumps(out))
