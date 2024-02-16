import React, { useState } from "react";
import BaseSvgIcon from "../../../base/BaseSvgIcon";

import "./DashboardSide.scss";

export default function DashboardSide() {
  return (
    <div className="dashboard-side">
      <div className="it">
        <BaseSvgIcon
          className="clock_icon"
          iconName="clock-l2"
          size={24}
        ></BaseSvgIcon>
        <span>Traders</span>
      </div>
      <div className="it">
        <BaseSvgIcon
          className="whats_new_icon"
          iconName="horn-l2"
          size={24}
        ></BaseSvgIcon>
        <span> What's new</span>
      </div>
      <div className="it">
        <BaseSvgIcon
          className="top_trader_icon"
          iconName="medal-l2"
          size={24}
        ></BaseSvgIcon>
        <span> Top traders</span>
      </div>
      <div className="it">
        <BaseSvgIcon
          className="tournament_icon"
          iconName="cup-l2"
          size={24}
        ></BaseSvgIcon>
        <span>Tournaments</span>
      </div>
    </div>
  );
}
