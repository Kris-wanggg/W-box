import { useNavigate } from 'react-router-dom';
import { isFullyBooked } from '../data/availability';
import { RESTAURANT_NAME } from '../data/menu';
import { useBooking } from '../store/BookingContext';
import { Calendar } from '../components/booking/Calendar';
import { PartySize } from '../components/booking/PartySize';
import { TimeSlots } from '../components/booking/TimeSlots';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

/**
 * Figma: `Restaurant/reservation-v2` (779:2572) and its
 * `/empty` variant (788:992) — 步驟 1 / 3.
 */
export default function Reservation() {
  const navigate = useNavigate();
  const booking = useBooking();
  const soldOut = isFullyBooked(booking.date);
  const canContinue = booking.date !== null && booking.time !== null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-[72px] max-w-content items-center justify-between gap-4 px-5">
          <p className="text-r-label text-text-primary">訂位查詢</p>
          <span className="rounded-pill bg-brand-tint px-3 py-1 text-r-note text-brand">
            步驟 1 / 3
          </span>
        </div>
      </header>

      <main className="flex-1">
        {/* Figma: `Hero Carousel` — a single static slide stands in for the
            carousel, which has no interaction spec in the design file. */}
        <section
          aria-label="餐廳介紹"
          className="relative flex h-[280px] items-end bg-gradient-to-br from-brand via-brand-hover to-brand-active md:h-[380px]"
        >
          <div className="mx-auto w-full max-w-content px-5 pb-16">
            <p className="text-r-note text-brand-contrast/80">RESTAURANT BOOKING ENTRANCE</p>
            <h1 className="mt-2 text-[28px] font-semibold leading-9 text-brand-contrast md:text-[36px] md:leading-[44px]">
              {RESTAURANT_NAME}
            </h1>
            <p className="mt-2 max-w-[520px] text-r-body text-brand-contrast/85">
              三代主廚的手路菜，選好日期與時段即可線上訂位；訂金付款後即完成保留。
            </p>
          </div>
          <div
            aria-hidden="true"
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5"
          >
            <span className="h-1 w-6 rounded-pill bg-brand-contrast" />
            <span className="h-1 w-3 rounded-pill bg-brand-contrast/40" />
            <span className="h-1 w-3 rounded-pill bg-brand-contrast/40" />
          </div>
        </section>

        {/* z-10: the hero is `relative`, so the card needs its own stacking
            context to sit above it rather than be painted over. */}
        <div className="relative z-10 mx-auto -mt-8 w-full max-w-content px-5 pb-8">
          <Card className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            <div className="flex flex-col gap-8 lg:w-[400px] lg:shrink-0">
              <PartySize
                adults={booking.adults}
                childCount={booking.children}
                onAdults={booking.setAdults}
                onChildren={booking.setChildren}
              />
              <Calendar value={booking.date} onChange={booking.setDate} />
            </div>

            <div className="flex flex-1 flex-col justify-between gap-6 lg:border-l lg:border-divider lg:pl-10">
              <TimeSlots
                date={booking.date}
                value={booking.time}
                onChange={booking.setTime}
              />

              {soldOut ? (
                <Button variant="secondary" size="lg" block disabled>
                  時段已滿，是否登記候補流程？
                </Button>
              ) : (
                <Button
                  size="lg"
                  block
                  disabled={!canContinue}
                  onClick={() => navigate('/meals')}
                >
                  下一步：選擇餐點
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
