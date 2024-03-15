import React, { useState, useEffect } from "react";
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
import {Popover} from "@mui/material";

export default function Header() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();
  const { openAuthDialog } = useSettings();
  const [isTrading, setIsTrading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [tabActive, setTabActive] = useState('AI_TRADING')
  const tabs = [
    {
      id: 1,
      tabName: 'User Vip',
      value: 'USER_VIP',
      pathName: '/ai-trading'
    },
    {
      id: 2,
      tabName: 'Trade Stats',
      value: 'TRADE_STATS',
      pathName: '/ai-trading'
    },
    {
      id: 3,
      tabName: 'Ai Trading',
      value: 'AI_TRADING',
      pathName: '/ai-trading'
    }
  ]

  const handleChangeTab = (tab: Record<string, any>) => {
    setTabActive(tab.value)
    navigate(tab.pathName)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              className={'popover-menu'}
          >
            <Typography sx={{ p: 2 }}>VIP</Typography>
          </Popover>
          <Typography variant="h6" component="div">
            <Link to={"/"} id="logo-text">
              <img src="/images/logo.png" alt="logo" />
              <span>uarax</span>
            </Link>
          </Typography>

          {isTrading && <TokenSelect />}

          <div className={'tabs'}>
            {tabs.map((tabItem) => {
              return (
                  <div className={`tab-item${tabItem.value === tabActive ? ' active' : ''}`} onClick={() => handleChangeTab(tabItem)}>{tabItem.tabName}</div>
              )
            })}
          </div>

          <div className="actions">
            <AccountSummary signUpBtn={<button className="signup-btn" onClick={handleSignUp}>
              <BaseSvgIcon iconName="sign-l2" size={20}></BaseSvgIcon>
              <span>Sign up</span>
            </button>} />

          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
