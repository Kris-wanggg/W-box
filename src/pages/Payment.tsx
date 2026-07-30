import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BANK_ACCOUNT,
  CANCEL_RULES,
  DEPOSIT_LEGAL_NOTE,
  DEPOSIT_RULES,
  RESTAURANT_NAME,
} from '../data/menu';
import { currency, dateTimeLabel } from '../lib/format';
import { useBooking } from '../store/BookingContext';
import type { PaymentMethod } from '../types';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { Card, InfoRow } from '../components/ui/Card';
import { Field } from '../components/ui/Field';
import { Radio } from '../components/ui/Choice';

const METHODS: PaymentMethod[] = ['線上支付信用卡', '匯款', '線上轉帳'];

/**
 * Figma: `booking success/ credit card` (668:5110),
 * `booking success/ bank` (668:5456) and
 * `booking success/ on line bank` (668:5574) — one screen, three methods.
 */
export default function Payment() {
  const navigate = useNavigate();
  const booking = useBooking();
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });

  useEffect(() => {
    if (booking.reservationNo === null) navigate('/', { replace: true });
  }, [booking.reservationNo, navigate]);

  const isCard = booking.paymentMethod === '線上支付信用卡';
  const transferVerb = booking.paymentMethod === '匯款' ? '匯款' : '轉帳';

  const cardReady =
    card.number.replace(/\D/g, '').length === 16 &&
    /^\d{2}\s*\/\s*\d{2}$/.test(card.expiry) &&
    card.cvv.length === 3 &&
    card.holder.trim().length > 0;
  const transferReady = booking.bankLast5.length === 5;
  const canPay = isCard ? cardReady : transferReady;

  return (
    <PageShell backLabel="訂位成立" backTo="/success" narrow>
      <div className="flex flex-col gap-6">
        <Card className="flex flex-col gap-1">
          <p className="text-r-label text-text-secondary">應付訂金</p>
          <p className="text-[32px] font-semibold leading-[40px] tabular-nums text-text-primary">
            {currency(booking.deposit)}
          </p>
          <p className="text-r-note text-text-secondary">
            {RESTAURANT_NAME} ‧ {dateTimeLabel(booking.date, booking.time)} ‧{' '}
            {booking.partySize} 位
          </p>
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="text-r-h2 text-text-primary">選擇支付方式（依店家設定顯示）</h2>

          <div className="flex flex-col gap-3">
            {METHODS.map((method) => (
              <div key={method} className="flex flex-col gap-3">
                <Radio
                  name="payment-method"
                  label={method}
                  checked={booking.paymentMethod === method}
                  onChange={() => booking.setPaymentMethod(method)}
                />

                {booking.paymentMethod === method && method === '線上支付信用卡' && (
                  <div className="flex flex-col gap-4 rounded-md border border-border bg-background p-4">
                    <Field
                      label="卡號"
                      inputMode="numeric"
                      placeholder="1234  5678  9012  3456"
                      value={card.number}
                      autoComplete="cc-number"
                      onChange={(e) =>
                        setCard((c) => ({
                          ...c,
                          number: e.target.value.replace(/[^\d\s]/g, '').slice(0, 19),
                        }))
                      }
                    />
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="flex-1">
                        <Field
                          label="有效期限（月／年）"
                          placeholder="08 / 28"
                          value={card.expiry}
                          autoComplete="cc-exp"
                          onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                        />
                      </div>
                      <div className="flex-1">
                        <Field
                          label="安全碼 CVV"
                          inputMode="numeric"
                          placeholder="123"
                          value={card.cvv}
                          autoComplete="cc-csc"
                          onChange={(e) =>
                            setCard((c) => ({
                              ...c,
                              cvv: e.target.value.replace(/\D/g, '').slice(0, 3),
                            }))
                          }
                        />
                      </div>
                    </div>
                    <Field
                      label="持卡人姓名"
                      placeholder="王"
                      value={card.holder}
                      autoComplete="cc-name"
                      onChange={(e) => setCard((c) => ({ ...c, holder: e.target.value }))}
                    />
                    <p className="text-r-note text-text-secondary">
                      付款採 3D 驗證，資料以加密方式傳輸，本店不留存完整卡號。
                    </p>
                  </div>
                )}

                {booking.paymentMethod === method && method !== '線上支付信用卡' && (
                  <div className="flex flex-col gap-4 rounded-md border border-border bg-background p-4">
                    <dl className="divide-y divide-divider">
                      <InfoRow label="收款銀行">{BANK_ACCOUNT.bank}</InfoRow>
                      <InfoRow label="分行">{BANK_ACCOUNT.branch}</InfoRow>
                      <InfoRow label="帳號">
                        <span className="tabular-nums">{BANK_ACCOUNT.account}</span>
                      </InfoRow>
                      <InfoRow label="戶名">{BANK_ACCOUNT.holder}</InfoRow>
                      <InfoRow label="金額">
                        <span className="tabular-nums">{currency(booking.deposit)}</span>
                      </InfoRow>
                    </dl>

                    <Field
                      label={`${transferVerb}帳號後五碼（對帳用）`}
                      inputMode="numeric"
                      placeholder="請輸入帳號末 5 碼"
                      hint={`用於核對您的${transferVerb}來源，加速對帳；請填寫您轉出帳戶的末 5 碼。`}
                      value={booking.bankLast5}
                      onChange={(e) => booking.setBankLast5(e.target.value)}
                    />

                    <div className="flex flex-col gap-1 text-r-note text-text-secondary">
                      <p>
                        請於下單後 24 小時內完成{transferVerb}
                        ，並保留交易明細；逾期未完成，訂位將自動取消。
                      </p>
                      <p>
                        {transferVerb}成功後，請於訂單查詢確認訂單狀態，如有任何問題請與我們聯繫。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <RuleBlock title="訂金付款規則" rules={DEPOSIT_RULES} />
          <RuleBlock title="訂位取消規則" rules={CANCEL_RULES} />
          <p className="text-r-note text-text-secondary">{DEPOSIT_LEGAL_NOTE}</p>
        </Card>

        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            block
            disabled={!canPay}
            onClick={() => {
              booking.markPaid();
              navigate('/pay-success');
            }}
          >
            {isCard ? `立即付款 ${currency(booking.deposit)}` : '完成'}
          </Button>
          {!canPay && (
            <p className="text-r-note text-status-error">
              {isCard
                ? '請完整填寫卡號、有效期限、安全碼與持卡人姓名。'
                : `請填寫${transferVerb}帳號末 5 碼以完成對帳。`}
            </p>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function RuleBlock({ title, rules }: { title: string; rules: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-r-h2 text-text-primary">{title}</h3>
      <ul className="flex flex-col gap-0.5">
        {rules.map((rule) => (
          <li key={rule} className="text-r-note text-text-secondary">
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
