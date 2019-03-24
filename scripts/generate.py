import json
from json import JSONDecodeError

from PIL import Image

import random
import sys


image = Image.open(sys.argv[1])
num, word = sys.argv[1].split("/")[-1].split(".")[0].split("_")

size_x = 200
size_y = 200

outfile1 = Image.new("1", [size_x, size_y])

outfile2 = Image.new("1", [dimension * 2 for dimension in image.size])

offset_x = random.randint(1, size_x - outfile2.size[0] - 1)
offset_y = random.randint(1, size_y - outfile2.size[1] - 1)

if offset_x % 2 != 0:
    offset_x -= 1

if offset_y % 2 != 0:
    offset_y -= 1

# print(offset_x, offset_y)

for x in range(0, int(outfile1.size[0] / 2)):
    # if not (offset_x + outfile2.size[0] < x < offset_x):
    #     continue

    for y in range(0, int(outfile1.size[1] / 2)):
        # if not (offset_y + outfile2.size[1] < x < offset_y):
        #     continue

        # fake_x = random.randint(0, image.size[0] - 1)
        # fake_y = random.randint(0, image.size[1] - 1)
        # sourcepixel = image.getpixel((fake_x, fake_y))

        coinflip = random.random()
        if random.random() < 0.5:
            if coinflip < .5:
                outfile1.putpixel((x * 2, y * 2), 1)
                outfile1.putpixel((x * 2 + 1, y * 2), 0)
                outfile1.putpixel((x * 2, y * 2 + 1), 0)
                outfile1.putpixel((x * 2 + 1, y * 2 + 1), 1)
            else:
                outfile1.putpixel((x * 2, y * 2), 0)
                outfile1.putpixel((x * 2 + 1, y * 2), 1)
                outfile1.putpixel((x * 2, y * 2 + 1), 1)
                outfile1.putpixel((x * 2 + 1, y * 2 + 1), 0)
        else:
            if coinflip < .5:
                outfile1.putpixel((x * 2, y * 2), 1)
                outfile1.putpixel((x * 2 + 1, y * 2), 0)
                outfile1.putpixel((x * 2, y * 2 + 1), 0)
                outfile1.putpixel((x * 2 + 1, y * 2 + 1), 1)
            else:
                outfile1.putpixel((x * 2, y * 2), 0)
                outfile1.putpixel((x * 2 + 1, y * 2), 1)
                outfile1.putpixel((x * 2, y * 2 + 1), 1)
                outfile1.putpixel((x * 2 + 1, y * 2 + 1), 0)

for x in range(0, image.size[0]):
    for y in range(0, image.size[1]):
        sourcepixel = image.getpixel((x, y))

        coinflip = random.random()
        if sourcepixel == 1:
            if coinflip < .5:
                outfile1.putpixel((x * 2 + offset_x, y * 2 + offset_y), 1)
                outfile1.putpixel((x * 2 + 1 + offset_x, y * 2 + offset_y), 0)
                outfile1.putpixel((x * 2 + offset_x, y * 2 + 1 + offset_y), 0)
                outfile1.putpixel((x * 2 + 1 + offset_x, y * 2 + 1 + offset_y), 1)

                outfile2.putpixel((x * 2, y * 2), 0)
                outfile2.putpixel((x * 2 + 1, y * 2), 1)
                outfile2.putpixel((x * 2, y * 2 + 1), 1)
                outfile2.putpixel((x * 2 + 1, y * 2 + 1), 0)
            else:
                outfile1.putpixel((x * 2 + offset_x, y * 2 + offset_y), 0)
                outfile1.putpixel((x * 2 + 1 + offset_x, y * 2 + offset_y), 1)
                outfile1.putpixel((x * 2 + offset_x, y * 2 + 1 + offset_y), 1)
                outfile1.putpixel((x * 2 + 1 + offset_x, y * 2 + 1 + offset_y), 0)

                outfile2.putpixel((x * 2, y * 2), 1)
                outfile2.putpixel((x * 2 + 1, y * 2), 0)
                outfile2.putpixel((x * 2, y * 2 + 1), 0)
                outfile2.putpixel((x * 2 + 1, y * 2 + 1), 1)
        elif sourcepixel == 0:
            if coinflip < .5:
                outfile1.putpixel((x * 2 + offset_x, y * 2 + offset_y), 1)
                outfile1.putpixel((x * 2 + 1 + offset_x, y * 2 + offset_y), 0)
                outfile1.putpixel((x * 2 + offset_x, y * 2 + 1 + offset_y), 0)
                outfile1.putpixel((x * 2 + 1 + offset_x, y * 2 + 1 + offset_y), 1)

                outfile2.putpixel((x * 2, y * 2), 1)
                outfile2.putpixel((x * 2 + 1, y * 2), 0)
                outfile2.putpixel((x * 2, y * 2 + 1), 0)
                outfile2.putpixel((x * 2 + 1, y * 2 + 1), 1)
            else:
                outfile1.putpixel((x * 2 + offset_x, y * 2 + offset_y), 0)
                outfile1.putpixel((x * 2 + 1 + offset_x, y * 2 + offset_y), 1)
                outfile1.putpixel((x * 2 + offset_x, y * 2 + 1 + offset_y), 1)
                outfile1.putpixel((x * 2 + 1 + offset_x, y * 2 + 1 + offset_y), 0)

                outfile2.putpixel((x * 2, y * 2), 0)
                outfile2.putpixel((x * 2 + 1, y * 2), 1)
                outfile2.putpixel((x * 2, y * 2 + 1), 1)
                outfile2.putpixel((x * 2 + 1, y * 2 + 1), 0)

outfile1.save('%s_back.png' % num)
outfile2.save('%s_front.png' % num)

try:
    data = json.load(open("data.json", "r+"))
except JSONDecodeError:
    data = {
        'images': {}
    }

data['images'][num] = {
    'word': word,
    'word_len': len(word),
    'num': num,
    'offset': (offset_x, offset_y)
}

data = json.dump(data, open("data.json", "w+"))
