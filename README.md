
# ChatGPT vs Claude3

ChatGPTとClaude3による画像読み取り結果を比較します。  

## 準備

- Node.js v18以降を推奨
- `npm install` でパッケージインストール
- OpenAI API Key, Clause API Keyを発行
- 読み取り対象にする画像を用意
  - jpg, png ~~pdf~~に対応

## 実行手順

1. 画像の配置  
読み取り対象とする画像を `images` に配置します。

2. プロンプトの準備  
prompt.txtにプロンプトを配置します。

3. APIキーの準備  
APIキーを環境変数 `OPENAI_API_KEY`, `CLAUDE_API_KEY` に配置します。  

4. 実行  
`npm run start` を実行します。


## 実行結果

画像に対する出力結果を以下のファイルにJSON形式, CSV形式で保存します。  
`results/YYYY-MM-DD-hh-mm-ss/output.json`  
`results/YYYY-MM-DD-hh-mm-ss/output.csv`


```json
{
  [
    {
      "fileName": "input-file-name",
      "openaiResult": "result of open ai",
      "claudeResult": "result of clause",
      "openaiConfidence": "Confidence for openai result",
      "clauseConfidence": "Confidence for claude result"
    },
  ]
}
```

```csv
"fileName", "openaiResult", "claudeResult", "openaiConfidence", "claudeConfidence"
"input-file-name", "result of open ai", "result for claude", "Confidence for openai result", "Confidence for claude result"
```

