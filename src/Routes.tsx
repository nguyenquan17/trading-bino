import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Layout from "./layout/Layout";
import Trading from "./pages/trading/Trading";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Auth from "./pages/auth/Auth";
import Agreement from "./pages/agreement/Agreement";
import Privacy from "./pages/privacy/Privacy";
import Deposit from "./pages/deposit/Deposit";
import { useApp } from "./contexts";

export default function () {
  const { isAuthenticated } = useApp();
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="trading" element={<Trading />} />
          <Route path="about" element={<About />} />
          <Route path="agreement" element={<Agreement />} />
          <Route path="privacy" element={<Privacy />} />
          {/* <Route path="*" element={<Home data={data} />} /> */}
          {isAuthenticated ? (
            <>
              <Route path="deposit" element={<Deposit />} />
            </>
          ) : (
            <>
              <Route path="auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
