"""Subset Alibaba PuHuiTi: include ASCII + all non-ASCII chars from site files."""
import re, os, subprocess

chars = set()
# Always include printable ASCII (0x20-0x7E)
for c in range(0x20, 0x7F):
    chars.add(c)

# Collect all non-ASCII chars from source files
for f in ['app.js', 'index.html', 'credits/index.html']:
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()
        for m in re.findall(r'\\u([0-9a-fA-F]{4})', text):
            c = int(m, 16)
            if c > 127:
                chars.add(c)
        for c in text:
            if ord(c) > 127:
                chars.add(ord(c))

unicodes_str = ','.join(f'U+{c:04X}' for c in sorted(chars))
print(f"Total codepoints: {len(chars)}")

src = '_tmp_puhuiti.ttf'
if not os.path.exists(src):
    print("Need _tmp_puhuiti.ttf - converting from woff2 first...")
    from fontTools.ttLib import TTFont
    font = TTFont('_archive/AlibabaPuHuiTi-Light.woff2')
    font.flavor = None
    font.save(src)
    font.close()

cmd = [
    'python', '-m', 'fontTools.subset', src,
    f'--unicodes={unicodes_str}',
    '--output-file=HomePageAssets/AlibabaPuHuiTi-Light-subset.woff2',
    '--flavor=woff2', '--layout-features=*',
    '--no-hinting', '--desubroutinize',
]
print("Subsetting...")
result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
if result.stderr:
    print("STDERR:", result.stderr)
print(f"Exit: {result.returncode}")
if result.returncode == 0:
    print(f"Output: {os.path.getsize('HomePageAssets/AlibabaPuHuiTi-Light-subset.woff2')/1024:.1f} KB")
