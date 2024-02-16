import React, { useState } from "react";
import "./SmartInvest.scss";
import { useNavigate } from "react-router-dom";
export default function SmartInvest() {
  const navigate = useNavigate();
  return (
    <div className="smart-invest promo">
      <div className="wrap">
        <div className="promotion">
          <h1 className="promotion__title">Intelligent Investments</h1>
          <div className="promotion__description">
            <p>Sign up and get $10,000 in a demo account.</p>
            <p>
              Enhance your trading abilities and unlock a wide range of
              financial possibilities through Quarax
            </p>
          </div>
          <button
            className="button_btn"
            onClick={() => {
              navigate("/trading");
            }}
          >
            <span className="button_text-wrapper">Try demo</span>
          </button>
          <p className="promotion__try-demo-desc" data-try-demo="desc">
            No registration required
          </p>
        </div>
        <div className="awards">
          <div className="item">
            <img className="img" src="/images/icons/iair-award.svg" />
            <p className="text">IAIR Awards</p>
          </div>
          <div className="item">
            <img className="img" src="/images/icons/fe-award.svg" />
            <p className="text">FE Awards</p>
          </div>
          <div className="item">
            <img
              className="img"
              src="/images/icons/financial-commisson-icon.svg"
            />
            <div className="text">
              <p>Financial Commission</p>
              <p className="subtitle">Category A</p>
            </div>
          </div>
          <div className="item">
            <img
              className="img"
              src="/images/icons/quote-from-leading-icon.svg"
            />
            <p className="text">Quotes from leading agencies</p>
          </div>
        </div>
      </div>
    </div>
  );
}
