from PIL import Image, ImageChops
import sys

def logical_xor(str1, str2):
    return bool(str1) ^ bool(str2)

infile1 = Image.open(sys.argv[1])
# infile1.convert("1")
infile2 = Image.open(sys.argv[2])
# infile2.convert("1")

outfile = Image.new('1', infile1.size)

for x in range(infile1.size[0]):
    for y in range(infile1.size[1]):
        # outfile.putpixel((x, y), max(infile1.getpixel((x, y)), infile2.getpixel((x, y))))

        outfile.putpixel((x, y), logical_xor(infile1.getpixel((x, y)), infile2.getpixel((x, y))))

outfile.show()

# ImageChops.logical_xor(infile1, infile2).show()
