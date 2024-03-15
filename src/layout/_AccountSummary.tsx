import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Box, Button, FormControlLabel, Menu, MenuItem, Radio, RadioGroup, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import LogoutIcon from "@mui/icons-material/Logout";
import WalletIcon from "@mui/icons-material/Wallet";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoopIcon from "@mui/icons-material/Loop";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useApp } from "../contexts/AppContext";
import { logout } from "../apis/AuthApi";
import { formatNumber } from "../lib/NumberUtils";
import "./_AccountSummary.scss";
import { getProfile } from "../apis/UserApi";
import { UserProfile } from "../apis/interfaces/UserInterfaces";
import { ACCOUNT_TYPE, ACCOUNT_TYPE_BONUS, ACCOUNT_TYPE_COMMISSION, ACCOUNT_TYPE_DEFAULT, ACCOUNT_TYPE_DEMO, ACCOUNT_TYPE_MAIN, AccountBalance, STORE_AUTH_TOKEN } from "../lib/Const";
import LocalStorage from "../lib/LocalStorage";
import { profile } from "console";
import Fade from '@mui/material/Fade';
import BaseSvgIcon from "../base/BaseSvgIcon";

interface LayoutProps {
  signUpBtn: React.ReactNode;
}
export function AccountSummary(props: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticate, updateAccountBalance, accountBalances, accountType, updateAccountType, isAuthenticated, userFetching } = useApp();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElAccount, setAnchorElAccount] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openAccount = Boolean(anchorElAccount)
  // const [valueSwitchAccount, setValueSwitchAccount] = React.useState(
  //     mainAccount?.type
  // );

  const [refreshBalance, setRefreshBalance] = useState(false)

  const handleChangeAccount = (event: React.ChangeEvent<HTMLInputElement>) => {

    // @ts-ignore
    updateAccountType((event.target as HTMLInputElement).value);
    accountBalances.forEach((accountBalance) => {
      if (accountBalance.type === event.target.value) {
        updateAccountType!(accountBalance.type)
      }
    })
    handleClose()
  };
  let getAccountBalancesVisible = (): Map<ACCOUNT_TYPE, AccountBalance> => {
    const list: Map<ACCOUNT_TYPE, AccountBalance> = new Map<ACCOUNT_TYPE, AccountBalance>();
    accountBalances.forEach((accountBalance) => {

      if (accountBalance.type != ACCOUNT_TYPE_COMMISSION) {
        list.set(accountBalance.type, accountBalance);

      }
    });
    return list;
  }
  const handleClickMenu = (ab: any) => {
    accountBalances.forEach((accountBalance) => {
      if (accountBalance.type === ab.type) {
        updateAccountType!(accountBalance.type)
      }
    })
    if (location.pathname !== "/trading") {
      navigate("/trading")
    }
    handleClose()
  }
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickAvatar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAccount(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElAccount(null)
  };
  const handleLogout = async () => {
    setAnchorEl(null);
    try {
      await logout();
      authenticate(null);
      updateAccountType(ACCOUNT_TYPE_DEFAULT);
      window.location.href = '/trading';
    } catch (error) { }
    handleClose()

  };

  const handleDeposit = () => {
    if (typeof window.ethereum === "undefined") {
      setShowModal(true);
    } else {
      navigate("/wallet/deposit");
    }
    handleClose()
  };

  const handleWidthdraw = () => {
    if (typeof window.ethereum === "undefined") {
      setShowModal(true);
    } else {
      navigate("/wallet/withdraw");
    }
    handleClose()
  }
  const handleSignin = () => {
    navigate("/auth#signin");
    handleClose();
  }

  const handleRedirectToAccount = () => {
    navigate("/account");
    handleClose()
  }

  const refetchBalance = (e: any) => {
    setRefreshBalance(!refreshBalance)
    updateAccountBalance(() => { e.stopPropagation(); });

  };
  const getAccountTypeLabel = (type: ACCOUNT_TYPE) => {
    switch (type) {
      case ACCOUNT_TYPE_MAIN:
        return 'Real Account';
      case ACCOUNT_TYPE_BONUS:
        return 'Bonus Account';
      case ACCOUNT_TYPE_COMMISSION:
        return 'Commission Account';
      default:
        return 'Demo Account'
    }

  }
  return <>
    {!userFetching && <>
      <div className="account-summary">
        {isAuthenticated && <>
          <Button className={'btn-deposit'} onClick={handleDeposit}>
            <WalletIcon />
            <Typography ml={1}>Deposit</Typography>
          </Button>
          {/* <Button className={'btn-withdraw'} onClick={handleWidthdraw}>
            <WalletIcon />
            <Typography ml={1}>Withdraw</Typography>
          </Button> */}
          {/* <button onClick={refetchBalance} className={'custom-reload-balance'}>
            <LoopIcon className={`icon-reload ${refreshBalance ? 'active' : null}`} />
          </button> */}
        </>
        }
        <Button aria-expanded={open ? "true" : undefined} onClick={handleClick}>
          {/*<small>{userProfile?.email}</small>*/}
          <Box className={'switch-account'}>
            <Typography>{getAccountTypeLabel(accountType)}</Typography>
            <ArrowDropDownIcon fontSize={'small'} />
          </Box>
          <span className="balance">
            {formatNumber(accountBalances.get(accountType)!.balance)}$
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
          TransitionComponent={Fade}
        >

          {Array.from(getAccountBalancesVisible()).map(([key, ab]) => (
            <MenuItem onClick={() => handleClickMenu(ab)} key={'account-balance' + ab.type}>
              <Box className={'box-account'}>
                <FormControlLabel
                  className={'form-control-radio'}
                  value=""
                  control={
                    <Radio
                      checked={accountType === ab.type}
                      onChange={handleChangeAccount}
                      value={ab.type}
                      name="radio-buttons"
                      inputProps={{ 'aria-label': 'A' }}
                    />
                  } label={getAccountTypeLabel(ab.type)}
                />
                <Typography>${formatNumber(ab.balance)}</Typography>
              </Box>
            </MenuItem>
          ))}
          {!isAuthenticated &&
            <MenuItem onClick={handleSignin}>
              <LogoutIcon />
              <Typography ml={1}>Sign in</Typography>
            </MenuItem>}
        </Menu>

        <Box className={'box-avatar'}>

          {!isAuthenticated ? props.signUpBtn :
            <Box className={'box-avatar'}>
              <Avatar className={'avatar'} onClick={handleClickAvatar}>Q</Avatar>
              <Menu
                anchorEl={anchorElAccount}
                open={openAccount}
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
                  <Typography ml={1}>Wallet</Typography>
                </MenuItem>
                <MenuItem onClick={handleRedirectToAccount}>
                  <AccountCircleIcon />
                  <Typography ml={1}>Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon />
                  <Typography ml={1}>Sign out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          }
        </Box>
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
      </Dialog></>}
  </>

}
