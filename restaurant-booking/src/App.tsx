import { useState } from 'react';
import { ReservationScreen } from './screens/ReservationScreen';
import { ChooseSetScreen } from './screens/ChooseSetScreen';
import { ChooseDrinkScreen } from './screens/ChooseDrinkScreen';
import { ContactInfoScreen } from './screens/ContactInfoScreen';
import { BookingSuccessScreen } from './screens/BookingSuccessScreen';
import {
  initialBooking,
  makeReservationId,
  type BookingState,
  type CartLine,
  type DrinkOptions,
} from './booking';
import type { MenuItem } from './data/menu';

let lineCounter = 0;
const nextLineId = () => `line-${++lineCounter}`;

export function App({ initialState }: { initialState?: Partial<BookingState> } = {}) {
  const [state, setState] = useState<BookingState>({
    ...initialBooking,
    ...initialState,
  });

  const patch = (next: Partial<BookingState>) =>
    setState((prev) => ({ ...prev, ...next }));

  const addLine = (line: Omit<CartLine, 'lineId'>) =>
    setState((prev) => {
      // Same item with identical options collapses into one line.
      const existing = prev.cart.find(
        (l) =>
          l.item.id === line.item.id &&
          JSON.stringify(l.options ?? null) === JSON.stringify(line.options ?? null),
      );
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map((l) =>
            l.lineId === existing.lineId
              ? { ...l, quantity: l.quantity + line.quantity }
              : l,
          ),
        };
      }
      return { ...prev, cart: [...prev.cart, { ...line, lineId: nextLineId() }] };
    });

  const removeLine = (lineId: string) =>
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((l) => l.lineId !== lineId),
    }));

  switch (state.screen) {
    case 'choose-set':
      return (
        <ChooseSetScreen
          state={state}
          onAdd={(item: MenuItem) => addLine({ item, quantity: 1, kind: 'set' })}
          onRemove={removeLine}
          onNext={() => patch({ screen: 'choose-drink' })}
          onBack={() => patch({ screen: 'reservation' })}
        />
      );

    case 'choose-drink':
      return (
        <ChooseDrinkScreen
          state={state}
          onAdd={(item: MenuItem, options: DrinkOptions) =>
            addLine({ item, quantity: 1, kind: 'drink', options })
          }
          onRemove={removeLine}
          onNext={() => patch({ screen: 'contact-info' })}
          onBack={() => patch({ screen: 'choose-set' })}
        />
      );

    case 'contact-info':
      return (
        <ContactInfoScreen
          state={state}
          onChange={patch}
          onSubmit={() =>
            patch({
              screen: 'booking-success',
              reservationId: makeReservationId(state.date, 18),
            })
          }
          onBack={() => patch({ screen: 'choose-drink' })}
        />
      );

    case 'booking-success':
      return (
        <BookingSuccessScreen
          state={state}
          onCancelReservation={() => setState({ ...initialBooking })}
          onPayDeposit={() => undefined}
          onBack={() => patch({ screen: 'reservation' })}
        />
      );

    case 'reservation':
    default:
      return (
        <ReservationScreen
          state={state}
          onChange={patch}
          onNext={() => patch({ screen: 'choose-set' })}
          onBack={() => patch({ screen: 'reservation' })}
        />
      );
  }
}
