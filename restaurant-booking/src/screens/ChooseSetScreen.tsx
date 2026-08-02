import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MealCard } from '../components/MealCard';
import { OrderSummary } from '../components/OrderSummary';
import { Button } from '../components/ui/Button';
import { setMenu, type MenuItem } from '../data/menu';
import type { BookingState } from '../booking';

/** Figma: `Restaurant/choose-set/empty` (923:1931) */
export interface ChooseSetScreenProps {
  state: BookingState;
  onAdd: (item: MenuItem) => void;
  onRemove: (lineId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ChooseSetScreen({
  state,
  onAdd,
  onRemove,
  onNext,
  onBack,
}: ChooseSetScreenProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar
        backLabel="選擇日期"
        onBack={onBack}
        step={{ current: 2, total: 3 }}
      />

      <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col gap-6 px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <section
            aria-label="選擇餐點"
            className="flex flex-1 flex-col gap-4 rounded-lg border border-border bg-surface p-4 md:p-6"
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-heading-h2 text-text-primary">選擇餐點</h1>
              <p className="text-body-small text-text-secondary">
                可先加入餐點，也可略過直接完成訂位。
              </p>
              <p className="text-caption text-text-muted">
                目前分類：套餐 ‧ 共 {setMenu.length} 項
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {setMenu.map((item) => (
                <MealCard
                  key={item.id}
                  item={item}
                  onAdd={onAdd}
                  selectedCount={state.cart
                    .filter((line) => line.item.id === item.id)
                    .reduce((sum, line) => sum + line.quantity, 0)}
                />
              ))}
            </div>
          </section>

          <div className="flex w-full flex-col gap-4 md:w-[380px] md:shrink-0">
            <OrderSummary cart={state.cart} onRemove={onRemove} />
            <Button size="lg" fullWidth onClick={onNext}>
              下一步：選擇飲品
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
