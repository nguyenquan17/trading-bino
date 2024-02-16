import React, { useState } from "react";
import "./Numbers.scss";
export default function Numbers() {
  return (
    <div className="indicators container">
      <div className="wrap">
        <div className="group">
          <div className="inner">
            <p className="title" id="traders">
              900 334
            </p>
            <p className="subtitle">Active traders daily</p>
          </div>
          <div className="inner">
            <p className="title">133</p>
            <p className="subtitle">Countries of presence</p>
          </div>

          <div className="inner">
            <p className="title" id="successfulDeals">
              36 058 893
            </p>
            <p className="subtitle">Successful trades in the past week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
