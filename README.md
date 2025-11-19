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

## セキュリティ設定（推奨）

### Cloudflare Accessで認証を追加

アプリケーションへのアクセスを制限するため、Cloudflare Accessの設定を強く推奨します。

#### 手順

1. **Cloudflareダッシュボードにアクセス**
   - https://dash.cloudflare.com/ にログイン
   - 左サイドバーから「Zero Trust」をクリック

2. **Access アプリケーションを作成**
   - 「Access」→「Applications」を選択
   - 「Add an application」をクリック
   - 「Self-hosted」を選択

3. **アプリケーション設定**
   - **Application name**: `GPT-OSS Chat App`（任意）
   - **Session Duration**: `24 hours`（任意）
   - **Application domain**: あなたのWorkerのURL（例: `gpt-chat.your-subdomain.workers.dev`）
   - 「Next」をクリック

4. **ポリシー設定**
   - **Policy name**: `Allow specific users`（任意）
   - **Action**: `Allow`を選択
   - **Configure rules**: 以下のいずれかを選択
     - **Emails**: 特定のメールアドレスを入力（例: `your-email@example.com`）
     - **Email domains**: ドメイン全体を許可（例: `@your-company.com`）
     - **Everyone**: 認証されたすべてのユーザーを許可（非推奨）

5. **Identity Providers（IdP）の設定**
   - 「Settings」→「Authentication」を選択
   - 以下から認証方法を選択して「Add」:
     - **Google**: Googleアカウントでログイン
     - **GitHub**: GitHubアカウントでログイン
     - **One-time PIN**: メールでワンタイムパスワードを送信

6. **保存して有効化**
   - すべての設定を保存
   - アプリケーションにアクセスすると、認証画面が表示されます

#### 無料プランの制限

- 最大5ユーザーまで
- 月間アクティブユーザー数の制限あり
- 詳細: https://www.cloudflare.com/plans/zero-trust-services/

#### 注意事項

- Cloudflare Accessを有効にすると、すべてのアクセスが認証を要求されます
- ローカル開発（`npm run dev`）では認証は不要です
- 認証をバイパスする場合は、ダッシュボードからアプリケーションを削除または無効化してください

## 参考資料

- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [GPT-OSS 120B モデル](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/)
- [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/)
- [Cloudflare Zero Trust](https://www.cloudflare.com/zero-trust/)

## ライセンス

MIT
