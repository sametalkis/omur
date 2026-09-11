import math
from PIL import Image, ImageDraw

CREAM = (234, 227, 202, 255)
VERMILION = (206, 56, 39, 255)
DARK_VERMILION = (175, 45, 32, 255)
LIGHT_VERMILION = (225, 75, 55, 255)
CREASE_WHITE = (246, 241, 233, 230)
INK_BLACK = (25, 24, 23, 220)
GOLD = (212, 175, 55, 255)

# 1. card-2-figure (550x308)
img2 = Image.new('RGBA', (550, 308), VERMILION)
d2 = ImageDraw.Draw(img2)
card_w = 380
d2.rectangle([0, 0, card_w, 308], fill=CREAM)
# Big diamond in center-left of card
cx, cy, s = 190, 154, 135
pts = [(cx, cy - s), (cx + s, cy), (cx, cy + s), (cx - s, cy)]
d2.polygon(pts, fill=VERMILION)
d2.line([(cx - s, cy), (cx + s, cy)], fill=CREASE_WHITE, width=3)
# Small red square in bottom right of card
d2.rectangle([270, 210, 360, 308], fill=VERMILION)
img2.save('assets/plates/card-2-figure.png')

# 2. card-3-figure (276x308)
img3 = Image.new('RGBA', (276, 308), VERMILION)
d3 = ImageDraw.Draw(img3)
card_w = 230
d3.rectangle([0, 0, card_w, 308], fill=CREAM)
cx, cy, s = 115, 154, 105
pts_l = [(cx, cy - s), (cx, cy + s), (cx - s, cy)]
pts_r = [(cx, cy - s), (cx + s, cy), (cx, cy + s)]
d3.polygon(pts_l, fill=DARK_VERMILION)
d3.polygon(pts_r, fill=VERMILION)
d3.line([(cx, cy - s), (cx, cy + s)], fill=CREASE_WHITE, width=3)
d3.line([(cx - s, cy), (cx + s, cy)], fill=CREASE_WHITE, width=3)
# Small diamond at bottom-right
scx, scy, ss = 180, 260, 35
d3.polygon([(scx, scy - ss), (scx + ss, scy), (scx, scy + ss), (scx - ss, scy)], fill=VERMILION)
img3.save('assets/plates/card-3-figure.png')

# 3. card-4-figure (550x308)
img4 = Image.new('RGBA', (550, 308), VERMILION)
d4 = ImageDraw.Draw(img4)
card_w = 380
d4.rectangle([0, 0, card_w, 308], fill=CREAM)
cx, cy = 190, 160
# Big bird base shape
pts_left = [(cx, cy - 140), (cx - 105, cy - 20), (cx, cy + 130), (cx, cy)]
pts_right = [(cx, cy - 140), (cx + 105, cy - 20), (cx, cy + 130), (cx, cy)]
pts_w_l = [(cx, cy - 20), (cx - 120, cy + 80), (cx - 30, cy + 100)]
pts_w_r = [(cx, cy - 20), (cx + 120, cy + 80), (cx + 30, cy + 100)]
d4.polygon(pts_left, fill=DARK_VERMILION)
d4.polygon(pts_right, fill=VERMILION)
d4.polygon(pts_w_l, fill=LIGHT_VERMILION)
d4.polygon(pts_w_r, fill=VERMILION)
d4.line([(cx, cy - 140), (cx, cy + 130)], fill=CREASE_WHITE, width=3)
d4.line([(cx - 105, cy - 20), (cx + 105, cy - 20)], fill=CREASE_WHITE, width=3)
# Gold dot at top right of card
d4.ellipse([320, 20, 356, 56], fill=GOLD)
# Small crane at bottom right of card
scx, scy = 330, 260
d4.polygon([(scx, scy - 40), (scx - 20, scy), (scx + 20, scy)], fill=VERMILION)
img4.save('assets/plates/card-4-figure.png')

# 4. card-5-figure (550x308)
img5 = Image.new('RGBA', (550, 308), VERMILION)
d5 = ImageDraw.Draw(img5)
card_w = 380
d5.rectangle([0, 0, card_w, 308], fill=CREAM)
cx, cy = 190, 160
# Big origami crane taking shape
d5.polygon([(cx, cy - 70), (cx - 140, cy - 110), (cx - 35, cy + 60)], fill=LIGHT_VERMILION)
d5.polygon([(cx, cy - 70), (cx + 140, cy - 110), (cx + 35, cy + 60)], fill=VERMILION)
d5.polygon([(cx, cy - 70), (cx - 25, cy + 90), (cx + 25, cy + 90)], fill=DARK_VERMILION)
d5.polygon([(cx - 35, cy + 60), (cx - 100, cy + 30), (cx - 50, cy + 110)], fill=VERMILION)
d5.polygon([(cx + 35, cy + 60), (cx + 110, cy + 80), (cx + 50, cy + 120)], fill=DARK_VERMILION)
d5.line([(cx, cy - 70), (cx - 140, cy - 110)], fill=CREASE_WHITE, width=3)
d5.line([(cx, cy - 70), (cx + 140, cy - 110)], fill=CREASE_WHITE, width=3)
img5.save('assets/plates/card-5-figure.png')

# 5. card-6-figure (550x460)
img6 = Image.new('RGBA', (550, 460), VERMILION)
d6 = ImageDraw.Draw(img6)
card_w = 430
card_h = 352
d6.rectangle([0, 0, card_w, card_h], fill=CREAM)
cx, cy = card_w // 2, card_h // 2
body_pts = [(cx, cy - 25), (cx - 35, cy + 65), (cx + 35, cy + 65)]
wing_l = [(cx - 25, cy), (cx - 175, cy - 110), (cx - 50, cy + 35)]
wing_r = [(cx + 25, cy), (cx + 185, cy - 95), (cx + 55, cy + 45)]
neck = [(cx - 20, cy + 35), (cx - 120, cy - 40), (cx - 140, cy - 35), (cx - 35, cy + 65)]
tail = [(cx + 25, cy + 45), (cx + 145, cy + 80), (cx + 45, cy + 85)]

d6.polygon(wing_l, fill=LIGHT_VERMILION)
d6.polygon(wing_r, fill=VERMILION)
d6.polygon(neck, fill=DARK_VERMILION)
d6.polygon(tail, fill=DARK_VERMILION)
d6.polygon(body_pts, fill=VERMILION)
d6.line(wing_l + [wing_l[0]], fill=CREASE_WHITE, width=3)
d6.line(wing_r + [wing_r[0]], fill=CREASE_WHITE, width=3)
img6.save('assets/plates/card-6-figure.png')

print("All figure plates updated with full-size artwork!")
