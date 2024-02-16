import React, { useState } from "react";
import "./Simple.scss";
import BaseSvgIcon from "../../../base/BaseSvgIcon";
export default function Simple() {
  return (
    <div className="simple container">
      <div
        className="promo"
        id="bg-simple"
        style={{
          backgroundImage: "url('/images/simple-convenient.jpg')",
        }}
      ></div>
      <div className="wrap">
        <p className="article">Simple and convenient</p>
        <div className="item-group">
          <div className="item">
            <div className="img">
              <BaseSvgIcon iconName="demo-l3" size={40}></BaseSvgIcon>
            </div>
            <p className="title">Demo account</p>
            <p className="text">
              Enhance your trading skills at any time with the demo account.
              Once you're prepared, transition to your live account.
            </p>
          </div>
          <div className="item">
            <div className="img">
              <BaseSvgIcon iconName="support-2-l3" size={40}></BaseSvgIcon>
            </div>
            <p className="title">Online support</p>
            <p className="text">
              Feel free to send a message through chat whenever you like, and
              receive instant feedback!
            </p>
          </div>
          <div className="item">
            <div className="img">
              <BaseSvgIcon iconName="study-l3" size={40}></BaseSvgIcon>
            </div>
            <p className="title">Free training</p>
            <p className="text">
              Through delving into the comprehensive knowledge base, you can
              enhance your trading skills to achieve improved results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
