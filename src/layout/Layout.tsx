import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { hideLoader } from "../lib/Utils";
import AuthDialog from "../components/AuthDialog/AuthDialog";
import { useApp } from "../contexts/AppContext";
import Header from "./_Header";
import Footer from "./_Footer";
import DialogRecommend from "../components/DialogEvent/DialogRecommend";
import DialogEvent from "../components/DialogEvent/DialogEvent";


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
      <div className={'wrapper'}>
          <Header />
          <Outlet />
          {!hideFooter && <Footer />}
          <AuthDialog />
          {/*<DialogRecommend />*/}
          {/*<DialogEvent />*/}
      </div>
    </>
  );
}
