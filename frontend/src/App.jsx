
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TransactionForm from "./components/TransactionForm";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Search from "./pages/Search";
import Budgets from "./pages/Budgets";

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected application pages */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/add-transaction"
          element={isLoggedIn ? <TransactionForm /> : <Navigate to="/login" />}
        />

        <Route
          path="/edit-transaction/:id"
          element={isLoggedIn ? <TransactionForm /> : <Navigate to="/login" />}
        />

        <Route
          path="/analytics"
          element={isLoggedIn ? <Analytics /> : <Navigate to="/login" />}
        />

        <Route
          path="/reports"
          element={isLoggedIn ? <Reports /> : <Navigate to="/login" />}
        />

        <Route
          path="/search"
          element={isLoggedIn ? <Search /> : <Navigate to="/login" />}
        />

        <Route
          path="/budgets"
          element={isLoggedIn ? <Budgets /> : <Navigate to="/login" />}
        />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
