# 開発・環境構築ガイド (Development Guide)

本ドキュメントは、「獅子まんま 検索システム」のコードベースを触る開発者（将来のメンテナーを含む）に向けたマニュアルです。
本システムはCloudflareエコシステム（Pages \+ D1）に強く依存しており、フロントエンドとバックエンドが密接に連携しているため、一般的なReact SPAとはローカル環境の立ち上げ手順が異なります。

## 前提条件 (Prerequisites)

ローカル環境を構築する前に、以下のツールが適切にインストールされ、動作することを確認してください。

* **Node.js**: `v20` 以上を推奨
* **pnpm**: 本プロジェクトのパッケージマネージャー
* **Wrangler**: Cloudflareの公式CLIツール

### バージョンについて

以下のバージョンでの動作を確認しています。

* **Node.js**: v25.8.2
* **pnpm**: 10.33.0
* **Wrangler**: 4.83.0

## ディレクトリ構造とアーキテクチャ

システム全体の構造を論理的に把握するためのマップです。

```bash
gourmet-search/
├── src/                   # フロントエンド (React + Vite) のメインディレクトリ
│   ├── components/        # UIの最小単位
│   ├── utils/             # 純粋なロジック層
│   └── App.jsx            # アプリケーションの状態管理、フィルターロジック、データ取得
├── functions/             # バックエンド (Cloudflare Pages Functions)
│   └── api/
│       └── master-data.js # DBからデータを取得しJSONを返すAPIエンドポイント
├── init.sql               # D1データベースのテーブル定義
├── wrangler.toml          # Cloudflare (D1のバインディング等) の設定ファイル
└── vite.config.js         # フロントエンドのビルド設定
```

## ローカル環境の構築プロセス

本システムをローカルで完全に動作させるには、「フロントエンドのビルド」と「バックエンドAPI＋ローカルDBのエミュレート」の両方が必要です。

### Step 1: 依存関係のインストール

まずはプロジェクトに必要な外部ライブラリをすべて取得します。

```bash
pnpm install
```

### Step 2: D1データベースのローカルセットアップ

本システムは Cloudflare D1 (SQLite互換） を使用しています。ローカル開発時は、WranglerがPC内のディスク（.wrangler ディレクトリ配下）にSQLiteファイルを生成し、データベースをエミュレートします。

`init.sql` を実行し、テーブル作成とテストデータの流し込みを行います。

```bash
npx wrangler d1 execute DB --local --file=./init.sql
```

**Note**: `--local` フラグをつけることで、本番環境のDBには影響を与えず、プロジェクト内の .wrangler/ ディレクトリ配下にローカルSQLiteファイルが生成されます。

### 開発サーバーの起動

**【重要】本プロジェクトでは pnpm dev は通常使用しません。**

フロントエンドとバックエンドが密接に連携しているため、以下のコマンドで両方を統合した開発サーバーを起動してください。

```bash
pnpm run preview
```

**内部的な挙動**: このコマンドは wrangler pages dev を実行します。Wranglerがプロキシとして動作し、フロントエンドのリクエストはViteへ、/api へのリクエストはFunctionsへと自動的に振り分けます。これにより、本番環境とほぼ同一のルーティング環境で開発が可能になります。

## 本番環境（Production）の構成と運用

本番環境は Cloudflare のエッジネットワーク上で動作しており、以下のコンポーネントで構成されています。

### インフラ構成

* **Cloudflare Pages**: ビルドされた静的ファイル（HTML, JS, CSS）をホスティングします。
* **Pages Functions**: `/api/*` へのリクエストを処理するサーバーレス関数。
* **Cloudflare D1**: SQLデータベース。`wrangler.toml` の `database_id` に基づいて Pages とバインドされています。

### 本番環境へのデプロイ

Cloudflare上でGitHubリポジトリとの紐づけが完了している場合、Pushするだけで自動ビルドが実行されます。しかし手動でコードの変更を本番に反映させる際は、以下のコマンドを実行します。

```bash
pnpm run deploy
```

**内部処理**: `vite build` によって成果物が `dist/` に書き出された後、Wranglerがその内容をCloudflareのストレージへアップロードし、全世界へ配信を開始します。

### 本番DBに対する直接操作（注意）

本番の価格データや店舗情報の修正を行う場合は、`--remote` フラグを使用します。

```bash
# 本番DBのレコード数を確認（接続テスト）
npx wrangler d1 execute DB --remote --command="SELECT COUNT(*) FROM foodList"

# 特定のレコードを更新する場合
npx wrangler d1 execute DB --remote --command="UPDATE foodList SET price = 1500 WHERE id = 'PXXXXX'"
```

**⚠️ 警告**: `--remote` 操作は本番環境のライブデータに即座に反映されます。 誤ったクエリはデータの破損や不整合を引き起こす可能性があるため、十分に注意して実行してください。

## 環境変数とバインディング

本番環境とローカル環境の接続は `wrangler.toml` で定義されています。

* **D1 Binding**: `binding = "DB"`と定義されているため、バックエンドコード内では `context.env.DB` としてアクセスされます。
  * ローカル開発時は Wrangler が自動的にローカルの SQLite をこの名前に割り当てます。
