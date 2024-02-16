import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import LogoutIcon from "@mui/icons-material/Logout";
import WalletIcon from "@mui/icons-material/Wallet";
import LoopIcon from "@mui/icons-material/Loop";
import { useApp } from "../contexts/AppContext";
import { logout } from "../apis/AuthApi";
import { formatNumber } from "../lib/NumberUtils";
import "./_AccountSummary.scss";

export function AccountSummary() {
  const navigate = useNavigate();
  const { balance, user, authenticate } = useApp();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    try {
      await logout();
      authenticate(null);
    } catch (error) {}
  };

  const handleDeposit = () => {
    if (typeof window.ethereum === "undefined") {
      setShowModal(true);
    } else {
      navigate("/deposit");
    }
  };

  const refetchBalance = (e: any) => {
    e.stopPropagation();
  };

  return user ? (
    <>
      <div className="account-summary">
        <button onClick={refetchBalance}>
          <LoopIcon />
        </button>
        <Button aria-expanded={open ? "true" : undefined} onClick={handleClick}>
          <small>{user?.email}</small>
          <span className="balance">
            {formatNumber(parseFloat((balance || 0)?.toString()), 2)}$
          </span>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            className: "account-summary-list",
            style: {
              width: 200,
            },
          }}
        >
          <MenuItem onClick={handleDeposit}>
            <WalletIcon />
            <Typography ml={1}>Deposit</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon />
            <Typography ml={1}>Sign out</Typography>
          </MenuItem>
        </Menu>
      </div>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <Box p={2}>
          <p>
            Please install Metamask wallet extension first.
            <br />
            Install{" "}
            <a href="https://metamask.io/download" target="_blank">
              here!
            </a>
          </p>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  ) : null;
}
