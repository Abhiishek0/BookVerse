import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Set up server-side Gemini client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client successfully initialized server-side.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client: ", err);
  }
} else {
  console.log("No GEMINI_API_KEY defined. Server will run with smart natural-language fallback recommendations.");
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Intelligent AI Recommendations Route (Gemini powered or smart fallback)
app.post("/api/ai-recommend", async (req, res) => {
  const { prompt, currentBookId, readingStyle } = req.body;

  if (!prompt && !currentBookId) {
    return res.status(400).json({ error: "No query parameters provided" });
  }

  // Define some fallbacks in case Gemini is offline or not key'd
  const fallbacks = [
    {
      suggestedBookId: "chambers-of-secrets",
      analysis: "Based on your interest in immersive mythology, Kenara Legalen's prose matches your seeking for ancient sorcery secrets and forgotten passages.",
      confidence: 0.96,
      thoughtTrail: "Deep, gothic themes alignment with mysterious folklore elements."
    },
    {
      suggestedBookId: "fire-and-blood",
      analysis: "For a reader fascinated with imperial lore and dynamic warfare, George R.R. Martin's extensive world chronicles deliver supreme epic historical content.",
      confidence: 0.94,
      thoughtTrail: "Exploration of dark high fantasy and legendary political dynasties."
    },
    {
      suggestedBookId: "coailty-reit",
      analysis: "Your interest in structural philosophies and material trade paradigms maps closely to Docoorst's Socio-Economic thesis.",
      confidence: 0.89,
      thoughtTrail: "Theoretical analysis of trust, value, and collective belief structures."
    },
    {
      suggestedBookId: "the-fumber",
      analysis: "For cognitive exploration and quiet psychological landscapes, Scowlen's short phrases capture human vulnerabilities nicely.",
      confidence: 0.88,
      thoughtTrail: "Minimalist prose focusing on memory and silent interpersonal regrets."
    }
  ];

  if (ai) {
    try {
      const userInstruction = prompt 
        ? `You are an elite, premium literary concierge for BookVerse. The user asks: "${prompt}". Suggest one of these exact books with their ID in database:
          1. "chambers-of-secrets" (The Chambers of Secrets - elegant sorcery, mystery)
          2. "the-fumber" (The Fumber - cognitive memory landscape, philosophy)
          3. "coailty-reit" (Coailty Reit - socio-economic structures, trust)
          4. "fire-and-blood" (Fire & Blood - ancient dragons, political warfare)
          5. "kinille-goife" (Kinille & Goife - minimalist short stories, still life)
          6. "the-slamon-road" (The Slamon Road - geographical odyssey, spirituality)

          Give a luxurious, concise explanation (2-3 sentences) why this matches. Ensure you output valid JSON only.`
        : `Suggest a related premium book for a user currently reading book ID: "${currentBookId}". Return JSON matching one of our database book IDs listed above with reasons.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userInstruction,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedBookId: { type: Type.STRING, description: "Must be exactly one of the 6 book IDs" },
              analysis: { type: Type.STRING, description: "Concise luxury tone analysis for the recommendation" },
              confidence: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0" },
              thoughtTrail: { type: Type.STRING, description: "Concise reasoning path" }
            },
            required: ["suggestedBookId", "analysis", "confidence"]
          }
        }
      });

      if (response && response.text) {
        const result = JSON.parse(response.text.trim());
        return res.json(result);
      }
    } catch (err: any) {
      console.error("Gemini invocation failed, falling back to smart local logic.", err.message);
    }
  }

  // Smart natural matching logic as high-fidelity fallback
  let selection = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  if (prompt) {
    const p = prompt.toLowerCase();
    if (p.includes("dragon") || p.includes("blood") || p.includes("history") || p.includes("war")) {
      selection = fallbacks[1]; // Fire & blood
    } else if (p.includes("secret") || p.includes("magic") || p.includes("fantasy") || p.includes("wizard")) {
      selection = fallbacks[0]; // Chambers of secrets
    } else if (p.includes("money") || p.includes("economics") || p.includes("society") || p.includes("trust")) {
      selection = fallbacks[2]; // Coailty Reit
    } else if (p.includes("philosophy") || p.includes("mind") || p.includes("memory") || p.includes("quiet")) {
      selection = fallbacks[3]; // The fumber
    }
  }

  return res.json(selection);
});

// Serve frontend SPA in production if Vite is not in middleware mode
// We handle development server using Vite middleware or static delivery
const isProduction = process.env.NODE_ENV === "production";

async function runServer() {
  if (!isProduction) {
    // Vite server integration
    const createViteServer = (await import("vite")).createServer;
    const viteInst = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteInst.middlewares);
  } else {
    // Production files distribution
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to 0.0.0.0 and port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BookVerse Express + Vite Server] active on http://localhost:${PORT}`);
  });
}

runServer().catch((err) => {
  console.error("Vite server launch failed: ", err);
});
