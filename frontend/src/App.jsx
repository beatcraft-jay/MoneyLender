import { BrowserRouter, Route, Routes } from "react-router-dom";

import { DefaultProviders } from "./components/providers/default.jsx";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import ApplicantsPage from "./pages/applicants.jsx";
import LoansPage from "./pages/loans.jsx";
import PaymentsPage from "./pages/payments.jsx";
import AgreementsPage from "./pages/agreements.jsx";
import NotificationsPage from "./pages/notifications.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Landing from "./pages/landing.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/applicants" element={<ApplicantsPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/agreements" element={<AgreementsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}