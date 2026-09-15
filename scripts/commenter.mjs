import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY");
  process.exit(1);
}

const prompt = `You are a senior engineering instructor. 
I will provide you with a TypeScript/React file.
You must return the EXACT SAME file, but with educational comments added.
1. Add a top-level JSDoc block comment explaining what the file does, its role in the system, and WHY it is special.
2. Add inline comments to important or complex lines explaining what they do in simple English.
3. DO NOT change ANY existing logic, imports, variables, or structure.
4. DO NOT wrap the output in markdown code blocks like \`\`\`typescript. RETURN ONLY RAW TEXT so I can save it directly to a file.
5. If the file already has extensive comments, just return it as is.`;

async function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Removed skip logic for test

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          { text: "Here is the file:\n\n" + content }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
    }
  };

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error(`API Error on ${filePath}: ${res.status} ${res.statusText}`);
        console.error(`Details: ${errText}`);
        return;
    }

    const data = await res.json();
    let generated = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (generated) {
      // Strip markdown if it still added it
      generated = generated.replace(/^```(?:typescript|ts|javascript|js)?\n/i, '');
      generated = generated.replace(/\n```$/i, '');
      
      fs.writeFileSync(filePath, generated.trim() + '\n', 'utf-8');
      console.log(`Successfully commented ${filePath}`);
    } else {
        console.log(`No content returned for ${filePath}`);
    }
    
    // Sleep to avoid rate limits
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
      console.error(`Error processing ${filePath}: ${err.message}`);
  }
}

async function run() {
    // Let's test on one file first
    const testFile = path.join(process.cwd(), 'backend', 'db.ts');
    await processFile(testFile);
}

run();
