import React, { useState } from "react";
import "./Benefit.scss";
export default function Benefit() {
  return (
    <div className="benefits container">
      <div className="wrap">
        <p className="article">The advantages offered by the platform</p>
        <div className="row">
          <div className="item">
            <img src="/images/icons/minimum-account-balance.svg" />
            <p className="title">
              The lowest required account balance from $10
            </p>
            <p className="text-body">
              Initiate trading with minimal investment amounts.
            </p>
          </div>
          <div className="item">
            <img src="/images/icons/trade-amount-starting-from-1.svg" />
            <p className="title">
              Trade amount
              <br /> starting from $1
            </p>
            <p className="text-body">
              The trade incurs a very low minimum cost. This ensures that you
              won't risk a substantial amount of funds as you're still learning
              the ropes of trading.
            </p>
          </div>
          <div className="item">
            <img src="/images/icons/unique-mode-of-trading.svg" />
            <p className="title">
              An exclusive
              <br /> of trading: ‘Non-stop’
            </p>
            <p className="text-body">
              The platform imposes no limitations on the quantity of concurrent
              trades. You can initiate multiple positions simultaneously and
              carry on with your trading activities.
            </p>
          </div>
          <div className="item">
            <img src="/images/icons/work-also-on-the-weekends.svg" />
            <p className="title">
              Operate even
              <br /> during weekends
            </p>
            <p className="text-body">
              Certain quote sources are accessible exclusively on business days.
              To enhance your convenience, we have integrated diverse choices,
              enabling you to engage in trading over weekends and select the
              most appropriate assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
