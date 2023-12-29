const fs = require('fs');

// Paths to the input JSON files
const file1 = './data/Google_Chrome_(Linux)_voices.json'
const file2 = './data/Google_Chrome_(Windows)_voices.json'
const file3 = './data/Microsoft_Edge_(Windows)_voices.json'
const file4 = './data/Mozilla_Firefox_(Windows)_voices.json'

// Path to the output JSON file
const outputFile = './data/speech-synthesis-voices-data.json';

// Function to read JSON file
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading JSON file ${filePath}: ${err}`);
    return null;
  }
};

// Read input JSON files
const file1Data = readJSONFile(file1)
const file2Data = readJSONFile(file2)
const file3Data = readJSONFile(file3)
const file4Data = readJSONFile(file4)

const merged = [
  ...file1Data,
  ...file2Data,
  ...file3Data,
  ...file4Data,
]

let output = {}

const findDialectAndName = (lang, dialect, name) => {
  let result = -1
  output[lang].forEach((item, i) => {
    if (item['dialect'] === dialect && item['name'] === name)
      result = i
  })
  return result
}

merged.forEach(item => {
  const lang = item.lang.match(/[a-zA-Z]+(?=(-|$))/)[0]
  const dashIdx = item.lang.indexOf('-') 
  const dialect = dashIdx > -1 ? item.lang.slice(dashIdx + 1) : '' 
  if (!output.hasOwnProperty(lang)) {
    output[lang] = []
  }
  const DANIndex = findDialectAndName(lang, dialect, item.name)
  if (DANIndex < 0) {
    output[lang].push({
      dialect,
      name: item.name,
      gender: item.gender,
      compatibility: [{
        os: item.os,
        browser: item.browser,
        uri: item.uri,
      }]
    })
  }
  else {
    output[lang][DANIndex]['compatibility'].push({
      os: item.os,
      browser: item.browser,
      uri: item.uri,
    })
  }
})

const ordered = Object.keys(output).sort().reduce(
  (obj, key) => { 
    obj[key] = output[key]; 
    return obj;
  }, 
  {}
);

fs.writeFileSync(outputFile, JSON.stringify(ordered, null, 2));
