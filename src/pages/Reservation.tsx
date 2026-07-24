import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';
import { Card, PrimaryButton } from '../components/ui';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from '../components/icons';
import { totalGuests, useBooking } from '../state/BookingContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TIME_GROUPS: { label: string; slots: string[] }[] = [
  { label: '早晨', slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'] },
  { label: '午餐', slots: ['11:30', '12:00', '12:30', '13:00', '13:30'] },
  { label: '下午茶', slots: ['14:30', '15:00', '15:30', '16:00'] },
  { label: '晚餐', slots: ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00'] },
];

const CN_WEEK = ['日', '一', '二', '三', '四', '五', '六'];

function fmtDate(d: Date | null) {
  if (!d) return '—';
  return `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${String(
    d.getDate()
  ).padStart(2, '0')} (${CN_WEEK[d.getDay()]})`;
}

/** Stepper for adult / child counts. */
function Stepper({
  label,
  hint,
  value,
  min = 0,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex-1">
      <p className="mb-2 text-sm text-cream-dim">
        {label} {hint && <span className="text-muted">{hint}</span>}
      </p>
      <div className="flex items-center justify-between rounded-btn border border-gold-faint bg-panel-input px-2 py-2">
        <button
          type="button"
          aria-label={`減少${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gold-light transition-colors hover:bg-gold-soft disabled:opacity-40"
          disabled={value <= min}
        >
          <MinusIcon size={16} />
        </button>
        <span className="text-base font-medium text-cream">{value} 位</span>
        <button
          type="button"
          aria-label={`增加${label}`}
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gold-light transition-colors hover:bg-gold-soft"
        >
          <PlusIcon size={16} />
        </button>
      </div>
    </div>
  );
}

/** Month-grid calendar. Past days are disabled. */
function Calendar({
  value,
  onSelect,
}: {
  value: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [view, setView] = useState(
    () => new Date((value ?? today).getFullYear(), (value ?? today).getMonth(), 1)
  );

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const sameDay = (a: Date | null, b: Date | null) =>
    !!a && !!b && a.toDateString() === b.toDateString();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-base font-medium text-cream">
          {year} 年 {month + 1}月
        </p>
        <div className="flex gap-1">
          <button
            aria-label="上個月"
            onClick={() => setView(new Date(year, month - 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gold-faint text-gold-light transition-colors hover:bg-gold-soft"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <button
            aria-label="下個月"
            onClick={() => setView(new Date(year, month + 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gold-faint text-gold-light transition-colors hover:bg-gold-soft"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-xs text-muted">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const disabled = d < today;
          const selected = sameDay(d, value);
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onSelect(d)}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                selected
                  ? 'bg-gold-gradient font-semibold text-ink'
                  : disabled
                    ? 'cursor-not-allowed text-muted/40'
                    : 'text-cream hover:bg-gold-soft'
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Restaurant/reservation — Figma node 492:83. Date / time / party selection. */
export default function Reservation() {
  const navigate = useNavigate();
  const { booking, update } = useBooking();
  const [banner, setBanner] = useState(0);

  const banners = [
    { title: '私人包廂體驗', sub: '每一桌都是您的專屬空間' },
    { title: '整桌套餐規劃', sub: '專人協助菜色與飲品搭配' },
    { title: '宴會桌宴專門', sub: '謝師宴 · 尾牙春酒 · 慶生一桌搞定' },
  ];

  const ready = booking.date && booking.time && totalGuests(booking) > 0;

  return (
    <Layout>
      <TopBar backLabel="預約首頁" backTo="/" step="步驟 1 / 3" />

      <div className="mx-auto grid w-full max-w-content gap-6 px-2 py-4 lg:grid-cols-2">
        {/* Left: banner + live summary */}
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <div className="relative flex h-[220px] flex-col justify-end bg-gradient-to-tr from-[#1a120a] via-[#2a1c0e] to-[#3a2712] p-5">
              <button
                aria-label="上一張"
                onClick={() => setBanner((b) => (b + banners.length - 1) % banners.length)}
                className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-cream transition-colors hover:bg-black/70"
              >
                <ChevronLeftIcon size={16} />
              </button>
              <button
                aria-label="下一張"
                onClick={() => setBanner((b) => (b + 1) % banners.length)}
                className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-cream transition-colors hover:bg-black/70"
              >
                <ChevronRightIcon size={16} />
              </button>
              <h3 className="text-lg font-semibold text-white">
                {banners[banner].title}
              </h3>
              <p className="text-sm text-cream-dim">{banners[banner].sub}</p>
              <div className="mt-3 flex gap-1.5">
                {banners.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === banner ? 'w-5 bg-gold-light' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-cream">訂位資訊總覽</h2>
            <p className="mb-4 text-xs text-muted">隨您的選擇即時更新</p>

            <dl className="flex flex-col gap-3 text-sm">
              <Row label="用餐日期" value={fmtDate(booking.date)} />
              <Row label="用餐時段" value={booking.time ?? '—'} />
              <Row label="成人" value={`${booking.adults} 位`} />
              <Row label="小孩 (0-7歲)" value={`${booking.children} 位`} />
            </dl>

            <div className="my-4 h-px bg-[rgba(201,146,42,0.2)]" />

            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-cream">合計人數</span>
              <span className="text-lg font-bold text-gold-light">
                {totalGuests(booking)} 位
              </span>
            </div>

            {ready ? (
              <div className="mt-4 flex items-center gap-2 rounded-btn border border-[rgba(76,175,80,0.4)] bg-[rgba(76,175,80,0.1)] px-4 py-3 text-sm text-[#7dd66f]">
                <span>✓</span> 已完成必填選擇，可前往下一步
              </div>
            ) : (
              <div className="mt-4 rounded-btn border border-gold-faint bg-panel-soft px-4 py-3 text-sm text-muted">
                請選擇用餐日期與時段以繼續
              </div>
            )}
            <p className="mt-3 text-xs leading-relaxed text-muted">
              ⓘ 完成預約後，將以 LINE / 簡訊 發送確認通知；請於訂位時間內
              15 分鐘完成資料填寫。
            </p>
          </Card>
        </div>

        {/* Right: pickers */}
        <Card className="p-6">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mb-3 text-lg font-semibold text-cream">用餐人數</h2>
              <div className="flex gap-4">
                <Stepper
                  label="成人"
                  min={1}
                  value={booking.adults}
                  onChange={(n) => update({ adults: n })}
                />
                <Stepper
                  label="小孩"
                  hint="(0-7歲)"
                  value={booking.children}
                  onChange={(n) => update({ children: n })}
                />
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-cream">選擇日期</h2>
              <Calendar
                value={booking.date}
                onSelect={(d) => update({ date: d })}
              />
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-cream">選擇時段</h2>
              <div className="flex flex-col gap-4">
                {TIME_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 text-xs text-muted">{group.label}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {group.slots.map((slot) => {
                        const active = booking.time === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => update({ time: slot })}
                            className={`rounded-btn border px-2 py-2 text-sm transition-colors ${
                              active
                                ? 'border-transparent bg-gold-gradient font-medium text-ink'
                                : 'border-gold-faint text-cream hover:bg-gold-soft'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <PrimaryButton
              disabled={!ready}
              onClick={() => navigate('/meal')}
              className="text-base"
            >
              下一步：選擇餐點
            </PrimaryButton>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-cream-dim">{label}</dt>
      <dd className="font-medium text-cream">{value}</dd>
    </div>
  );
}
