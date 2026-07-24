import { Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './state/BookingContext';
import Home from './pages/Home';
import Reservation from './pages/Reservation';
import Meal from './pages/Meal';
import Contact from './pages/Contact';
import BookingSuccess from './pages/BookingSuccess';
import Search from './pages/Search';

/**
 * 第28區中餐廳 — 線上訂位系統
 * Core reservation flow ported from the Figma "Restaurant Reservation system":
 *   Home → Reservation → Meal → Contact → Booking success  (+ Search)
 */
export default function App() {
  return (
    <BookingProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/meal" element={<Meal />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/success" element={<BookingSuccess />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BookingProvider>
  );
}
