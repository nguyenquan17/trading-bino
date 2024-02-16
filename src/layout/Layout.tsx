import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { hideLoader } from "../lib/Utils";
import AuthDialog from "../components/AuthDialog/AuthDialog";
import { useApp } from "../contexts/AppContext";
import Header from "./_Header";
import Footer from "./_Footer";

export default function Layout({}) {
  const location = useLocation();
  const { userFetching } = useApp();
  const [hideFooter, setHideFooter] = useState(false);

  useEffect(() => {
    if (!userFetching) {
      hideLoader();
    }
    setHideFooter(["/trading", "/auth"].includes(location.pathname));
  }, [location, userFetching]);

  return (
    <>
      <Header />
      <Outlet />
      {!hideFooter && <Footer />}
      <AuthDialog />
    </>
  );
}
