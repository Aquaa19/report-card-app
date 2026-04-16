// model.mjs - temporary test only
async function listModels() {
  const API_KEY = "AQ.Ab8RN6IjPBrjc361L6Xit4PzROgTMjXR-CtNAlAp9KYP9jfHDA"; // paste your real key here
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
  );
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

listModels();