from PIL import Image, ImageDraw

CREAM = (234, 227, 202, 255)
VERMILION = (206, 56, 39, 255)
DARK_VERMILION = (175, 45, 32, 255)
LIGHT_VERMILION = (225, 75, 55, 255)
CREASE_WHITE = (246, 241, 233, 230)
INK_BLACK = (25, 24, 23, 220)

# 1. card-6-figure (550x460)
img6 = Image.new('RGBA', (550, 460), VERMILION)
d6 = ImageDraw.Draw(img6)
# Card rectangle in top-left
card_w = int(215 * 2) # 430
card_h = int(176 * 2) # 352
d6.rectangle([0, 0, card_w, card_h], fill=CREAM)

# Draw origami crane centered inside the card
cx, cy = card_w // 2, card_h // 2
body_pts = [(cx, cy - 20), (cx - 25, cy + 50), (cx + 25, cy + 50)]
wing_l = [(cx - 20, cy), (cx - 130, cy - 80), (cx - 35, cy + 25)]
wing_r = [(cx + 20, cy), (cx + 140, cy - 70), (cx + 40, cy + 35)]
neck = [(cx - 15, cy + 25), (cx - 90, cy - 30), (cx - 105, cy - 25), (cx - 25, cy + 50)]
tail = [(cx + 20, cy + 35), (cx + 110, cy + 60), (cx + 35, cy + 65)]

d6.polygon(wing_l, fill=LIGHT_VERMILION)
d6.polygon(wing_r, fill=VERMILION)
d6.polygon(neck, fill=DARK_VERMILION)
d6.polygon(tail, fill=DARK_VERMILION)
d6.polygon(body_pts, fill=VERMILION)
d6.line(wing_l + [wing_l[0]], fill=CREASE_WHITE, width=2)
d6.line(wing_r + [wing_r[0]], fill=CREASE_WHITE, width=2)
d6.line([(cx - 20, cy), (cx - 130, cy - 80)], fill=CREASE_WHITE, width=2)
img6.save('assets/plates/card-6-figure.png')

# 2. Diagrams
def make_diagram(w, h, card_right_x, card_bottom_y, pattern):
    img = Image.new('RGBA', (w, h), VERMILION)
    d = ImageDraw.Draw(img)
    # Draw cream card area at the top
    d.rectangle([0, 0, card_right_x, card_bottom_y], fill=CREAM)
    
    # Draw crease pattern inside cream area
    side = card_bottom_y - 8
    if side > 10:
        bx = (card_right_x - side) // 2
        by = (card_bottom_y - side) // 2
        d.rectangle([bx, by, bx + side, by + side], outline=INK_BLACK, width=2)
        if pattern == 'cross':
            d.line([(bx, by + side//2), (bx + side, by + side//2)], fill=INK_BLACK, width=1)
            d.line([(bx + side//2, by), (bx + side//2, by + side)], fill=INK_BLACK, width=1)
        elif pattern == 'diagonal':
            d.line([(bx, by), (bx + side, by + side)], fill=INK_BLACK, width=1)
            d.line([(bx + side, by), (bx, by + side)], fill=INK_BLACK, width=1)
        elif pattern == 'star':
            d.line([(bx, by + side//2), (bx + side, by + side//2)], fill=INK_BLACK, width=1)
            d.line([(bx + side//2, by), (bx + side//2, by + side)], fill=INK_BLACK, width=1)
            d.line([(bx, by), (bx + side, by + side)], fill=INK_BLACK, width=1)
            d.line([(bx + side, by), (bx, by + side)], fill=INK_BLACK, width=1)
        elif pattern == 'full':
            d.line([(bx, by + side//2), (bx + side, by + side//2)], fill=INK_BLACK, width=1)
            d.line([(bx + side//2, by), (bx + side//2, by + side)], fill=INK_BLACK, width=1)
            d.line([(bx, by), (bx + side, by + side)], fill=INK_BLACK, width=1)
            d.line([(bx + side, by), (bx, by + side)], fill=INK_BLACK, width=1)
            d.polygon([(bx + side//2, by), (bx + side, by + side//2), (bx + side//2, by + side), (bx, by + side//2)], outline=INK_BLACK, width=1)
    return img

make_diagram(550, 154, 550, 48, 'cross').save('assets/plates/card-2-diagram.png')
make_diagram(276, 154, 244, 48, 'diagonal').save('assets/plates/card-3-diagram.png')
make_diagram(550, 154, 550, 48, 'star').save('assets/plates/card-4-diagram.png')
make_diagram(276, 154, 276, 48, 'full').save('assets/plates/card-5-diagram.png')

print("Fix plates done")
