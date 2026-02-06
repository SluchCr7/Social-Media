const fs = require('fs');

function findDuplicates(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    const keys = {};
    console.log(`Checking ${filePath}...`);
    lines.forEach((line, i) => {
        const match = line.match(/^\s*"(.+)":/);
        if (match) {
            const key = match[1];
            if (keys[key]) {
                console.log(`Duplicate key found: "${key}" at line ${i + 1} (previous occurrence at line ${keys[key]})`);
            }
            keys[key] = i + 1;
        }
    });
}

findDuplicates('d:/Full-Projects/threadsV2/front/public/locales/en/translation.json');
findDuplicates('d:/Full-Projects/threadsV2/front/public/locales/fr/translation.json');
findDuplicates('d:/Full-Projects/threadsV2/front/public/locales/it/translation.json');
findDuplicates('d:/Full-Projects/threadsV2/front/public/locales/es/translation.json');
findDuplicates('d:/Full-Projects/threadsV2/front/public/locales/de/translation.json');
