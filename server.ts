/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Setup Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API endpoint for Oracle
  app.post('/api/oracle', async (req, res) => {
    try {
      const { question, discoveredList, triedReactionsList } = req.body;
      if (!ai) {
        return res.json({
          answer: "神の託宣（AI）への接続キーが設定されていません。AI StudioのSettings > SecretsからGEMINI_API_KEYを設定してください。"
        });
      }

      const prompt = `
あなたは科学と合成のピクセル調サンドボックスゲーム「Science Synthesis Sandbox (科学と合成のサンドボックス)」の「全知全能の創造神（AI Oracle）」です。
プレイヤーは神の立場であり、様々な物質をタイピングして降らせ、下に積もった物質と反応させることで、新たな物質を発見し、最終的に「生命（Life）」や「宇宙（Universe）」を創造することを目指しています。

【ゲーム仕様と進め方】
- プレイヤーは画面下部、またはキーボードで物質の英語名（例: "water", "fire", "silicon", "obsidian"）をタイピングすることで、その物質のピクセルを上空から落下させます。
- 物質同士が接触すると、合成や反応（例: Water + Fire -> Steam, Water + Electricity -> Oxygen & Hydrogen）が起こります。
- 新しく発見（discovered）された物質は、その物質を「すべての合成式（用途）」で一度でも反応物の片側（Reactant）として使用すると、完全に「アンロック」され、プレイヤー自身がタイプして落とせるようになります。
- 最終的な究極の目標は、生命を誕生させ、さらに「恒星（Star）」や「惑星（Planet）」、「ブラックホール（Black Hole）」などを経て、究極の「宇宙（Universe）」を創造することです。

【現在のプレイヤーの進行状況】
- 現在までに発見した物質: [${discoveredList ? discoveredList.join(', ') : 'なし'}]
- 現在までに試した反応: [${triedReactionsList ? triedReactionsList.join(', ') : 'なし'}]

【プレイヤーからの質問・相談】
「${question}」

【回答のガイドライン（厳守）】
1. プレイヤーを「大いなる創造主」や「若き神」と呼び、荘厳でありながら親しみやすくユーモラスな「万物の創造主」の口調（日本語）で回答してください。
2. 科学的な知識や雑学（英語名の由来、化学的な性質、現実の科学現象など）を優しく説明してください。
3. 次なる合成へのヒントを謎かけやヒントとして与えてください（例：「熱い溶岩を冷やすには、あの青い液体をかけるのだ」や「半導体に金属を組み合わせると、現代を支配する電子の脳（マイクロチップ）ができるだろう」など）。直接答えをバラしすぎないようにしてください。
4. 英語学習の要素（単語のスペル、意味）をさりげなくアピール・賞賛してください。
5. 回答は150〜250文字程度のすっきりした長さでまとめてください。
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      res.json({ answer: response.text });
    } catch (error: any) {
      console.error('Error in Oracle API:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    console.log('Starting Vite in middleware mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Serving built static files in production...');
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Server startup error:', error);
});
