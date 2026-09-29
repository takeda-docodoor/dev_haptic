import { HapticPad } from "./haptic-pad";

const SUPPORT = [
  {
    platform: "iOS",
    version: "iOS 18 以降（Safari）",
    note: "switch 要素のトグル時の触覚フィードバックを利用。強さ・長さは擬似的に再現",
  },
  {
    platform: "Android",
    version: "Chrome 32 以降など Vibration API 対応ブラウザ",
    note: "端末のバイブレーション設定がオフだと振動しません",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 py-12">
      <HapticPad />
      <section className="w-full max-w-md px-4">
        <h2 className="mb-2 text-sm font-semibold">対応環境</h2>
        <dl className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 text-sm dark:divide-zinc-800 dark:border-zinc-800">
          {SUPPORT.map(({ platform, version, note }) => (
            <div key={platform} className="grid grid-cols-[5rem_1fr] gap-x-3 p-3">
              <dt className="font-medium">{platform}</dt>
              <dd>
                {version}
                <span className="mt-1 block text-xs text-zinc-500">{note}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-zinc-500">
          iPad・PC は非対応（振動しません）。
        </p>
      </section>
    </main>
  );
}
