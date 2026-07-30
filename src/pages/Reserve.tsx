/**
 * Figma: `Restaurant/reservation-v2`, `Restaurant/reservation-v2/empty`,
 * `Restaurant/reschedule/success-wait to pay`, `Restaurant/reschedule/success-paid`.
 *
 * Hero image + a three-column booking card (用餐人數 / 選擇日期 / 選擇時段).
 * The reschedule variants reuse the whole card and swap the footer actions.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/icons';
import { Footer, Header } from '../components/layout';
import { Button, PeriodTab, Stepper, TimeSlot, cx } from '../components/ui';
import {
  CALENDAR_MONTH,
  CALENDAR_YEAR,
  MEAL_PERIODS,
  TIME_SLOTS,
  WEEKDAYS,
  buildCalendar,
  type MealPeriod,
} from '../data/reservation';
import { useBooking } from '../store';

const CELLS = buildCalendar();

export default function Reserve({
  mode = 'book',
  empty = false,
  paid = false,
}: {
  mode?: 'book' | 'reschedule';
  empty?: boolean;
  paid?: boolean;
}) {
  const navigate = useNavigate();
  const { adults, children, day, time, set } = useBooking();
  const [period, setPeriod] = useState<MealPeriod>('早餐');
  const [touched, setTouched] = useState(!empty);

  const selectedDay = touched ? day : null;
  const selectedTime = touched ? time : null;
  const reschedule = mode === 'reschedule';

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header
        backLabel={reschedule ? '訂位詳情' : '訂位查詢'}
        backTo={reschedule ? '/booking-success' : '/'}
        step={reschedule ? undefined : '步驟 1 / 3'}
      />

      {/* `Hero Carousel`. The Figma slide is a photograph that the build
          environment cannot fetch, so it is stood in for by the warm gradient
          the design uses elsewhere; swap in the export when assets are wired. */}
      <div className="relative h-[220px] w-full overflow-hidden bg-gradient-to-br from-[#C9AE7C] via-[#A88A5B] to-[#6E5A3A] md:h-[340px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cx('h-1 rounded-full transition-all', i === 0 ? 'w-6 bg-white' : 'w-3 bg-white/50')} />
          ))}
        </div>
      </div>

      {/* Pulled up over the hero, so it needs to win the stacking order. */}
      <main className="relative z-10 mx-auto -mt-10 w-full max-w-content flex-1 px-5 pb-10 md:px-10">
        <div className="rounded-chip bg-white p-5 shadow-card md:p-8">
          <div className="flex flex-col gap-8 md:flex-row md:gap-10">
            {/* ── 用餐人數 ───────────────────────────────────────────── */}
            <section className="flex flex-col gap-4 md:w-[280px] md:shrink-0">
              <h2 className="text-h4-strong text-ink">用餐人數</h2>

              <div className="flex flex-col gap-3 rounded-tile bg-black/[0.03] p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-ink">成人</span>
                  <Stepper label="成人" value={adults} min={1} max={8} onChange={(v) => set('adults', v)} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-ink">小孩 (0-7歲)</span>
                  <Stepper label="小孩" value={children} min={0} max={8} onChange={(v) => set('children', v)} />
                </div>
              </div>

              <p className="border-l-2 border-brand bg-brand/[0.08] px-3 py-2.5 text-xs leading-[18px] text-ink-secondary">
                <span className="font-medium text-ink">預約說明：</span>
                <br />
                超過 8 人的團體預約，請直接撥打電話聯繫我們的專屬客服。
              </p>
            </section>

            {/* ── 選擇日期 ───────────────────────────────────────────── */}
            <section className="flex flex-1 flex-col gap-4">
              <h2 className="text-h4-strong text-ink">選擇日期</h2>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">
                  {CALENDAR_YEAR} 年 {CALENDAR_MONTH}月
                </span>
                <div className="flex gap-2">
                  {[ChevronLeftIcon, ChevronRightIcon].map((Icon, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={i === 0 ? '上個月' : '下個月'}
                      className="inline-flex size-7 items-center justify-center rounded-chip border border-line text-ink-secondary transition-colors hover:bg-brand/[0.08] hover:text-brand"
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-1 text-center">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="pb-1 text-xs font-medium text-ink-secondary">
                    {w}
                  </span>
                ))}

                {CELLS.map((cell, i) => {
                  const selected = !cell.outside && cell.day === selectedDay;
                  const disabled = cell.outside || cell.closed;
                  return (
                    <button
                      key={`${cell.day}-${i}`}
                      type="button"
                      disabled={disabled}
                      aria-pressed={selected}
                      aria-label={`${CALENDAR_MONTH} 月 ${cell.day} 日${cell.closed ? '（公休）' : ''}`}
                      onClick={() => {
                        set('day', cell.day);
                        setTouched(true);
                      }}
                      className={cx(
                        'mx-auto flex size-8 items-center justify-center rounded-full text-sm transition-colors',
                        selected && 'bg-brand font-medium text-white',
                        !selected && cell.outside && 'cursor-default text-ink-secondary/40',
                        !selected && cell.closed && !cell.outside && 'cursor-not-allowed text-destructive/70',
                        !selected && !disabled && 'text-ink hover:bg-brand/[0.08]',
                      )}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── 選擇時段 ───────────────────────────────────────────── */}
            <section className="flex flex-col gap-4 md:w-[412px] md:shrink-0">
              <h2 className="text-h4-strong text-ink">選擇時段</h2>

              {/* `[Comp] TimeSlots` — 36px meal-period pills over a 4-column
                  grid of 41px slots. */}
              <div className="flex flex-wrap gap-2">
                {MEAL_PERIODS.map((p) => (
                  <PeriodTab key={p} active={p === period} onClick={() => setPeriod(p)}>
                    {p}
                  </PeriodTab>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2">
                {TIME_SLOTS[period].map((slot) => (
                  <TimeSlot
                    key={slot.time}
                    active={slot.time === selectedTime}
                    unavailable={slot.full}
                    onClick={() => {
                      set('time', slot.time);
                      setTouched(true);
                    }}
                  >
                    {slot.time}
                  </TimeSlot>
                ))}
              </div>

              {reschedule ? (
                <div className="mt-2 flex flex-col gap-2">
                  <Button size="cta" block onClick={() => navigate(paid ? '/reschedule-paid-done' : '/reschedule-done')}>
                    儲存變更
                  </Button>
                  <Button size="cta" block variant="outline" onClick={() => navigate(-1)}>
                    取消
                  </Button>
                </div>
              ) : (
                <Button size="cta" block className="mt-2" disabled={!touched} onClick={() => navigate('/order')}>
                  下一步：選擇餐點
                </Button>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
