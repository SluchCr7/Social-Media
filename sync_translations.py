import re
import json
from pathlib import Path
root = Path('front/app')
pattern = re.compile(r'(?<![A-Za-z0-9_$])t\(\s*([\'\"])(.+?)\1')
keys = set()
for p in root.rglob('*.jsx'):
    text = p.read_text(encoding='utf-8')
    keys |= {m.group(2) for m in pattern.finditer(text)}

langs = ['en','ar','de','es','fa','fr','it','tr']
translations = {}
for lang in langs:
    path = Path(f'front/public/locales/{lang}/translation.json')
    translations[lang] = json.loads(path.read_text(encoding='utf-8'))

# Fill missing keys in en with key text value, and others with en value or key text.
for key in sorted(keys):
    if key not in translations['en']:
        translations['en'][key] = key
    for lang in langs:
        if key not in translations[lang]:
            translations[lang][key] = translations['en'][key]

for lang in langs:
    path = Path(f'front/public/locales/{lang}/translation.json')
    data = {k: translations[lang][k] for k in sorted(translations[lang].keys())}
    path.write_text(json.dumps(data, indent=4, ensure_ascii=False), encoding='utf-8')
    print(f'Updated {lang}: {len(data)} keys')
