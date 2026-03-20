"""Subset Alibaba PuHuiTi: include ASCII + all non-ASCII chars from site files."""
import re, os, subprocess, glob

chars = set()
# Always include printable ASCII (0x20-0x7E)
for c in range(0x20, 0x7F):
    chars.add(c)

# Scan all HTML and JS files (excluding irrelevant dirs and react bundles)
exclude_dirs = {'_archive', 'node_modules', '.git', 'Projects/CForge', 'Projects/LSimulator'}
scan_files = []
for pattern in ['**/*.html', '**/*.js']:
    for f in glob.glob(pattern, recursive=True):
        f_norm = f.replace('\\', '/')
        if any(f_norm.startswith(ex + '/') or f_norm.startswith(ex.replace('/', '\\') + '\\') for ex in exclude_dirs):
            continue
        basename = os.path.basename(f)
        if basename in ('react-dom.production.min.js', 'react.production.min.js'):
            continue
        scan_files.append(f)

print(f"Scanning {len(scan_files)} files...")
for f in sorted(scan_files):
    print(f"  {f}")

# Collect all non-ASCII chars from source files
for f in scan_files:
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
print(f"\nTotal codepoints: {len(chars)}")

# Save unicode list for reference
with open('_subset_unicodes.txt', 'w', encoding='utf-8') as fh:
    for c in sorted(chars):
        if c > 127:
            fh.write(f'U+{c:04X}  {chr(c)}\n')

# Subset directly from woff2 source
src = '_archive/AlibabaPuHuiTi-Light.woff2'
if not os.path.exists(src):
    print(f"ERROR: Source font not found: {src}")
    exit(1)

cmd = [
    'python', '-m', 'fontTools.subset', src,
    f'--unicodes={unicodes_str}',
    '--output-file=HomePageAssets/AlibabaPuHuiTi-Light-subset.woff2',
    '--flavor=woff2', '--layout-features=*',
    '--no-hinting', '--desubroutinize',
]
print("Subsetting...")
result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
if result.stderr:
    print("STDERR:", result.stderr)
print(f"Exit: {result.returncode}")
if result.returncode == 0:
    size = os.path.getsize('HomePageAssets/AlibabaPuHuiTi-Light-subset.woff2')
    print(f"Output: {size/1024:.1f} KB ({size} bytes)")
