import React, { useState } from "react";
import "./Home.scss";
import SmartInvest from "./components/SmartInvest";
import Numbers from "./components/Numbers";
import Benefit from "./components/Benefit";
import TradeAnywhere from "./components/TradeAnywhere";
import Simple from "./components/Simple";
export default function Home() {
  return (
    <div className="home-page">
      <SmartInvest />
      <Numbers />
      <Benefit />
      <TradeAnywhere />
      <Simple />
    </div>
  );
}
