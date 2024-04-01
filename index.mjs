import * as path from "path";
import * as glob from "glob";
import * as dotenv from "dotenv";
import * as fs from "fs/promises";
import { ResultWriter } from "./lib/result-writer.mjs";
import { OpenAiClient, AnthropicClient } from "./lib/client.mjs";

dotenv.config();

// Settings for Open AI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4-vision-preview";
const OPENAI_MAX_TOKENS = process.env.OPENAI_MAX_TOKENS ?? 256;

// Settings for Anthropic
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-3-opus-20240229";
const ANTHROPIC_MAX_TOKENS = process.env.ANTHROPIC_MAX_TOKENS ?? 256;

// Check environment
if (!OPENAI_API_KEY) {
  throw new Error("Please set OPENAI_API_KEY.");
}
if (!ANTHROPIC_API_KEY) {
  throw new Error("Please set ANTHROPIC_API_KEY.");
}

// Initialize
const logger = await ResultWriter.build();
const openAiClient = await OpenAiClient.build({
  apiKey: OPENAI_API_KEY,
  model: OPENAI_MODEL,
  maxToken: OPENAI_MAX_TOKENS,
});
const anthropicClient = await AnthropicClient.build({
  apiKey: ANTHROPIC_API_KEY,
  model: ANTHROPIC_MODEL,
  maxToken: ANTHROPIC_MAX_TOKENS,
});

// Execute for each image file
const imageFiles = glob.sync("images/*");
await Promise.all(
  imageFiles.map(async (imageFile) => {
    // 読み取ったファイル
    const buffer = await fs.readFile(imageFile);

    // 処理を実行(例外は中で処理)
    const [openAiResult, anthropicResult] = await Promise.all([
      openAiClient.callApi(buffer),
      anthropicClient.callApi(buffer),
    ]);

    // 結果を記録
    await logger.write({
      imageFileName: path.basename(imageFile),
      openAiResult: openAiResult.value,
      anthropicResult: anthropicResult.value,
      openAiConfidence: openAiResult.confidence,
      anthropicConfidence: anthropicResult.confidence,
    });
    return;
  })
);
