from PIL import Image, ImageDraw, ImageFont
import matplotlib.font_manager as fm
import pandas as pd
import os
import sys

NAME = str(sys.argv[1])
TASK = str(sys.argv[2])



font = ImageFont.truetype(fm.findfont(fm.FontProperties(family="DejaVu Sans")),60)

img = Image.open('certificate1.jpg')
draw = ImageDraw.Draw(img)
draw.text(xy=(725,760),text='{}'.format(NAME),fill=(0,0,0),font=font)


draw.text(xy=(725,980),text='{}'.format(TASK),fill=(0,0,0),font=font)
img.save('pictures/{}.jpg'.format(NAME))