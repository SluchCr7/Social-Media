import re
from pathlib import Path
pattern = re.compile(r"t\(\s*(['\"])(.+?)\1")
for p in Path('front/app').rglob('*.jsx'):
    text = p.read_text(encoding='utf-8')
    for m in pattern.finditer(text):
        value = m.group(2)
        if ('./' in value or '@/' in value or '/' in value) and len(value) > 10:
            print(p, value)
