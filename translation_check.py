import re
import json
from pathlib import Path
root = Path('front/app')
pattern = re.compile(r"(?<![A-Za-z0-9_$])t\(\s*(['\"])(.+?)\1")
keys = set()
for p in root.rglob('*.jsx'):
    text = p.read_text(encoding='utf-8')
    keys |= {m.group(2) for m in pattern.finditer(text)}
print('Found', len(keys), 'keys')
missing_report = {}
for lang in ['en','ar','de','es','fa','fr','it','tr']:
    trans = json.loads(Path(f'front/public/locales/{lang}/translation.json').read_text(encoding='utf-8'))
    missing = [k for k in sorted(keys) if k not in trans]
    missing_report[lang] = missing
    print(lang, 'missing', len(missing))
    for k in missing[:50]:
        print(k)
    if len(missing) > 50:
        print('...')
Path('translation_missing.json').write_text(json.dumps(missing_report, indent=2, ensure_ascii=False), encoding='utf-8')
print('Wrote translation_missing.json')
