import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with large limit for image base64
app.use(express.json({ limit: "25mb" }));

// Server-side Gemini API client helper
function getGeminiClient(customKey?: string) {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Vui lòng cấu hình API Key trong Settings hoặc nhập API Key trên giao diện.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Scan Mezastar Tag API
app.post("/api/scan-tag", async (req, res) => {
  try {
    const { imageBase64, customApiKey } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 in request body" });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const ai = getGeminiClient(customApiKey);

    const systemInstruction = `You are an expert AI scanner for Pokémon Mezastar (Meza Tag) arcade tags, specially for the Vietnam / Asian release (https://world.pokemonmezastar.com/vn/tag/).

Your task is to analyze the image of a physical or digital Pokémon Mezastar tag (Meza Tag).
Look closely at the tag details:
1. Tag ID: Format like "1-2-001" through "1-2-070" or promo "R-1-1", "R-1-2", "R-1-3".
2. Pokémon Name: e.g. Kyogre, Groudon, Koraidon, Pikachu, Snorlax, Kommo-o, Gardevoir, Reshiram, Zekrom, Kyurem, Jolteon, Espeon, Leafeon, Sylveon, Lucario, Torterra, Infernape, Empoleon, Alolan Ninetales, Tyranitar, Metagross, Flapple, Appletun, Alcremie, Drednaw, Meowscarada, Skeledirge, Quaquaval, Charcadet, Frigibax, Pawmi, Turtwig, Grotle, Chimchar, Monferno, Piplup, Prinplup, Vaporeon, Flareon, Umbreon, Glaceon, Yamper, Boltund, Pidgey, Pidgeotto, Pidgeot, Alolan Sandshrew, Alolan Sandslash, Bronzor, Bronzong, Trapinch, Vibrava, Flygon, Wingull, Pelipper, Jynx, Abra, Kadabra, Alakazam, Drifloon, Drifblim, Mareanie, Togedemaru, Ralts, Kirlia, Onix, etc.
3. Grade / Stars (2 to 6):
   - 6 Stars (Superstar): Black tag body with sparkling gold/purple borders, 6 stars.
   - 5 Stars (Star): Red/Bright Red tag body with 5 stars.
   - 4 Stars: Blue tag body with 4 stars.
   - 3 Stars: Yellow tag body with 3 stars.
   - 2 Stars: Green / Grey tag body with 2 stars.
   - Promo / Special (R-1-x): Clear / Translucent or Red special Starter tags.
4. Special Mechanic: "Dynamax", "Gigantamax", "Mega Evolution", "Z-Move", "Terastal", "Chain Attack", "Double", or "None".
5. Is Valid Tag: true if a Pokémon Mezastar tag is detected, false if it is a completely unrelated image.

Even if the image is slightly blurry, angled, or cropped, do your best to detect the Pokémon and match it with the closest official Mezastar Tag ID and Grade.

Return strictly in the specified JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: "image/jpeg",
            },
          },
          {
            text: "Identify this Pokémon Mezastar Tag. Read the Tag ID, Pokémon Name, Star Grade (2-6), Special Mechanic, and determine if it's a valid Mezastar Tag.",
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_valid_tag: {
              type: Type.BOOLEAN,
              description: "Whether the image contains a Pokémon Mezastar Tag",
            },
            tag_id: {
              type: Type.STRING,
              description: "The Mezastar Tag ID (e.g. 1-2-001, 1-2-015, R-1-1)",
            },
            name: {
              type: Type.STRING,
              description: "The name of the Pokémon (e.g. Kyogre, Mega Lucario, Pikachu)",
            },
            grade: {
              type: Type.INTEGER,
              description: "Star rating of the tag from 2 to 6",
            },
            special_mechanic: {
              type: Type.STRING,
              description: "Special move/mechanic: Dynamax, Mega Evolution, Z-Move, Terastal, None",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence level between 0.0 and 1.0",
            },
            detected_features: {
              type: Type.STRING,
              description: "Brief note of visual features seen (tag color, artwork, text)",
            },
          },
          required: ["is_valid_tag", "tag_id", "name", "grade"],
        },
      },
    });

    const responseText = response.text || "{}";
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText.trim());
    } catch {
      parsedResult = {
        is_valid_tag: false,
        tag_id: "",
        name: "Unknown",
        grade: 0,
      };
    }

    return res.json({
      success: true,
      data: parsedResult,
    });
  } catch (error: any) {
    console.error("Gemini Scan Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Không thể phân tích ảnh thẻ Mezastar.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎮 Pokémon Mezastar VN Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
