const fs = require('fs');

// Paths to the input JSON files
const voicesFile = './data/Microsoft_Edge_(Windows)_voices_noGender.json';
const genderFile = './data/Microsoft_Edge_(Windows)_voices_genderData.json';

// Path to the output JSON file
const outputFile = './data/Microsoft_Edge_(Windows)_voices.json';

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
const voicesData = readJSONFile(voicesFile);
const genderData = readJSONFile(genderFile);

const lookUpGender = (lang, name) => {
  let result = ''
  genderData.forEach(g => {
    if(g.hasOwnProperty(lang) && (name.indexOf(g[lang]['name']) > -1)) {
      result = g[lang]['gender']
    }
  })
  return result
}

let outputFileContent = ''

if (voicesData && genderData) {
  outputFileContent = JSON.stringify(voicesData.map(v => {
    return {
      ...v,
      gender: lookUpGender(v.lang, v.name)
    }
  }), null, 2)
  
  fs.writeFileSync(outputFile, outputFileContent);
}
