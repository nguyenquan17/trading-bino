import { Box } from "@mui/material";

import TokenSelect from "../../components/TokenSelect/TokenSelect";
import Chart from "./components/Chart";
import TradingPanel from "./components/TradingPanel";
import DashboardSide from "./components/DashboardSide";
import "./Trading.scss";

export default function Trading() {
  return (
    <div className="trading-page">
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
      <Chart />
      <TradingPanel />
    </div>
  );
}
