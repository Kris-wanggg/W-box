/**
 * Screen index — the entry point for cross-device testing. Lists all 35 frames
 * from the Figma section grouped by step, with a deep link into the design.
 */
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '../components/icons';
import { Footer } from '../components/layout';
import { Badge } from '../components/ui';
import { FIGMA_FILE, GROUPS, SCREENS, figmaLink } from '../screens';

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-line-subtle bg-canvas/70 px-5 py-6 backdrop-blur md:px-10 md:py-8">
        <div className="mx-auto flex max-w-content flex-col gap-2">
          <p className="text-xs font-black uppercase tracking-[2.4px] text-brand">Frontend Test Build</p>
          <h1 className="text-[24px] font-bold leading-8 text-ink md:text-[28px]">餐廳訂位系統 — 全部畫面</h1>
          <p className="text-sm leading-[21px] text-ink-secondary">
            共 {SCREENS.length} 個畫面，對應 Figma section「28 section v2」。點任一畫面即可開始測試；
            訂位流程可從「訂位首頁」一路點到付款完成。
          </p>
          <a
            href={FIGMA_FILE}
            target="_blank"
            rel="noreferrer"
            className="w-fit text-[13px] font-semibold text-brand underline-offset-4 hover:underline"
          >
            開啟 Figma 設計稿 ↗
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-content flex-1 px-5 py-8 md:px-10">
        <div className="flex flex-col gap-8">
          {GROUPS.map((group) => {
            const screens = SCREENS.filter((s) => s.group === group);
            return (
              <section key={group} className="flex flex-col gap-3">
                <h2 className="flex items-center gap-3 text-base font-bold text-ink">
                  {group}
                  <Badge>{screens.length} 頁</Badge>
                </h2>

                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {screens.map((screen) => (
                    <li key={screen.path}>
                      <article className="flex h-full flex-col gap-2 rounded-chip border border-line bg-white p-4 transition-shadow hover:shadow-card">
                        <Link
                          to={screen.path}
                          className="flex items-start justify-between gap-2 text-[15px] font-medium text-ink transition-colors hover:text-brand"
                        >
                          {screen.title}
                          <ChevronRightIcon size={18} className="mt-0.5 shrink-0 text-ink-secondary" />
                        </Link>

                        <p className="flex-1 text-xs leading-[18px] text-ink-secondary">{screen.note}</p>

                        <div className="flex items-center justify-between gap-2 border-t border-line-subtle pt-2">
                          <code className="min-w-0 truncate text-[11px] text-ink-secondary" title={screen.figma}>
                            {screen.figma}
                          </code>
                          <a
                            href={figmaLink(screen.node)}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 text-[11px] font-semibold text-brand hover:underline"
                          >
                            Figma ↗
                          </a>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
