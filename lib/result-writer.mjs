import * as fs from "fs/promises";
import { stringify } from "csv-stringify/sync";

/**
 * 画像に対する出力結果を以下のファイルにJSON形式, CSV形式で保存します。  
  `results/YYYY-MM-DD-hh-mm-ss/output.json`  
  `results/YYYY-MM-DD-hh-mm-ss/output.csv`
 */
export class ResultWriter {
  filename;

  static async build() {
    const resultWriter = new ResultWriter();

    // ファイル名に使うタイムスタンプ(YYYY-MM-DD-hh-mm-ss)を取得
    // タイムゾーンはAsia/Tokyo(JST)
    const now = new Date();
    const timestamp = now.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });
    const timestampStr = timestamp.replace(/[/ :]/g, "-");

    // ファイル名を生成
    const dir = "results";
    resultWriter.filename = `${dir}/${timestampStr}`;

    // CSVファイルのヘッダーを書き込み
    await fs.writeFile(
      `${resultWriter.filename}.csv`,
      "imageFileName,openAiResult,anthropicResult,openAiConfidence,anthropicConfidence\n"
    );

    return resultWriter;
  }

  async write({
    imageFileName,
    openAiResult,
    anthropicResult,
    openAiConfidence,
    anthropicConfidence,
  }) {
    await Promise.all([
      this.writeJson({
        imageFileName,
        openAiResult,
        anthropicResult,
        openAiConfidence,
        anthropicConfidence,
      }),
      this.writeCsv({
        imageFileName,
        openAiResult,
        anthropicResult,
        openAiConfidence,
        anthropicConfidence,
      }),
    ]);
  }

  async writeJson({
    imageFileName,
    openAiResult,
    anthropicResult,
    openAiConfidence,
    anthropicConfidence,
  }) {
    const logString =
      JSON.stringify({
        imageFileName,
        openAiResult,
        anthropicResult,
        openAiConfidence,
        anthropicConfidence,
      }) + "\n";

    await fs.appendFile(`${this.filename}.json`, logString);
  }

  async writeCsv({
    imageFileName,
    openAiResult,
    anthropicResult,
    openAiConfidence,
    anthropicConfidence,
  }) {
    const csvString = stringify(
      [
        [
          imageFileName,
          openAiResult,
          anthropicResult,
          openAiConfidence,
          anthropicConfidence,
        ],
      ],
      {
        quote: `"`,
      }
    );
    await fs.appendFile(`${this.filename}.csv`, csvString);
  }
}
