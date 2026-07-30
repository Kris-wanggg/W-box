/**
 * Figma: `Restaurant/contact info`, `…/ for coffee`, `…/noworking`, `…/custom`.
 *
 * Contact form plus a 訂位摘要 card. The variants differ in which venue is
 * booked, whether the summary lists meals, and whether the CTA is available.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findItem } from '../data/menu';
import { RESTAURANT, RESTAURANT_ALT } from '../data/reservation';
import { Screen, TwoColumn } from '../components/layout';
import { Button, Card, CardTitle, Divider, Field, Input, Money, Notice, SummaryRow, Textarea } from '../components/ui';
import { linePrice, useBooking } from '../store';

type Variant = 'default' | 'coffee' | 'noworking' | 'custom';

export default function Contact({ variant = 'default' }: { variant?: Variant }) {
  const navigate = useNavigate();
  const { cart, subtotal, slotLabel, partyLabel, contact, set, custom } = useBooking();
  const [form, setForm] = useState({ name: '', phone: '', request: '' });
  const [submitted, setSubmitted] = useState(false);

  const showMeals = variant === 'default';
  const venue = variant === 'coffee' ? RESTAURANT_ALT : RESTAURANT;
  const closed = variant === 'noworking';
  /**
   * Each variant publishes its own CTA: 確認，開始配對桌位 (839:1402),
   * 訂位完成 (840:1592) and 由專人為您服務 (839:1381) are 48px, while the
   * 公休日 screen swaps in a 44px 所選時段已滿？查看候補流程 (840:1603).
   */
  const cta = closed
    ? '所選時段已滿？查看候補流程'
    : variant === 'default'
      ? '確認，開始配對桌位'
      : variant === 'custom'
        ? '由專人為您服務'
        : '訂位完成';

  const nameError = submitted && !form.name.trim() ? '請填寫訂位人姓名' : undefined;
  const phoneError =
    submitted && !/^09\d{2}\s?\d{3}\s?\d{3}$/.test(form.phone.replace(/\s/g, '')) ? '請填寫正確的手機號碼' : undefined;

  const submit = () => {
    setSubmitted(true);
    if (!form.name.trim() || !/^09\d{8}$/.test(form.phone.replace(/\s/g, ''))) return;
    set('contact', form);
    navigate(variant === 'default' ? '/booking-success' : '/booking-success');
  };

  return (
    /* 咖啡廳 (714:327) and 公休日 (668:4062) skip meal selection, so their back
       button reads 選擇日期 and returns to the date picker; the other two
       (668:3955 / 668:4170) come from 選擇餐點. */
    <Screen
      backLabel={variant === 'coffee' || closed ? '選擇日期' : '選擇餐點'}
      backTo={variant === 'coffee' || closed ? '/' : '/order'}
      step="步驟 3 / 3"
    >
      <TwoColumn
        main={
          <Card>
            <CardTitle size="sm" note="＊ 為必填欄位">聯絡資料</CardTitle>

            <Field label="姓名" required error={nameError}>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="請輸入訂位人姓名"
                autoComplete="name"
              />
            </Field>

            <Field label="手機號碼" required hint="用於接收 LINE／簡訊 訂位通知" error={phoneError}>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="例：0912 345 678"
                inputMode="tel"
                autoComplete="tel"
              />
            </Field>

            <Field label="特製需求（選填）">
              <Textarea
                value={form.request}
                onChange={(e) => setForm({ ...form, request: e.target.value })}
                placeholder="例：兒童座椅、輪椅友善座位、過敏原註記…"
              />
            </Field>
          </Card>
        }
        aside={
          <Card>
            <CardTitle size="sm">訂位摘要</CardTitle>

            <div className="flex flex-col gap-3">
              <SummaryRow label="餐廳名稱" value={venue} />
              <SummaryRow label="日期時段" value={slotLabel} />
              <SummaryRow label="用餐人數" value={partyLabel} />
              {!showMeals ? (
                <>
                  <SummaryRow label="訂位人" value={form.name || contact.name} />
                  <SummaryRow label="手機號碼" value={form.phone || contact.phone} />
                  <SummaryRow label="特製需求" value={form.request || '無'} />
                </>
              ) : null}
            </div>

            {showMeals ? (
              <>
                <Divider />
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-medium text-ink">已選餐點</span>
                  {cart.length === 0 ? (
                    <p className="text-[13px] text-ink-secondary">未加入餐點，將於現場點餐。</p>
                  ) : (
                    cart.map((line) => {
                      const item = findItem(line.itemId);
                      if (!item) return null;
                      return (
                        <SummaryRow
                          key={line.key}
                          label={`${item.name} x${line.qty}`}
                          value={<Money value={linePrice(line, item) * line.qty} className="text-brand" />}
                        />
                      );
                    })
                  )}
                </div>
              </>
            ) : null}

            {variant === 'custom' && custom ? (
              <>
                <Divider />
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-medium text-ink">客製化點餐</span>
                  <SummaryRow label="活動類型" value={custom.eventType} />
                  <SummaryRow label="整桌預算" value={`$${custom.budget} / 桌`} />
                  <SummaryRow label="包廂" value={custom.privateRoom} />
                  <SummaryRow label="加購飲品" value={custom.addDrinks} />
                </div>
              </>
            ) : null}

            <Divider />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">合計</span>
              <Money value={subtotal} className="text-[20px] font-bold leading-7 text-brand" />
            </div>

            {closed ? (
              <Notice>
                您選擇的時段為本店公休日（每週一），請返回上一步重新選擇日期。
              </Notice>
            ) : null}

            <Button block className={closed ? '!h-11' : undefined} onClick={closed ? () => navigate('/booking-full') : submit}>
              {cta}
            </Button>

            <p className="flex items-start gap-2 text-xs leading-[18px] text-ink-secondary">
              <span aria-hidden>ⓘ</span>
              送出後系統將自動配對桌位；若該時段已滿，將轉人工或提供候補。
            </p>
          </Card>
        }
      />
    </Screen>
  );
}
