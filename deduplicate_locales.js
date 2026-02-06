const fs = require('fs');
const path = require('path');

function deduplicate(filePath) {
    console.log(`Deduplicating ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const keys = {};
    const resultLines = [];

    // Pattern to match "key": "value"
    const pattern = /^\s*"([^"]+)":\s*(.*)$/;

    // We want to keep the LAST occurrence.
    // So we iterate backwards or just store the last seen index for each key.
    const lastOccurrence = {};
    lines.forEach((line, index) => {
        const match = line.match(pattern);
        if (match) {
            const key = match[1];
            lastOccurrence[key] = index;
        }
    });

    lines.forEach((line, index) => {
        const match = line.match(pattern);
        if (match) {
            const key = match[1];
            if (lastOccurrence[key] === index) {
                resultLines.push(line);
            } else {
                console.log(`  Removing duplicate key: "${key}" at line ${index + 1}`);
            }
        } else {
            // Keep brackets, commas, empty lines
            resultLines.push(line);
        }
    });

    // Fix trailing commas if necessary (optional but good)
    // Actually, if we remove a line, we might leave a trailing comma where it shouldn't be or remove one.
    // But since we are keeping the LAST occurrence, the last item in the object shouldn't have a comma.

    fs.writeFileSync(filePath, resultLines.join('\n'), 'utf8');
}

const localesDir = path.join(__dirname, 'front', 'public', 'locales');
const languages = ['en', 'es', 'de', 'fr', 'it'];

languages.forEach(lang => {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
        deduplicate(filePath);
    }
});
