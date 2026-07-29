/**
 * Figma: `A 案改良 — 拿掉重複資訊與多餘控制項` (755:2572).
 *
 * A designer comparison board rather than a product screen: two versions of the
 * 已選餐點 card side by side. A′ keeps the disclosure; A″ drops it and puts the
 * stepper inline where the `×N` used to sit.
 */
import { useState, type ReactNode } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '../components/icons';
import { Screen } from '../components/layout';
import { Button, Card, CardTitle, Divider, Money, Stepper, cx } from '../components/ui';

type Row = { id: string; name: string; price: number; qty: number };

const ROWS: Row[] = [
  { id: 'duo', name: '雙人分享套餐', price: 1580, qty: 1 },
  { id: 'lunch', name: '商業午餐套餐', price: 480, qty: 1 },
];

const CUSTOM_DRINKS = [
  { id: 'longan', name: '桂圓紅棗茶（壺）', unit: 320, qty: 2 },
  { id: 'oolong', name: '台灣高山烏龍（壺）', unit: 280, qty: 1 },
];

export default function ProposalA() {
  return (
    <Screen backLabel="全部畫面" backTo="/index" width="wide">
      <header className="flex flex-col gap-2">
        <h1 className="text-[24px] font-bold leading-8 text-ink">A 案改良 — 拿掉重複資訊與多餘控制項</h1>
        <p className="text-sm leading-[21px] text-ink-muted">
          套用兩點修正：① 展開後標題不再重複顯示 ×N，數量只由步進器承載　② 拿掉「移除」鍵，數量為 1 時「−」變垃圾桶。
        </p>
      </header>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <Variant
          title="A′ ‧ 保留收合，展開後精簡"
          caption="仍需 1 次點擊才看得到步進器"
          notes={[
            '・拿掉「移除」後，展開區只剩步進器與單價兩樣東西。',
            '・標題列不再顯示 ×2，數量只由步進器承載。',
            '・數量為 1 時「−」變垃圾桶，移除走同一個鍵。',
            '・但仍要先點一下才看得到步進器——而展開區已經沒剩多少內容值得藏。',
          ]}
        >
          <SummaryCard collapsible />
        </Variant>

        <Variant
          title="A″ ‧ 不收合（推薦）"
          caption="×N 的位置直接變成無框步進器，列高不變"
          recommended
          notes={[
            '・步進器永遠可見，少一次點擊。',
            '・無框步進器與金額同列，列高與 A′ 收合時一致。',
            '・客製化加購飲品同樣直接顯示數量控制。',
          ]}
        >
          <SummaryCard />
        </Variant>
      </div>
    </Screen>
  );
}

function Variant({
  title,
  caption,
  notes,
  recommended,
  children,
}: {
  title: string;
  caption: string;
  notes: string[];
  recommended?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className={cx('text-base font-bold', recommended ? 'text-brand' : 'text-ink')}>{title}</h2>
        <p className="text-xs text-ink-muted">{caption}</p>
      </div>
      {children}
      <ul className="flex flex-col gap-1 rounded-sm border border-dashed border-line p-3 text-xs leading-[18px] text-ink-muted">
        {notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </section>
  );
}

function SummaryCard({ collapsible }: { collapsible?: boolean }) {
  const [rows, setRows] = useState(ROWS);
  const [drinks, setDrinks] = useState(CUSTOM_DRINKS);
  const [open, setOpen] = useState<string | null>(collapsible ? null : 'all');

  const drinkTotal = drinks.reduce((sum, d) => sum + d.unit * d.qty, 0);
  const subtotal = rows.reduce((sum, r) => sum + r.price * r.qty, 0) + 10800 + drinkTotal;
  const expanded = (id: string) => !collapsible || open === id;

  return (
    <Card>
      <CardTitle note={`共 ${rows.reduce((s, r) => s + r.qty, 0)} 項`}>已選餐點</CardTitle>

      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="min-w-0 flex-1 text-sm text-ink">{row.name}</span>
              {!collapsible ? (
                <Stepper
                  size="sm"
                  label={row.name}
                  value={row.qty}
                  onChange={(qty) => setRows((p) => p.map((r) => (r.id === row.id ? { ...r, qty } : r)))}
                />
              ) : null}
              <Money value={row.price * row.qty} className="w-[56px] text-right text-sm font-medium text-brand" />
              {collapsible ? (
                <button
                  type="button"
                  aria-label={`${expanded(row.id) ? '收合' : '展開'} ${row.name}`}
                  aria-expanded={expanded(row.id)}
                  onClick={() => setOpen(open === row.id ? null : row.id)}
                  className="rounded p-1 text-ink-muted transition-colors hover:bg-brand-tint hover:text-brand"
                >
                  {expanded(row.id) ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
                </button>
              ) : null}
            </div>

            {collapsible && expanded(row.id) ? (
              <div className="flex items-center justify-between rounded-sm bg-black/[0.03] px-3 py-2">
                <Stepper
                  size="sm"
                  label={row.name}
                  value={row.qty}
                  onChange={(qty) => setRows((p) => p.map((r) => (r.id === row.id ? { ...r, qty } : r)))}
                />
                <span className="text-xs text-ink-muted">${row.price.toLocaleString('en-US')} / 份</span>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <Divider />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">客製化點餐（進行中）</span>
        <Button variant="ghost" size="sm">
          清除設定
        </Button>
      </div>

      <dl className="flex flex-col gap-1.5 text-xs leading-[18px] text-ink-muted">
        {[
          ['活動類型', '謝師宴'],
          ['整桌預算', '$10,800 / 桌'],
          ['是否需要包廂', '不需要'],
          ['加購飲品', '需要加購'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <dt>{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <ul className="flex flex-col gap-2">
        {drinks.map((drink) => (
          <li key={drink.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="min-w-0 flex-1 text-[13px] text-ink">└ {drink.name}</span>
              {!collapsible ? (
                <Stepper
                  size="sm"
                  label={drink.name}
                  value={drink.qty}
                  onChange={(qty) => setDrinks((p) => p.map((d) => (d.id === drink.id ? { ...d, qty } : d)))}
                />
              ) : null}
              <Money value={drink.unit * drink.qty} className="w-[56px] text-right text-[13px] text-brand" />
              {collapsible ? (
                <button
                  type="button"
                  aria-label={`${expanded(drink.id) ? '收合' : '展開'} ${drink.name}`}
                  aria-expanded={expanded(drink.id)}
                  onClick={() => setOpen(open === drink.id ? null : drink.id)}
                  className="rounded p-1 text-ink-muted transition-colors hover:bg-brand-tint hover:text-brand"
                >
                  {expanded(drink.id) ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
                </button>
              ) : null}
            </div>

            {collapsible && expanded(drink.id) ? (
              <div className="flex items-center justify-between rounded-sm bg-black/[0.03] px-3 py-2">
                <Stepper
                  size="sm"
                  label={drink.name}
                  value={drink.qty}
                  onChange={(qty) => setDrinks((p) => p.map((d) => (d.id === drink.id ? { ...d, qty } : d)))}
                />
                <span className="text-xs text-ink-muted">${drink.unit} / 壺</span>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-xs text-ink-muted">
        <span>加購飲品小計</span>
        <Money value={drinkTotal} className="text-ink" />
      </div>

      <Divider />

      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-ink">小計</span>
        <Money value={subtotal} className="text-[22px] font-bold text-brand" />
      </div>

      <p className="text-xs leading-[18px] text-ink-muted">
        客製化點餐：$10,800 / 桌 ＋ 加購飲品 ${drinkTotal.toLocaleString('en-US')}；金額以現場確認菜色為準。
      </p>

      <Button block>確認，開始配對桌位</Button>
    </Card>
  );
}
