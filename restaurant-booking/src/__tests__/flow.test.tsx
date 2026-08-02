import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

/**
 * End-to-end walk through the booking flow as the Figma frames sequence it:
 * reservation-v3 → choose-set → choose-drink → contact info → booking success
 */
describe('完整訂位流程', () => {
  it('從選日期一路走到訂位成立', async () => {
    const user = userEvent.setup();
    render(<App />);

    // --- Step 1: Restaurant/reservation-v3 -------------------------------
    expect(screen.getByText('步驟 1 / 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '增加 小孩 (0-7歲)' }));
    await user.click(screen.getByRole('gridcell', { name: '8 月 9 日' }));
    await user.click(screen.getByRole('button', { name: '選擇 11:00' }));
    await user.click(screen.getByRole('button', { name: '下一步：選擇餐點' }));

    // --- Step 2a: Restaurant/choose-set ----------------------------------
    expect(screen.getByText('目前分類：套餐 ‧ 共 6 項')).toBeInTheDocument();

    const setCard = screen
      .getByRole('heading', { name: '雙人分享套餐' })
      .closest('article')!;
    await user.click(within(setCard).getByRole('button', { name: '加入' }));
    await user.click(screen.getByRole('button', { name: '下一步：選擇飲品' }));

    // --- Step 2b: Restaurant/choose-drink --------------------------------
    expect(screen.getByText('目前分類：飲品 ‧ 共 6 項')).toBeInTheDocument();

    const drinkCard = screen
      .getByRole('heading', { name: '招牌錫蘭紅茶' })
      .closest('article')!;
    await user.click(within(drinkCard).getByRole('button', { name: '少冰' }));
    await user.click(within(drinkCard).getByRole('button', { name: '半糖' }));
    await user.click(within(drinkCard).getByRole('button', { name: '珍珠 +$10' }));
    await user.click(screen.getByRole('button', { name: '加入 招牌錫蘭紅茶' }));

    // 790 + (60 + 10) = 860
    const drinkSummary = screen.getByRole('complementary', { name: '已選餐點' });
    expect(within(drinkSummary).getByText('共 2 項')).toBeInTheDocument();
    expect(within(drinkSummary).getByLabelText('小計金額')).toHaveTextContent('$860');

    await user.click(screen.getByRole('button', { name: '下一步：填寫聯絡資料' }));

    // --- Step 3: Restaurant/contact info ---------------------------------
    expect(screen.getByText('步驟 3 / 3')).toBeInTheDocument();

    const contactSummary = screen.getByRole('complementary', { name: '訂位摘要' });
    expect(within(contactSummary).getByText('08/09（日） 11:00')).toBeInTheDocument();
    expect(within(contactSummary).getByText('3 位')).toBeInTheDocument();
    expect(within(contactSummary).getByLabelText('小計金額')).toHaveTextContent('$860');

    await user.type(screen.getByLabelText(/姓名/), '王小姐');
    await user.type(screen.getByLabelText(/手機號碼/), '0912345678');
    await user.click(screen.getByRole('button', { name: '確認訂位' }));

    // --- Restaurant/booking success --------------------------------------
    expect(screen.getByRole('heading', { name: '訂位成立！' })).toBeInTheDocument();

    const info = screen.getByRole('region', { name: '訂位資訊' });
    expect(within(info).getByText('#A20260809-018')).toBeInTheDocument();
    expect(within(info).getByText('王小姐')).toBeInTheDocument();
    expect(within(info).getByText('0912345678')).toBeInTheDocument();
    expect(within(info).getByText('08/09（日） 11:00')).toBeInTheDocument();
    expect(within(info).getByText('3 位')).toBeInTheDocument();
    // 3 位 × $300 訂金
    expect(within(info).getByText('$900')).toBeInTheDocument();
  });

  it('可用返回鍵逐步退回上一個畫面', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('gridcell', { name: '8 月 9 日' }));
    await user.click(screen.getByRole('button', { name: '選擇 11:00' }));
    await user.click(screen.getByRole('button', { name: '下一步：選擇餐點' }));
    await user.click(screen.getByRole('button', { name: '下一步：選擇飲品' }));

    expect(screen.getByText('目前分類：飲品 ‧ 共 6 項')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '選擇餐點' }));
    expect(screen.getByText('目前分類：套餐 ‧ 共 6 項')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '選擇日期' }));
    expect(screen.getByRole('heading', { name: '用餐人數' })).toBeInTheDocument();
  });

  it('已選的日期與時段在返回後仍保留', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('gridcell', { name: '8 月 9 日' }));
    await user.click(screen.getByRole('button', { name: '選擇 11:00' }));
    await user.click(screen.getByRole('button', { name: '下一步：選擇餐點' }));
    await user.click(screen.getByRole('button', { name: '選擇日期' }));

    expect(screen.getByRole('gridcell', { name: '8 月 9 日' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: '選擇 11:00' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('略過餐點也能完成訂位（可略過直接完成訂位）', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('gridcell', { name: '8 月 9 日' }));
    await user.click(screen.getByRole('button', { name: '選擇 11:00' }));
    await user.click(screen.getByRole('button', { name: '下一步：選擇餐點' }));
    await user.click(screen.getByRole('button', { name: '下一步：選擇飲品' }));
    await user.click(screen.getByRole('button', { name: '下一步：填寫聯絡資料' }));

    await user.type(screen.getByLabelText(/姓名/), '陳先生');
    await user.type(screen.getByLabelText(/手機號碼/), '0987654321');
    await user.click(screen.getByRole('button', { name: '確認訂位' }));

    expect(screen.getByRole('heading', { name: '訂位成立！' })).toBeInTheDocument();
  });
});
