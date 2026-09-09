import base64, io, json, sys
from pathlib import Path
from PIL import Image, ImageEnhance
SRC = Path('content/photos')
# token: (file, crop(l,t,r,b) frac or None, width, square?)
SPEC = {
 'REF':     ('20-hat-box-black-styled.jpg',       (0.56,0.28,1.00,0.84), 900, False),
 'WHITE':   ('23-hat-box-white.jpg',              (0.00,0.24,1.00,0.86), 640, True),
 'PINK':    ('22-hat-box-light-pink.jpg',         (0.00,0.10,1.00,0.78), 640, True),
 'ROSEBOX': ('21-hat-box-deep-rose.jpg',          (0.00,0.14,1.00,0.80), 640, True),
 'BLACKBOX':('20-hat-box-black-styled.jpg',       (0.00,0.28,0.48,0.86), 640, True),
 'ROSES':   ('09-artificial-flowers.jpg',         (0.18,0.52,0.78,0.86), 560, True),
 'GYPS':    ('09-artificial-flowers.jpg',         (0.05,0.02,0.62,0.42), 560, True),
 'PERFUME': ('24-cube-cap-perfume.jpg',           (0.18,0.02,0.86,0.62), 560, True),
 'MIST':    ('25-ombre-body-mist.jpg',            (0.16,0.14,0.84,0.82), 560, True),
 'BLUSH':   ('03-emelie-blush-palette.jpg',       None,                  560, True),
 'HUDA':    ('07-hudamoji-lip-gloss.jpg',         None,                  560, True),
 'MASK':    ('06-bioaqua-sheet-masks.jpg',        None,                  560, True),
 'BEARKC':  ('10-teddy-keychain-bouquet.jpg',     None,                  560, True),
 'RIBBON':  ('11-satin-ribbon-rolls.jpg',         (0.40,0.00,1.00,1.00), 560, True),
 'VIAL':    ('26-rollon-vials-clear.jpg',         (0.20,0.10,0.80,0.78), 560, True),
}
out={}
for tok,(name,box,w,sq) in SPEC.items():
    im=Image.open(SRC/name).convert('RGB'); W,H=im.size
    if box: im=im.crop((int(box[0]*W),int(box[1]*H),int(box[2]*W),int(box[3]*H)))
    if sq:
        W,H=im.size; s=min(W,H); top=max(0,int((H-s)*0.30))
        im=im.crop(((W-s)//2, top, (W-s)//2+s, top+s))
    W,H=im.size; im=im.resize((w,max(1,round(H*w/W))), Image.LANCZOS)
    im=ImageEnhance.Brightness(im).enhance(1.08); im=ImageEnhance.Color(im).enhance(1.05)
    b=io.BytesIO(); im.save(b,'JPEG',quality=78,optimize=True)
    out[tok]='data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
    print(f'{tok:9}{len(b.getvalue())//1024:>4} KB', file=sys.stderr)
Path('scripts/.design3-images.json').write_text(json.dumps(out))
