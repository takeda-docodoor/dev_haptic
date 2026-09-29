# dev_haptic

ボタンをタップするとスマホが振動（ハプティックフィードバック）する Web デモ。
[Next.js](https://nextjs.org) と [web-haptics](https://github.com/lochie/web-haptics) で実装している。

## 対応環境

| プラットフォーム | 対応 | 仕組み |
| --- | --- | --- |
| iOS | iOS 18 以降の Safari | `<input type="checkbox" switch>` のトグル時の触覚フィードバックを利用 |
| Android | Chrome など Vibration API 対応ブラウザ | `navigator.vibrate` |
| iPad・PC | 非対応 | 振動しない |

## 構成

| ファイル | 役割 |
| --- | --- |
| `src/app/haptic-pad.tsx` | 振動パターンの一覧とボタンの配置。振動パターンに合わせて、タップ位置から背景にリップルエフェクトを出す。パターンを増やすときは `PATTERNS` に追加する |
| `src/app/haptic-button.tsx` | ボタン 1 つ分。押すと縮み、タップ位置を親に渡す |
| `src/lib/haptic-pulses.ts` | 振動パターンから各振動の開始時刻・長さ・強さを計算する |
| `src/app/page.tsx` | トップページ。対応環境の表示もここ |

## 開発サーバーの起動

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。ファイルを編集すると自動で反映される。

## 実機（スマホ）での確認

ハプティックは PC のブラウザでは動作しないため、同じ Wi-Fi に接続したスマホから開発サーバーにアクセスして確認する。

### 1. Mac のローカル IP アドレスを調べる

```bash
ipconfig getifaddr en0
# 例: 192.168.0.11
```

### 2. `next.config.ts` の `allowedDevOrigins` に IP アドレスを設定する

```ts
allowedDevOrigins: ["192.168.0.11"],
```

Next.js の開発サーバーは、`localhost` と起動時に指定したホスト名以外からの JS 読み込みを既定でブロックする。
IP アドレスが登録されていないと、ページは表示されても JS が動かず、**ボタンを押しても波紋も振動も起きない**。

- スキーム（`http://`）やポート（`:3000`）は付けず、ホスト名だけを書く
- IP アドレスは DHCP により Wi-Fi の再接続などで変わることがある。変わったら書き換える
- この設定は開発サーバーでのみ有効で、本番ビルド・Vercel には影響しない

### 3. LAN に公開して起動する

```bash
npm run dev -- -H 0.0.0.0
```

設定を変更した場合は、開発サーバーの再起動が必要。

### 4. スマホで開く

スマホのブラウザで `http://<IP アドレス>:3000`（例: `http://192.168.0.11:3000`）を開く。

HTTP で動作しない場合は HTTPS で起動する（自己署名証明書のため、スマホ側で警告を許可する必要がある）。

```bash
npm run dev -- -H 0.0.0.0 --experimental-https
```

## ビルド

```bash
npm run build
npm run start
```

## 参考

- [Next.js ドキュメント](https://nextjs.org/docs)
- [web-haptics](https://github.com/lochie/web-haptics)（デモ: [haptics.lochie.me](https://haptics.lochie.me)）

## ライブラリなし（Vanilla JS）での実装

web-haptics を使わず、Vanilla JS だけでも実装できる。Android は `navigator.vibrate`、iOS Safari は非表示の `<input type="checkbox" switch>` をクリックしたときの触覚フィードバックを流用する（通称「スイッチハック」）。

ただし iOS では 1 回の短い振動しか出せず、振動パターンや長さ・強さの表現はできない。
