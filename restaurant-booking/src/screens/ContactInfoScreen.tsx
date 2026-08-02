import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { toppingOptions, restaurantName } from '../data/menu';
import {
  canSubmitContact,
  cartItemCount,
  cartSubtotal,
  formatCurrency,
  formatDateTime,
  isValidPhone,
  type BookingState,
} from '../booking';

/** Figma: `Restaurant/contact info` (923:3218) */
export interface ContactInfoScreenProps {
  state: BookingState;
  onChange: (patch: Partial<BookingState>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const toppingPrices = Object.fromEntries(
  toppingOptions.map((t) => [t.label, t.price]),
);

const fieldClass =
  'rounded-md border border-input-border bg-input-bg p-3 text-body-base text-text-primary placeholder:text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export function ContactInfoScreen({
  state,
  onChange,
  onSubmit,
  onBack,
}: ContactInfoScreenProps) {
  const { contact } = state;
  const phoneTouched = contact.phone.length > 0;
  const phoneInvalid = phoneTouched && !isValidPhone(contact.phone);
  const canSubmit = canSubmitContact(state);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar
        backLabel="選擇餐點"
        onBack={onBack}
        step={{ current: 3, total: 3 }}
      />

      <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col gap-6 px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <section
            aria-label="聯絡資料"
            className="flex flex-1 flex-col gap-4 rounded-lg border border-border bg-surface p-4 md:p-6"
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-heading-h2 text-text-primary">聯絡資料</h1>
              <p className="text-caption text-text-muted">
                <span className="text-status-error">＊</span> 為必填欄位
              </p>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (canSubmit) onSubmit();
              }}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className="text-label-medium text-text-primary">
                  姓名 <span className="text-status-error">＊</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={contact.name}
                  onChange={(event) =>
                    onChange({ contact: { ...contact, name: event.target.value } })
                  }
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-phone" className="text-label-medium text-text-primary">
                  手機號碼 <span className="text-status-error">＊</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  inputMode="numeric"
                  value={contact.phone}
                  aria-invalid={phoneInvalid}
                  aria-describedby="phone-hint"
                  onChange={(event) =>
                    onChange({ contact: { ...contact, phone: event.target.value } })
                  }
                  className={fieldClass}
                />
                <p
                  id="phone-hint"
                  className={
                    phoneInvalid
                      ? 'text-caption text-status-error'
                      : 'text-caption text-text-muted'
                  }
                >
                  {phoneInvalid
                    ? '請輸入正確的手機號碼格式（09 開頭共 10 碼）'
                    : '用於接收 LINE／簡訊 訂位通知'}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-note" className="text-label-medium text-text-primary">
                  特製需求（選填）
                </label>
                <textarea
                  id="contact-note"
                  rows={3}
                  value={contact.note}
                  onChange={(event) =>
                    onChange({ contact: { ...contact, note: event.target.value } })
                  }
                  className={fieldClass}
                />
              </div>

              <Button type="submit" size="lg" fullWidth disabled={!canSubmit}>
                確認訂位
              </Button>
            </form>
          </section>

          <aside
            aria-label="訂位摘要"
            className="flex w-full flex-col gap-4 rounded-lg border border-border bg-surface p-4 md:w-[380px] md:shrink-0"
          >
            <h2 className="text-heading-h3 text-text-primary">訂位資訊</h2>
            <dl className="flex flex-col gap-2">
              <div className="flex justify-between gap-4">
                <dt className="text-body-small text-text-secondary">餐廳名稱</dt>
                <dd className="text-body-base text-text-primary">{restaurantName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-body-small text-text-secondary">日期時段</dt>
                <dd className="text-body-base text-text-primary">
                  {formatDateTime(state.date, state.time)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-body-small text-text-secondary">用餐人數</dt>
                <dd className="text-body-base text-text-primary">
                  {state.adults + state.children} 位
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-body-small text-text-secondary">已選餐點</dt>
                <dd className="text-body-base text-text-primary">
                  共 {cartItemCount(state.cart)} 項
                </dd>
              </div>
            </dl>
            <div className="flex items-baseline justify-between border-t border-divider pt-3">
              <p className="text-body-base text-text-secondary">小計</p>
              <output
                aria-label="小計金額"
                className="text-heading-h3 text-text-primary"
              >
                {formatCurrency(cartSubtotal(state.cart, toppingPrices))}
              </output>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
