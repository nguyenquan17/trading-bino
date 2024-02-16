import React, { useEffect } from "react";
import Menu, { MenuProps } from "@mui/material/Menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { fetchTokenList } from "../../apis/AppApi";
import { useApp } from "../../contexts/AppContext";
import { TokenSymbol } from "../../interfaces/TokenSymbol";
import "./TokenSelect.scss";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.mode === "light" ? "#FFFFFF" : "#2a2b30",
    borderRadius: 6,
    marginTop: theme.spacing(1),
    width: 320,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      theme.palette.mode === "light"
        ? "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px"
        : "0 8px 16px rgba(0, 0, 0, .3), 0px 12px 32px rgba(0, 0, 0, .4)",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiTableRow-root": {
      "&.active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiPaper-root": {
      width: "100vw",
      maxWidth: "unset",
      left: "0!important",
      bottom: "0!important",
    },
  },
}));

export default function TokenSelect() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [tokens, setTokens] = React.useState([]);
  const { tokenCurrent, updateTokenCurrent } = useApp();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchTokenList()
      .then((res) => {
        setTokens(res.data);
      })
      .catch();
  }, []);

  return (
    <Box className="token-select" ml={2}>
      <Button
        className="token-select-button"
        variant="outlined"
        color="inherit"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {tokenCurrent.name} {tokenCurrent.profit}%
      </Button>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <div style={{ height: 400, width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell>Profit</TableCell>
                <TableCell>For VIP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens.map((token: TokenSymbol) => (
                <TableRow
                  key={token.symbol}
                  className={
                    token.symbol == tokenCurrent.symbol ? "active" : ""
                  }
                  onClick={() => {
                    updateTokenCurrent?.(token);
                    handleClose();
                  }}
                >
                  <TableCell>{token.name}</TableCell>
                  <TableCell>{token.profit}%</TableCell>
                  <TableCell>{token.profit}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </StyledMenu>
    </Box>
  );
}
