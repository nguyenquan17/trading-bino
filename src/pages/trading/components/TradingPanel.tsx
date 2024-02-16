import { useEffect, useState } from "react";
import BaseSvgIcon from "../../../base/BaseSvgIcon";

import "./TradingPanel.scss";
import { getEventEmitter, isMobile } from "../../../lib/Utils";
import { Popover, PopoverOrigin } from "@mui/material";
import SocketGlobal from "../../../lib/SocketGlobal";
import { IGNORE_BID_SECONDS } from "../../../lib/Const";
import { useApp } from "../../../contexts/AppContext";
import LocalStorage from "../../../lib/LocalStorage";
import { Socket } from "socket.io-client";

export default function TradingPanel() {
  const { tokenCurrent } = useApp();
  const [numUsdt, setNumUsdt] = useState(
    LocalStorage.getUserSettings("bid_amount", 1)
  );
  const [numMinute, setNumMinute] = useState(1);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const [openPriceOptionPopover, setOpenPriceOptionPopover] = useState(false);
  const [openTimeOptionPopover, setOpenTimeOptionPopover] = useState(false);
  const pricePopoverId = "price-option-popover";
  const timePopoverId = "time-option-popover";
  const socket = SocketGlobal.getInstance(tokenCurrent.symbol);
  const [time1Options, setTime1Options] = useState([]);
  const [time15Options, setTime15Options] = useState([]);
  const [selectedTime, setSelectedTime] = useState(0);
  const [anchorOrigin, setAnchorOrigin] = useState<PopoverOrigin>({
    vertical: "top",
    horizontal: "left",
  });
  const [transformOrigin, setTransformOrigin] = useState<PopoverOrigin>({
    vertical: "top",
    horizontal: "right",
  });

  useEffect(() => {
    socket?.on("channel:time", (data) => {
      if (data) {
        const oneMinutes = data.oneMinute;
        const fifteenMinutes = data.fifteenMinute;
        setTime1Options(oneMinutes);
        setTime15Options(fifteenMinutes);

        if (oneMinutes[0] > selectedTime) {
          setSelectedTime(oneMinutes[0]);
        }
      }
    });
    if (isMobile()) {
      setAnchorOrigin({
        vertical: "top",
        horizontal: "center",
      });
      setTransformOrigin({
        vertical: "bottom",
        horizontal: "center",
      });
    }
    setTimeout(() => {
      setAnchorEl(document.querySelector(".trading-panel") as HTMLElement);
    }, 100);
  }, []);

  useEffect(() => {
    getEventEmitter().addListener(
      "remainBidSeconds",
      (remainBidSeconds: number) => {
        // console.log("xxxxxxxxxx" + remainBidSeconds);
        if (remainBidSeconds < IGNORE_BID_SECONDS) {
          // console.log(selectedTime, " == ", time1Options[0]);
          if (selectedTime == time1Options[0]) {
            // console.log("vao day");
            setSelectedTime(time1Options[1]);
          }
          // setTime1Options(time1Options.slice(1));
        }
      }
    );
  }, [time15Options, time1Options]);

  const priceOptions = [1, 5, 10, 20, 50, 100, 200, 1000, 2000, 5000];

  const plusOneUsdt = () => {
    const value = numUsdt + 1;
    LocalStorage.setUserSettings("bid_amount", value);
    setNumUsdt(value);
  };
  const minusOneUsdt = () => {
    const value = numUsdt - 1;
    if (value >= 1) {
      LocalStorage.setUserSettings("bid_amount", value);
      setNumUsdt(value);
    }
  };

  const plusOneMinute = () => {
    setNumMinute(numMinute + 1);
  };
  const minusOneMinute = () => {
    if (numMinute - 1 >= 1) {
      setNumMinute(numMinute - 1);
    }
  };
  const selecUsdt = (num: number) => {
    setNumUsdt(num);
  };
  const milisecondsToHM = (milliseconds: number) => {
    const date = new Date(milliseconds);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const formattedDateTime = `${hours}:${minutes}`;

    return formattedDateTime;
  };
  return (
    <>
      <div className="trading-panel">
        <div className="input-counters">
          <div className="input_input-content">
            <div className="input_input-helper">
              <span className="currency">$</span>
              <div className="hydrated">
                <input
                  type="number"
                  value={numUsdt}
                  readOnly
                  aria-describedby={pricePopoverId}
                  onClick={() => setOpenPriceOptionPopover(true)}
                />
                <div className="number_controls">
                  <div
                    className="number_btn-control"
                    onClick={() => plusOneUsdt()}
                  >
                    <BaseSvgIcon
                      className="number_icon icon_host hydrated"
                      iconName="plus-l1"
                      size={16}
                    ></BaseSvgIcon>
                  </div>
                  <div
                    className="number_btn-control"
                    onClick={() => minusOneUsdt()}
                  >
                    <BaseSvgIcon
                      className="number_icon icon_host hydrated"
                      iconName="minus-l1"
                      size={16}
                    ></BaseSvgIcon>
                  </div>
                </div>
              </div>

              <div className="input_placeholder">
                <span className="input_title">Amount</span>
              </div>
            </div>
          </div>

          <div className="input_input-content">
            <div className="input_input-helper">
              <div className="hydrated">
                <input
                  type="text"
                  value={milisecondsToHM(selectedTime)}
                  readOnly
                  aria-describedby={timePopoverId}
                  onClick={() => setOpenTimeOptionPopover(true)}
                />
                <div className="number_controls">
                  <div
                    className="number_btn-control"
                    onClick={() => plusOneMinute()}
                  >
                    <BaseSvgIcon
                      className="number_icon icon_host hydrated"
                      iconName="plus-l1"
                      size={16}
                    ></BaseSvgIcon>
                  </div>
                  <div
                    className="number_btn-control"
                    onClick={() => minusOneMinute()}
                  >
                    <BaseSvgIcon
                      className="number_icon icon_host hydrated"
                      iconName="minus-l1"
                      size={16}
                    ></BaseSvgIcon>
                  </div>
                </div>
              </div>
              <div className="input_placeholder">
                <span className="input_title">Time</span>
              </div>
            </div>
          </div>
        </div>
        <div className="deals-info">
          <p className="earn text-primary">
            <span className="earn-text ">Earnings</span>
            <span className="earn-number">+{tokenCurrent.profit}%</span>
          </p>
          <p className="asset-rate">$41,400</p>
        </div>
        <div className="trade-menu">
          <div className="majority-opinion">
            <p className="text-secondary ">Majority opinion</p>
            <div className="ratio">
              <div className="green-progress"></div>
            </div>
            <div className="label">
              <span className="up">50%</span>
              <span className="down">50%</span>
            </div>
          </div>
        </div>
        <div className="bid-btn">
          <button
            type="button"
            className="up"
            onClick={() => {
              socket?.emit("channel:bid", {
                type: "betUp",
                usdt: numUsdt,
                processTime: selectedTime,
              });
            }}
          >
            <BaseSvgIcon
              className="up_icon"
              iconName="up_filled-l2"
              size={16}
            ></BaseSvgIcon>
          </button>
          <button
            type="button"
            className="down"
            onClick={() => {
              socket?.emit("channel:bid", {
                type: "betDown",
                usdt: numUsdt,
                processTime: selectedTime,
              });
            }}
          >
            <BaseSvgIcon
              className="down_icon"
              iconName="down_filled-l2"
              size={16}
            ></BaseSvgIcon>
          </button>
        </div>
      </div>
      <Popover
        id={pricePopoverId}
        open={openPriceOptionPopover}
        anchorEl={anchorEl}
        onClose={() => setOpenPriceOptionPopover(false)}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <ul>
          {priceOptions.map((value: number) => {
            return (
              <li
                key={"price-option-" + value}
                onClick={() => {
                  selecUsdt(value);
                  setOpenPriceOptionPopover(false);
                }}
              >
                ${value}
              </li>
            );
          })}
        </ul>
      </Popover>

      <Popover
        id={timePopoverId}
        open={openTimeOptionPopover}
        anchorEl={anchorEl}
        onClose={() => setOpenTimeOptionPopover(false)}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <ul>
          {time15Options &&
            time15Options.map((value: number) => {
              return (
                <li
                  key={"time-option-" + value}
                  onClick={() => {
                    setOpenTimeOptionPopover(false);
                    setSelectedTime(value);
                  }}
                >
                  {milisecondsToHM(value)}
                </li>
              );
            })}
        </ul>

        <ul>
          {time1Options &&
            time1Options.map((value: number) => {
              return (
                <li
                  key={"time-option-" + value}
                  onClick={() => {
                    setOpenTimeOptionPopover(false);
                    setSelectedTime(value);
                  }}
                >
                  {milisecondsToHM(value)}
                </li>
              );
            })}
        </ul>
      </Popover>
    </>
  );
}
