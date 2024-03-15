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
import Profile from "./pages/profile/Profile";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Wallet from "./pages/wallet/Wallet";
import Withdraw from "./pages/wallet/components/Withdraw"
import DepositWallet from "./pages/wallet/components/Deposit"
import ChoosePaymentAmount from "./pages/wallet/components/ChoosePaymentAmount";
import LandingVip from "./pages/landing/LandingVip";
import AiTrading from "./pages/trading/components/ai-trading/AiTrading";

export default function () {
  const { isAuthenticated, userFetching } = useApp();
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
          {(isAuthenticated || userFetching) ? (
            <>
              {/*<Route path="deposit" element={<Deposit />} />*/}
              <Route path="account" element={<Profile />} />
              <Route path="wallet" element={<Wallet />} >
                <Route path="deposit1" element={<Deposit />} ></Route>
                <Route path="deposit" element={<ChoosePaymentAmount />} />
                <Route path="withdraw" element={<Withdraw />} />
              </Route>
              <Route path="ai-trading" element={<AiTrading />}/>
            </>
          ) : (
            <>
              <Route path="auth" element={<Auth />} />
              <Route path="password-recovery" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          )}
        </Route>
        <Route path="/vip" element={<LandingVip />}></Route>
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
