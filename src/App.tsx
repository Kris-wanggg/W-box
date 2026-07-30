import { Navigate, Route, Routes } from 'react-router-dom';
import Reservation from './pages/Reservation';
import Meals from './pages/Meals';
import Contact from './pages/Contact';
import BookingSuccess from './pages/BookingSuccess';
import Payment from './pages/Payment';
import PaySuccess from './pages/PaySuccess';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Reservation />} />
      <Route path="/meals" element={<Meals />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/success" element={<BookingSuccess />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/pay-success" element={<PaySuccess />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
