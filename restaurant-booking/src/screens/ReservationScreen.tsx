import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Calendar } from '../components/Calendar';
import { Stepper } from '../components/ui/Stepper';
import { Button } from '../components/ui/Button';
import { timeSlots, restaurantName } from '../data/menu';
import { canProceedFromReservation, type BookingState } from '../booking';

/** Figma: `Restaurant/reservation-v3` (923:5151) */
export interface ReservationScreenProps {
  state: BookingState;
  onChange: (patch: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ReservationScreen({
  state,
  onChange,
  onNext,
  onBack,
}: ReservationScreenProps) {
  const canProceed = canProceedFromReservation(state);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar
        backLabel="預約首頁"
        onBack={onBack}
        step={{ current: 1, total: 3 }}
        links={[{ label: '訂位查詢', onSelect: onBack }]}
      />

      <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col gap-6 px-4 py-6">
        <section
          aria-label="餐廳資訊"
          className="flex flex-col gap-2 rounded-lg bg-overlay p-6"
        >
          <h1 className="text-heading-h1 text-text-inverse">{restaurantName}</h1>
          <p className="text-body-base text-text-inverse">
            線上訂位 ‧ 立即保留您的座位
          </p>
        </section>

        <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6">
          <section aria-label="用餐人數" className="flex flex-col gap-4">
            <h2 className="text-heading-h3 text-text-primary">用餐人數</h2>
            <div className="flex flex-col gap-4 md:flex-row md:gap-6">
              <div className="flex items-center justify-between gap-4 md:justify-start">
                <label className="text-body-base text-text-secondary">成人</label>
                <Stepper
                  label="成人"
                  value={state.adults}
                  min={0}
                  max={20}
                  onChange={(adults) => onChange({ adults })}
                />
              </div>
              <div className="flex items-center justify-between gap-4 md:justify-start">
                <label className="text-body-base text-text-secondary">
                  小孩 (0-7歲)
                </label>
                <Stepper
                  label="小孩 (0-7歲)"
                  value={state.children}
                  min={0}
                  max={20}
                  onChange={(children) => onChange({ children })}
                />
              </div>
            </div>
          </section>

          <section aria-label="特殊需求" className="flex flex-col gap-2">
            <label
              htmlFor="special-request"
              className="text-heading-h3 text-text-primary"
            >
              特殊需求
            </label>
            <textarea
              id="special-request"
              rows={3}
              value={state.specialRequest}
              onChange={(event) => onChange({ specialRequest: event.target.value })}
              placeholder="例如：需要兒童座椅、慶生佈置"
              className="rounded-md border border-input-border bg-input-bg p-3 text-body-base text-text-primary placeholder:text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </section>

          <Calendar
            year={2026}
            month={8}
            selected={state.date}
            closedDates={['2026-08-03', '2026-08-10']}
            onSelect={(date) => onChange({ date })}
          />

          <section aria-label="選擇時段" className="flex flex-col gap-3">
            <h2 className="text-heading-h3 text-text-primary">選擇時段</h2>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => {
                const isSelected = state.time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    aria-label={`選擇 ${slot}`}
                    aria-pressed={isSelected}
                    onClick={() => onChange({ time: slot })}
                    className={[
                      'h-11 rounded-md border px-4 text-body-base transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      isSelected
                        ? 'border-primary bg-primary text-text-inverse'
                        : 'border-border bg-surface text-text-primary hover:bg-surface-alt active:bg-surface-muted',
                    ].join(' ')}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </section>

          <Button size="lg" fullWidth disabled={!canProceed} onClick={onNext}>
            下一步：選擇餐點
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
