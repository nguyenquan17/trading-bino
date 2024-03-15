import { Box } from "@mui/material";

import TokenSelect from "../../components/TokenSelect/TokenSelect";
import Chart from "./components/Chart";
import TradingPanel from "./components/TradingPanel";
import DashboardSide from "./components/DashboardSide";
import "./Trading.scss";
import HeaderTrading from "./components/HeaderTrading";
import { useApp } from "../../contexts/AppContext";
export default function Trading() {
  const { tokenList } = useApp();
  return (

    <div className="trading-page">
      {tokenList.length > 0 &&
        <>
          <Box
            className="token-select-wrap"
            sx={{
              position: "absolute",
              zIndex: 99,
              top: 20,
              left: 0,
            }}
          >
            <TokenSelect />
          </Box>
          <DashboardSide />
          <Box width='100%'>
            <HeaderTrading />
            <Chart />
          </Box>
          <TradingPanel />
        </>
      }
    </div>

  );
}
