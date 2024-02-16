import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";

import BaseSvgIcon from "../base/BaseSvgIcon";
import { AccountSummary } from "./_AccountSummary";
import { useSettings } from "../contexts/SettingsContext";
import { useApp } from "../contexts/AppContext";
import TokenSelect from "../components/TokenSelect/TokenSelect";
import "./_Header.scss";

export default function Header() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();
  const { openAuthDialog } = useSettings();
  const { isAuthenticated } = useApp();
  const [isTrading, setIsTrading] = useState(false);

  useEffect(() => {
    setIsTrading(pathname == "/trading");
  }, [pathname]);

  const handleSignUp = () => {
    if (pathname === "/auth") {
      if (hash != "#signup") {
        navigate("/auth#signup");
      }
    } else {
      if (document.body.clientWidth < 768) {
        navigate(`/auth?redirect=${pathname}${search || ""}#signup`);
      } else {
        openAuthDialog();
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="appbar">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: { md: 2 } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            <Link to={"/"} id="logo-text">
              <img src="/images/logo.png" alt="logo" />
              <span>uarax</span>
            </Link>
          </Typography>

          {isTrading && <TokenSelect />}

          <div className="actions">
            {isAuthenticated ? (
              <AccountSummary />
            ) : (
              <button className="signup-btn" onClick={handleSignUp}>
                <BaseSvgIcon iconName="sign-l2" size={20}></BaseSvgIcon>
                <span>Sign up</span>
              </button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
