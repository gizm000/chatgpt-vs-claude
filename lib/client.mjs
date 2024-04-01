import * as fs from "fs/promises";
import { OpenAI } from "openai";

class GenerativeAiClient {
  apiKey;
  model;
  maxToken;
  prompt;

  /**
   * APIを呼び出す
   * @returns {Promise<{value: string, confidence: number}>}
   */
  async callApi(image) {
    throw new Error("Not implemented");
  }
}

export class OpenAiClient extends GenerativeAiClient {
  client;

  static async build({ apiKey, model, maxToken }) {
    const client = new OpenAiClient();

    client.apiKey = apiKey;
    client.model = model;
    client.maxToken = maxToken;

    client.prompt = await fs.readFile("prompt.txt", "utf-8");

    client.client = new OpenAI({
      apiKey: apiKey,
      maxRetries: 3,
      // defaultは10分だが長すぎるので5分にしておく
      // timeout: 60 * 5,
    });

    return client;
  }

  async callApi(image) {
    const base64Str = image.toString("base64");

    try {
      const completion = await this.client.chat.completions.create({
        max_tokens: this.OPENAI_MAX_TOKENS,
        model: this.OPENAI_MODEL || "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: this.prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Str}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
      });
      const content = completion.choices[0].message.content;
      const jsonMatched = content
        .replace(/\\n/g, "")
        .replace(/\`\`\`/g, "")
        .match(/\{.*\}/s);
      const jsonStr = jsonMatched ? jsonMatched[0] : "";
      return {
        value: jsonStr,
        confidence: 0,
      };
    } catch (e) {
      console.error(e);
      return {
        value: "Error",
        confidence: 0,
      };
    }
  }
}

export class AnthropicClient extends GenerativeAiClient {
  static async build({ apiKey, model, maxToken }) {
    const client = new AnthropicClient();
    client.apiKey = apiKey;
    client.model = model;
    client.maxToken = maxToken;

    client.prompt = await fs.readFile("prompt.txt", "utf-8");

    return client;
  }

  async callApi(image) {
    return {
      value: "dummy",
      confidence: 0.5,
    };
  }
}
