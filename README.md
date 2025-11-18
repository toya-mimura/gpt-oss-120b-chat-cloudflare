# GPT-OSS 120B Chat Application

CloudflareのWorkers AIとWorkersを使った、gpt-oss-120bモデルによるシンプルなAI Chatアプリケーション。

## 特徴

- **Cloudflare Workers AI**: `@cf/openai/gpt-oss-120b` モデルを使用
- **ダークモードUI**: 洗練されたダークテーマのチャットインターフェース
- **システムプロンプト**: カスタムシステムプロンプトを設定可能
- **会話履歴**: セッション中の会話を保持
- **レスポンシブデザイン**: デスクトップとモバイルの両方に対応

## 必要なもの

- [Cloudflare](https://cloudflare.com/)アカウント
- [Node.js](https://nodejs.org/) (v16以上)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## セットアップ

1. リポジトリをクローン:
```bash
git clone <repository-url>
cd gpt-oss-120b-chat-cloudflare
```

2. 依存関係をインストール:
```bash
npm install
```

3. Cloudflareアカウントにログイン:
```bash
npx wrangler login
```

## 開発

ローカル開発サーバーを起動:
```bash
npm run dev
```

ブラウザで `http://localhost:8787` を開いてアプリケーションにアクセスできます。

## デプロイ

Cloudflare Workersにデプロイ:
```bash
npm run deploy
```

デプロイが完了すると、アプリケーションのURLが表示されます。

## プロジェクト構造

```
.
├── src/
│   └── index.ts          # Worker APIエンドポイントとフロントエンドHTML
├── wrangler.toml          # Cloudflare Workers設定
├── package.json
├── tsconfig.json
└── README.md
```

## API エンドポイント

### `GET /`
HTMLフロントエンドを返します。

### `POST /api/chat`
チャットメッセージを処理し、AI応答を返します。

**リクエストボディ:**
```json
{
  "systemPrompt": "あなたは親切なAIアシスタントです。",
  "messages": [
    { "role": "user", "content": "こんにちは" },
    { "role": "assistant", "content": "こんにちは！どのようにお手伝いできますか？" }
  ]
}
```

**レスポンス:**
```json
{
  "response": "AIからの応答メッセージ"
}
```

## 使い方

1. アプリケーションを開く
2. 左サイドバーでシステムプロンプトを設定（オプション）
3. 下部の入力欄にメッセージを入力
4. Sendボタンをクリックまたは Enter キーで送信
5. AIからの応答を待つ

## 参考資料

- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [GPT-OSS 120B モデル](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/)

## ライセンス

MIT
