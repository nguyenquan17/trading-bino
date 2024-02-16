import React, { useState } from "react";
import "./TradeAnywhere.scss";
export default function TradeAnywhere() {
  return (
    <div className="trade-anywhere">
      <div className="container">
        <div className="desc">
          <p className="title">
            Trade <br />
            from anywhere!
          </p>
          <p className="text">
            Trade at your convenience from anywhere using the Quorax app on both
            iOS and Android devices. Stay informed with real-time updates on
            trade closures, promotions, and tournaments.
          </p>
        </div>
        <img src="/images/desktop.png" className="img" />
      </div>
    </div>
  );
}
