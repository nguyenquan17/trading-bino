import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode, Time } from "lightweight-charts";
import { Socket } from "socket.io-client";

import "./Chart.scss";
import { Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { vsprintf } from "sprintf-js";
import {
  getEventEmitter,
  hideLoader,
  isMobile,
  showLoader,
} from "../../../lib/Utils";
import { add0First } from "../../../lib/NumberUtils";
import SocketGlobal from "../../../lib/SocketGlobal";
import { timeToLocal } from "../../../lib/DateTimeUtils";
import { IGNORE_BID_SECONDS } from "../../../lib/Const";
import { useApp } from "../../../contexts";

export default function Chart() {
  const { tokenCurrent } = useApp();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef();
  const resizeObserver = useRef<ResizeObserver>();
  let historyPrices: Array<ICandle> = [];
  let svg: HTMLElement;
  let fakePriceItv: any;
  let candleSeries: any;
  let futureTimeCandleSeries: any;
  let currentChart: any;
  let currentChartContainer: any;
  let currentResizeObserver: ResizeObserver;
  let visibleTimeRange: IVisibleTime;
  const [showWin, setShowWin] = useState(false);
  const [totalWin, setTotalWin] = useState(0);

  const maxCandleOnWeb = 48;
  const maxCandleOnMobile = 28;
  // trong vòng 30 giây không được bid phiên gần nhất
  let secondsPerCandle = 5; // nến 5 giây
  let remainBidseconds = 0;
  let lastRemainBidSeconds = 0;

  let priceLines: Array<IBidding> = [];
  const green = "rgb(6, 240, 6)";
  const red = "rgb(252, 73, 73)";
  const yellow = "#ffdd3c";
  const grey = "#6f7074";
  const socket = SocketGlobal.getInstance(tokenCurrent.symbol);
  let priceData: Array<any> = [];
  let listOneMinutes: Array<number> = [];
  let list15Minutes: Array<number> = [];
  let futureTimeData: Array<ICandle> = [];
  const VERTICLE_LINE_HEIGHT = 5000;
  const CIRCLE_RADIUS = 18;
  const NEXT_MINUTE_CANDLE_COUNT = 12;
  let userInfo: IUser;

  useEffect(() => {
    if (tokenCurrent && socket?.connected) {
      socket.disconnect();
      setTimeout(() => {
        window.location.reload();
      }, 0);
    }
  }, [tokenCurrent]);

  useEffect(() => {
    socket?.connect();
    showLoader();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (!chartContainerRef.current) return;
    initSocket(() => {
      historyPrices = [...priceData].map((item) => {
        return {
          ...item,
          time: timeToLocal(item.openTime) + secondsPerCandle,
          closeTime: item.closeTime + secondsPerCandle * 1000,
        };
      });
      init();
      setTimeout(() => hideLoader(), 300);
    });

    return () => {
      getEventEmitter().removeAllListeners("remainBidSeconds");
      dispose();
    };
  }, [socket]);

  function initSocket(callback: any) {
    // socket.io.opts.extraHeaders![STORE_SYMBOL] = "BTCUSDT";
    // console.log(socket.io.opts.extraHeaders);
    socket?.on("connect", () => {
      // socket.io.opts.extraHeaders![STORE_SYMBOL] = '1';
      // console.log(socket.id);
    });

    socket?.on("channel:history_price", (data) => {
      priceData = data;
      callback();
    });

    socket?.on("channel:time", (data) => {
      listOneMinutes = data.oneMinute;
      list15Minutes = data.fifteenMinute;
      //vẽ thêm 12 cây
      drawFutureTime(NEXT_MINUTE_CANDLE_COUNT);
      if (currentChart) {
        // const timeScale = currentChart.timeScale();
        // timeScale.scrollToPosition(
        //   timeScale.scrollPosition() - (isMobile() ? 1 : 2),
        //   true
        // );
        setVisibleTimeRange();
      }
    });

    socket?.on("channel:bid", (data) => {
      priceLines = data.biddingList;
      userInfo = data.userinfo;
      updateBalanceToHtml();
    });

    socket?.on("channel:bid_result", (data) => {
      let tWin = 0;
      priceLines.map((item) => {
        if (item.processTime == data.processTime) {
          // console.log(item.price, " > ", data.price);
          const winAmount = item.amount * 1.95;
          if (item.type == "betUp" && item.price < data.price) {
            tWin += winAmount;
            userInfo.balance += winAmount;
          } else if (item.type == "betDown" && item.price > data.price) {
            tWin += winAmount;
            userInfo.balance += winAmount;
          }
          updateBalanceToHtml();
        }
      });
      setTotalWin(tWin);
      if (tWin > 0) {
        // alert(tWin);
        setShowWin(true);
        setTimeout(() => setShowWin(false), 3000);
      }
    });

    socket?.on("channel:userinfo", (data) => {
      // console.log(data);
      userInfo = data;

      updateBalanceToHtml();
    });
  }

  function updateBalanceToHtml() {
    const signupBtn = document.querySelector(".signup-btn");
    if (signupBtn) signupBtn!.innerHTML = "$" + userInfo.balance;
  }

  function init() {
    currentChartContainer = chartContainerRef.current;
    if (!currentChartContainer) return;

    updateChartContainerHeight();

    //@ts-ignore
    chart.current = createChart(currentChartContainer, {
      ...chartOptions,
      width: currentChartContainer.clientWidth,
      height: currentChartContainer.clientHeight,
    });

    currentChart = chart.current!;

    candleSeries = currentChart.addCandlestickSeries(candleOptions);
    // console.log(historyPrices);
    candleSeries.setData(historyPrices);
    currentChart
      .timeScale()
      .subscribeVisibleTimeRangeChange(visibleTimeRangeChangeHandler);

    futureTimeCandleSeries = currentChart.addCandlestickSeries(
      futureTimeCandleOptions
    );

    //Tạo thêm thời gian
    drawFutureTime();
    requestAnimationFrame(() => {
      drawMyCanvas();
      drawLineCircle();

      //live giá
      livePrice();

      //visible first time
      setTimeout(() => {
        setVisibleTimeRange();
      }, 200);
    });

    listenWindowResize();

    // document.querySelector(".chart-container")?.removeAttribute("style");
  }

  function listenWindowResize() {
    resizeObserver.current = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        const { width, height } = entries[0].contentRect;
        currentChart.applyOptions({ width, height });
        requestAnimationFrame(() => {
          setVisibleTimeRange();
          updateCanvasSize();
        });
      });
    });
    currentResizeObserver = resizeObserver.current;
    currentResizeObserver.observe(currentChartContainer);
  }

  function updateChartContainerHeight() {
    let height = null;
    if (isMobile()) {
      height =
        window.innerHeight -
        document.querySelector("header")!.clientHeight -
        document.querySelector(".trading-panel")!.clientHeight +
        "px";
    } else {
    }
    currentChartContainer.style.height = height;
  }

  function setVisibleTimeRange() {
    let from =
      historyPrices[
        historyPrices.length > maxCandleOnWeb
          ? historyPrices.length - maxCandleOnWeb
          : 0
      ].time;
    const lastTime = historyPrices[historyPrices.length - 1].time;
    let to = lastTime + 200;
    if (isMobile()) {
      from =
        historyPrices[
          historyPrices.length > maxCandleOnMobile
            ? historyPrices.length - maxCandleOnMobile
            : 0
        ].time;
      to = lastTime + 100;
    }
    currentChart.timeScale().setVisibleRange({
      from: from,
      to: to,
    });
  }

  function dispose() {
    socket?.disconnect();
    clearInterval(fakePriceItv);
    if (currentResizeObserver) currentResizeObserver.disconnect();
  }

  function visibleTimeRangeChangeHandler(newVisibleTimeRange: IVisibleTime) {
    visibleTimeRange = newVisibleTimeRange;
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      showLoader(true);
    } else {
      showLoader(false);
      dispose();
    }
  }

  function livePrice() {
    socket?.on("channel:live_price", (data) => {
      // console.log(data.closePrice);
      const newCandle = {
        time: timeToLocal(data.openTime) + secondsPerCandle,
        closeTime: data.closeTime + 1000 * secondsPerCandle,
        ...data,
      };
      // console.log(newCandle);
      const lastCandle = { ...historyPrices[historyPrices.length - 1] };

      //trong history chưa có cây này
      if (lastCandle.time != newCandle.time) {
        // console.log(newCandle);
        // console.log(
        //   "add candle",
        //   newCandle.time,
        //   timeToLocal(newCandle.closeTime)
        // );
        const timeScale = currentChart.timeScale();
        timeScale.scrollToPosition(timeScale.scrollPosition() + 1, true);

        // console.log(historyPrices[historyPrices.length - 1], newCandle);
        const lastCandle = historyPrices[historyPrices.length - 1];
        const tempCandle = {
          time: newCandle.time,
          openTime: newCandle.openTime,
          closeTime: newCandle.closeTime,
          open: lastCandle.close,
          high: lastCandle.close,
          low: lastCandle.close,
          close: lastCandle.close,
        };
        //         const date = new Date(milliseconds);
        // const formattedDate = date.toISOString();

        historyPrices.push(tempCandle);
        candleSeries.setData(historyPrices);

        requestAnimationFrame(() => {
          drawLineCircle();
        });
      }

      historyPrices[historyPrices.length - 1].closeTime = newCandle.closeTime;

      animatePriceChange(candleSeries, lastCandle.close, newCandle.close, 600);
    });
  }

  function drawMyCanvas() {
    svg = document.getElementById("draw-line-circle")!;
    updateCanvasSize();
  }

  function updateCanvasSize() {
    updateChartContainerHeight();
    const lwCanvas = document.querySelector(".chart-container canvas");
    if (!lwCanvas || !svg) return;

    const pixelRatio = window.devicePixelRatio || 1;
    svg.setAttribute("style", lwCanvas.getAttribute("style")!);
    svg.setAttribute(
      "width",
      (parseInt(lwCanvas.getAttribute("width")!) / pixelRatio).toString()
    );
    svg.setAttribute(
      "height",
      (parseInt(lwCanvas.getAttribute("height")!) / pixelRatio).toString()
    );
  }

  function drawFutureTime(candleCount: number = 40) {
    const lastCandle =
      futureTimeData.length > 0
        ? futureTimeData[futureTimeData.length - 1]
        : priceData[priceData.length - 1];
    if (!lastCandle) return;
    // console.log(lastCandle.time);

    for (var i = 1; i <= candleCount; i++) {
      // console.log(timeToLocal(lastCandle.openTime) + secondsPerCandle * i);
      futureTimeData.push({
        time: timeToLocal(lastCandle.openTime) + secondsPerCandle * i,
        openTime: lastCandle.openTime + secondsPerCandle * 1000 * i,
        closeTime: lastCandle.closeTime + secondsPerCandle * 1000 * i,
        open: lastCandle.close,
        high: lastCandle.close,
        low: lastCandle.close,
        close: lastCandle.close,
      });
    }
    futureTimeCandleSeries.setData(futureTimeData);
  }

  function animatePriceChange(
    candleSeries: any,
    price1: number,
    price2: number,
    time: number
  ) {
    const startTime = performance.now();
    requestAnimationFrame(animationStep);
    function animationStep(timestamp: number) {
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / time, 1);

      const currentPrice = price1 + (price2 - price1) * progress;
      const lastCandle = { ...historyPrices[historyPrices.length - 1] };
      lastCandle.close = currentPrice;
      if (currentPrice > lastCandle.high) lastCandle.high = currentPrice;
      else if (currentPrice < lastCandle.low) lastCandle.low = currentPrice;
      historyPrices[historyPrices.length - 1] = lastCandle;

      candleSeries.setData(historyPrices);

      requestAnimationFrame(() => {
        drawLineCircle();
      });
      if (progress < 1) {
        requestAnimationFrame(animationStep);
      }
    }
  }

  const drawLineCircle = () => {
    if (!svg || !listOneMinutes || listOneMinutes.length == 0) return;
    svg.innerHTML = "";
    let highestHigh = 0;
    historyPrices.forEach((candle) => {
      if (
        candle.high > highestHigh &&
        candle.time >= visibleTimeRange.from &&
        candle.time <= visibleTimeRange.to
      ) {
        highestHigh = candle.high;
      }
    });
    let targetTime = listOneMinutes[0];

    // for (var index = 0; index < targetTimes.length; index++) {
    targetTime = timeToLocal(targetTime);

    // targetTime;
    const targetPrice = highestHigh;
    const timeScale = currentChart.timeScale();
    const xCoordinate = timeScale.timeToCoordinate(targetTime);
    const xGreyCoordinate = timeScale.timeToCoordinate(
      targetTime - IGNORE_BID_SECONDS
    );
    const yCoordinate = candleSeries.priceToCoordinate(targetPrice);
    if (!xCoordinate || !yCoordinate) {
      return;
    }

    remainBidseconds =
      targetTime -
      timeToLocal(historyPrices[historyPrices.length - 1].closeTime);

    if (lastRemainBidSeconds != remainBidseconds) {
      lastRemainBidSeconds = remainBidseconds;
      getEventEmitter().emit("remainBidSeconds", remainBidseconds);
    }

    //vẽ hình tròn với border
    for (var index = 0; index < 2; index++) {
      if (
        (index == 0 && remainBidseconds < IGNORE_BID_SECONDS) ||
        remainBidseconds < 0
      )
        continue;
      // if (index == 0 && remainBidseconds <= 30) continue;
      const radius = CIRCLE_RADIUS;
      const cirStroke = index == 1 ? yellow : grey;
      const cirFill = index == 0 ? "transparent" : "#ffdd3c24";
      const xPos = index == 0 ? xGreyCoordinate : xCoordinate;
      const circle = vsprintf(
        '<circle cx="%s" cy="%s" r="%s" stroke="%s" stroke-width="2" fill="%s"></circle>',
        [xPos, yCoordinate - radius, radius, cirStroke, cirFill]
      );
      let htmlText = "";
      if (
        (index == 0 && remainBidseconds >= IGNORE_BID_SECONDS) ||
        (index == 1 && remainBidseconds < IGNORE_BID_SECONDS)
      ) {
        //vẽ text
        var text = "\n:" + add0First(remainBidseconds);
        htmlText = vsprintf('<text x="%s" y="%s" fill="#fff">%s</text>', [
          xPos - radius / 2,
          yCoordinate - radius / 1.5,
          text,
        ]);
      }

      //vẽ cọc
      const lineStroke = index == 1 ? yellow : grey;
      const verLine = vsprintf(
        '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s"></line>',
        [
          xPos,
          yCoordinate,
          xPos,
          yCoordinate + VERTICLE_LINE_HEIGHT,
          lineStroke,
        ]
      );

      svg.innerHTML += circle + htmlText + verLine;
    }

    drawBetLines();
  };

  const drawBetLines = () => {
    if (!svg) return;

    const list = [];
    const timeScale = currentChart.timeScale();
    for (var i = 0; i < priceLines.length; i++) {
      if (
        priceLines[i].processTime <
        historyPrices[historyPrices.length - 1].closeTime
      ) {
        continue;
      }

      let x1 = timeScale.timeToCoordinate(
        timeToLocal(priceLines[i].bidTime) + secondsPerCandle
      );
      if (!x1) {
        x1 = timeScale.timeToCoordinate(historyPrices[0].time);
      }
      const y1 = candleSeries.priceToCoordinate(priceLines[i].price);
      // console.log(x1);
      // console.log(
      //   priceLines[i],
      //   timeToLocal(priceLines[i].processTime) -
      //     timeToLocal(priceLines[i].bidTime)
      // );

      let x2 = timeScale.timeToCoordinate(
        timeToLocal(priceLines[i].processTime)
      );
      if (!x2) {
        x2 = timeScale.timeToCoordinate(
          futureTimeData[futureTimeData.length - 1].time
        );
      }
      // console.log(x2);
      const y2 = y1;

      list.push(
        vsprintf('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s"></line>', [
          x1,
          y1,
          x2,
          y2,
          priceLines[i].type == "betUp" ? "green" : "red",
        ])
      );

      const px = x1 - 80;
      const py = y1 - 15;
      const tx = px + 20;
      const ty = py + 20;
      //price tag
      list.push(
        vsprintf(
          '<rect width="80" height="30" x="%s" y="%s" rx="10" ry="10" stroke="%s" fill="#6f707441"/> ',
          [px, py, priceLines[i].type == "betUp" ? "green" : "red", "%"]
        )
      );
      list.push(
        vsprintf(' <text x="%s" y="%s"  fill="#fff"> $%s</text>', [
          tx,
          ty,
          priceLines[i].amount,
        ])
      );
      const radius = 3;
      list.push(
        vsprintf(
          '<circle cx="%s" cy="%s" r="%s"  stroke-width="2" fill="%s"></circle>',
          [x2, y2, 3, priceLines[i].type == "betUp" ? green : red]
        )
      );
    }
    if (list.length > 0) {
      svg.innerHTML += list.join("\n");
    }
  };

  return (
    <>
      <div
        ref={chartContainerRef}
        className="chart-container"
        style={{ width: "100%" }}
      >
        <svg id="draw-line-circle"></svg>
      </div>

      <Dialog
        id="loading-dialog-container"
        open={showWin}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="loading-dialog"
      >
        <DialogContent>
          <div className="win">
            <img src="/images/icons/medal.png" />
            <div className="title">Win: + ${totalWin}</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const chartOptions = {
  layout: {
    background: { color: "#1e1f22" },
    textColor: "rgba(255, 255, 255, 0.9)",
  },
  grid: {
    vertLines: {
      color: "#2a2b30",
    },
    horzLines: {
      color: "#2a2b30",
    },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  timeScale: {
    // visible: false,
    borderColor: "transparent",
    timeVisible: true,
    secondsVisible: true,
    daysVisible: false, // Không hiển thị ngày
    monthsVisible: false,
    yearsVisible: false,
    // tickMarkFormatter: dateFormatter,
    borderVisible: false,
    fixLeftEdge: true,
    rightBarStaysOnScroll: true,
    // lockVisibleTimeRangeOnResize: true,
    // rightOffset: 0,
  },
};
const candleOptions = {
  upColor: "#14c679",
  borderUpColor: "#14c679",
  downColor: "#ff646c",
  borderDownColor: "#ff646c",
  wickDownColor: "#ff646c",
  wickUpColor: "#14c679",
};
const futureTimeCandleOptions = {
  lastValueVisible: false,
  priceLineVisible: false,
  upColor: "transparent",
  borderVisible: false,
  downColor: "transparent",
  borderColor: "transparent",
  borderDownColor: "transparent",
  borderUpColor: "transparent",
  wickColor: "transparent",
  wickDownColor: "transparent",
  wickUpColor: "transparent",
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ICandle {
  time: number; //là dữ liệu openTime sau khi convert sang múi giờ mặc định của trình duyệt
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface IVisibleTime {
  from: number;
  to: number;
}

interface IBidding {
  authtoken: String;
  pair: String;
  uid: String;
  amount: number;
  price: number;
  bidTime: number;
  processTime: number;
  ip: String;
  type: String;
}
interface IUser {
  authtoken: string;
  uid: string;
  balance: number;
}
