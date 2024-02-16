import { useState } from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Contract, parseUnits } from "ethers";
import { formatNumber, getNetworkName, shortAddress } from "../../lib/Helpers";
import { DEFAULT_ADDRESS, DEFAULT_CHAIN_ID } from "../../lib/Const";
import { useApp, useWeb3 } from "../../contexts";
import Loading from "../../assets/icons/loading.svg";
import { deposit } from "../../apis/AppApi";
import "./_Deposit.scss";

export default function Deposit() {
  const {
    connectWeb3,
    isConnected,
    loading,
    providerChainId,
    account,
    walletBalance,
    ethersProvider,
  } = useWeb3();
  const { balance, user } = useApp();
  const [{ amount, error, status }, setFormValue] = useState<any>({});

  let isInvalid = loading ? false : providerChainId != DEFAULT_CHAIN_ID;

  const handleChange = (e: any) => {
    let { value } = e.target;
    if (value.match(/\./g)?.length > 1) return;
    value = value.replace(/[^0-9.]/g, "");
    setFormValue({ amount: value });
  };

  const handleMax = () => {
    setFormValue({ amount: walletBalance });
  };

  const handleClose = (e: any, reason: any) => {
    if (reason && reason == "backdropClick" && "escapeKeyDown") return;
    setFormValue({});
  };

  const handleSubmit = async () => {
    if (!amount) {
      setFormValue({ error: "Amount is required", amount });
      return;
    }

    const signer = await ethersProvider.getSigner();
    const abi = ["function transfer(address to, uint amount) returns (bool)"];
    const contract = new Contract(DEFAULT_ADDRESS!, abi, signer);
    try {
      setFormValue({ amount, status: "confirm" });
      const tx = await contract.transfer(
        process.env.REACT_APP_RECEIVER,
        parseUnits(amount, 18)
      );
      console.log(tx);
      setFormValue({ amount, status: "transfering" });
      await tx.wait();
      setFormValue({ status: "done" });
      Promise.any([
        addBalance(tx),
        setTimeout(() => Promise.resolve("ok"), 1500),
      ]).then(
        () => setFormValue({ status: "" }),
        () => setFormValue({ status: "" })
      );
    } catch (error: any) {
      setFormValue({
        amount,
        error:
          error?.info?.error?.message ||
          error?.reason ||
          error?.message ||
          "Unkown error",
      });
    }
  };

  function addBalance(tx: string) {
    deposit({
      user_id: user.id,
      address_wallet: account,
      transaction_hex: tx,
      network: providerChainId,
      amount,
    });
  }

  return (
    <div className="deposit-page">
      <Typography variant="h2" component="h2" fontSize={24}>
        Deposit
      </Typography>
      {isConnected ? (
        <>
          {isInvalid ? (
            <>
              <Box color="red">Unsuported chain</Box>
              <Typography>
                Please switch to {getNetworkName(providerChainId!)}
              </Typography>
            </>
          ) : (
            <Box className="deposit-form">
              <Typography mb={1} color="gray">
                Your balance: <strong>{formatNumber(balance ?? 0)}$</strong>
              </Typography>
              <Box className="form-input">
                <input onChange={handleChange} value={amount} />
                <span>
                  <img
                    src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
                    alt="USDT"
                  />
                  USDT
                </span>
              </Box>
              {error && (
                <Typography my={1} color="red">
                  {error}
                </Typography>
              )}
              <Box className="form-actions">
                <Box className="wallet-balance">
                  <button className="max" onClick={handleMax}>
                    Max
                  </button>
                  <Typography color="gray">
                    {formatNumber(walletBalance)}
                  </Typography>
                  <AccountBalanceWalletIcon color="disabled" />
                </Box>
                <Button
                  className="btn submit"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Box py={4}>
          <Button
            className="btn submit"
            variant="contained"
            color="primary"
            onClick={connectWeb3}
            fullWidth
          >
            Connect
          </Button>
        </Box>
      )}
      <Dialog disableEscapeKeyDown open={!!status} onClose={handleClose}>
        <Box className="dialog-transaction_body">
          <Box textAlign="center">
            {status === "done" ? (
              <CheckCircleIcon color="success" fontSize="large" />
            ) : (
              <img src={Loading} width={32} />
            )}
          </Box>
          <Typography component="span" mr={1}>
            {status === "confirm"
              ? "Confirm transfer"
              : status === "transfering"
              ? "Transfering"
              : "Transaction receipt"}
          </Typography>
          {status === "confirm" && (
            <>
              {shortAddress(account!)} send{" "}
              <Typography color="#ffdd3c" component="span">
                {amount} USDT
              </Typography>
            </>
          )}
        </Box>
      </Dialog>
    </div>
  );
}
