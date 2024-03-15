import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode, IChartApi, IPriceLine, ISeriesApi, PriceScaleMode, UTCTimestamp } from "lightweight-charts";

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
import { add0First, roundToNDecimal } from "../../../lib/NumberUtils";
import SocketGlobal from "../../../lib/SocketGlobal";
import { timeToLocal } from "../../../lib/DateTimeUtils";
import { IGNORE_BID_SECONDS } from "../../../lib/Const";
import { useApp } from "../../../contexts";
import BaseSvgIcon from "../../../base/BaseSvgIcon";

export default function Chart() {
  const { tokenCurrent, updateAccountBalance } = useApp();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef();
  const resizeObserver = useRef<ResizeObserver>();
  let historyPrices: Array<ICandle> = [];
  let hozLines: Array<IHozLine> = [];
  let svg: HTMLElement;
  let fakePriceItv: any;
  let candleSeries: ISeriesApi<any>;
  let futureTimeCandleSeries: any;
  let currentChart: IChartApi;
  let currentChartContainer: any;
  let currentResizeObserver: ResizeObserver;
  let visibleTimeRange: IVisibleTime;
  const [showWin, setShowWin] = useState(false);
  const [totalWin, setTotalWin] = useState(0);
  let socketConnected = false;
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
  const socket = SocketGlobal.getInstance(tokenCurrent!.symbol);
  let priceData: Array<any> = [];
  let listOneMinutes: Array<number> = [];
  let list15Minutes: Array<number> = [];
  let futureTimeData: Array<ICandle> = [];
  const VERTICLE_LINE_HEIGHT = 5000;
  const CIRCLE_RADIUS = 18;
  const NEXT_MINUTE_CANDLE_COUNT = 12;
  let balanceInfo: IBalanceInfo;
  let lineSeries: ISeriesApi<any>;
  const nextPrevFromToCandleIndex = 6;
  useEffect(() => {
    return () => {
      if (tokenCurrent) {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      }
    }

  }, [tokenCurrent]);


  useEffect(() => {
    // socket?.connect();
    showLoader();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (!chartContainerRef.current) return;

    if (isMobile()) {
      chartContainerRef.current.setAttribute('style', 'width: 100%; height: ' + (window.innerHeight - 267) + "px !important");
    }
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
  }, []);

  function initSocket(callback: any) {

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

        setVisibleTimeRange();
      }
    });

    socket?.on("channel:bid", (data) => {
      updateAccountBalance();
      priceLines = data.biddingList;
      balanceInfo = data.balanceInfo;
      updateBalanceToHtml();
    });

    socket?.on("channel:bid_result", (data) => {

      let tWin = roundToNDecimal(data.profit, tokenCurrent!.decimal_format);
      updateAccountBalance();
      setTotalWin(tWin);
      if (tWin > 0) {
        // alert(tWin);
        setShowWin(true);
        setTimeout(() => setShowWin(false), 3000);
      }
    });

  }

  function updateBalanceToHtml() {
    // console.log('balance info', JSON.stringify(balanceInfo));
    // const signupBtn = document.querySelector(".signup-btn"); 
    // if (signupBtn) signupBtn!.innerHTML = "$" + balanceInfo.balance;
  }


  function init() {
    currentChartContainer = chartContainerRef.current;
    if (!currentChartContainer) return;


    currentChart = createChart(currentChartContainer, {
      ...chartOptions,
      width: currentChartContainer.clientWidth,
      height: currentChartContainer.clientHeight,
    });

    candleSeries = currentChart.addCandlestickSeries(candleOptions);

    candleSeries.setData(historyPrices);
    currentChart
      .timeScale()
      //@ts-ignore
      .subscribeVisibleTimeRangeChange(visibleTimeRangeChangeHandler);

    futureTimeCandleSeries = currentChart.addCandlestickSeries(
      futureTimeCandleOptions
    );
    lineSeries = currentChart.addLineSeries({
      color: 'transparent',
      lineWidth: 2,
      visible: true,
      priceScaleId: 'lineSeriPricescale',
      lastValueVisible: false,
      crosshairMarkerBackgroundColor: 'transparent',
      crosshairMarkerRadius: 0,
      crosshairMarkerBorderColor: 'transparent'
    });
    //draw horizontal line 
    drawHozLine();
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

  const hozPriceTagHeight = 21;
  function drawHozLine() {

    updateHozData();

    let notiTag = document.querySelector('.hoz-line-icon-container') as HTMLSpanElement;
    currentChart.subscribeClick(function (param: any) {
      let distanceFromRight = distanceFromRightScale(param);
      if (distanceFromRight > 20) {
        return;
      }
      const price = lineSeries.coordinateToPrice(param.point.y)!;
      const hozId = 'line-series-' + tokenCurrent?.symbol + '-' + price;
      const lineSeri = lineSeries.createPriceLine({
        price: price,
        color: 'white',
        lineWidth: 1,
        lineStyle: 1, // Solid line
        axisLabelVisible: false,
        id: hozId,

      });
      hozLines.push(createNotiIcon(lineSeri, (param.point.y - hozPriceTagHeight / 2) + 'px'));
      notiTag.style.display = 'none';
    });

    currentChart.subscribeCrosshairMove(function (param: any) {
      if (param.point) {
        notiTag.style.display = 'flex';
        notiTag.style.top = (param.point.y - hozPriceTagHeight / 2) + 'px';
        notiTag.style.width = getHozTagWidth() + 'px';
        notiTag.innerText = lineSeries.coordinateToPrice(param.point.y)!.toString();
      }
      else {
        notiTag.style.display = 'none';
      }
    });
  }
  function createNotiIcon(lineSeri: IPriceLine, top: string): IHozLine {
    const notiTagGhim = document.createElement('span');
    const clzzName = 'hoz-line-icon-container-ghim';

    notiTagGhim.className = isMobile() ? clzzName + '-mobile' : clzzName;

    let topNum = parseInt(top.replace('px', '')) + 1;
    notiTagGhim.style.top = topNum + 'px';

    //@ts-ignore
    notiTagGhim.style.width = getHozTagWidth() + 'px';
    const price = lineSeri.options().price;
    const id = 'hoz-line-' + tokenCurrent?.symbol + '-' + lineSeri.options().price;
    notiTagGhim.innerText = price.toString();
    notiTagGhim.id = id;

    const hozLine = {
      tagId: id,
      symbol: tokenCurrent?.symbol,
      price: lineSeri.options().price
    } as IHozLine;

    notiTagGhim.addEventListener('click', () => {
      lineSeries.removePriceLine(lineSeri);
      notiTagGhim.remove();
      hozLines = hozLines.filter(e => { return e.price != price; })


    });
    chartContainerRef.current!.appendChild(notiTagGhim);
    return hozLine;
  }
  function updateHozPos() {
    hozLines.forEach(e => {
      const top = lineSeries.priceToCoordinate(e.price)!;
      document.getElementById(e.tagId)!.style.top = (top - hozPriceTagHeight / 2) + 'px';
    });

  }
  function getHozTagWidth() {
    //@ts-ignore
    return (document.querySelectorAll('.tv-lightweight-charts table td')[2]!.offsetWidth + 21);
  }
  function updateHozData() {
    updateHozLineData();
    updateHozPos();

  }
  function updateHozLineData() {
    let seriesData: Array<any> = [...historyPrices.map((value) => {
      return { time: value.time, value: value.open, color: 'transparent' };
    })];
    const futureData = futureTimeData.map((value) => {
      return { time: value.time, value: value.open, color: 'transparent' };
    });
    futureData.forEach((val) => {
      if (seriesData[seriesData.length - 1].time < val.time) {
        seriesData.push(val);
      }
    });
    lineSeries.setData(seriesData);
  }
  function distanceFromRightScale(params: any) {

    const timeScaleWidth = currentChart.timeScale().width();
    const range = Math.abs(timeScaleWidth - params.point.x);
    return range;
  }


  function setVisibleTimeRange() {

    let from =
      historyPrices[
        historyPrices.length > maxCandleOnWeb
          ? historyPrices.length - maxCandleOnWeb + nextPrevFromToCandleIndex
          : 0
      ].time as UTCTimestamp;
    const lastTime = historyPrices[historyPrices.length - nextPrevFromToCandleIndex].time;
    let to = (lastTime + 200) as UTCTimestamp;
    if (isMobile()) {
      from =
        historyPrices[
          historyPrices.length > maxCandleOnMobile
            ? historyPrices.length - maxCandleOnMobile + nextPrevFromToCandleIndex
            : 0
        ].time as UTCTimestamp;
      to = (lastTime + 100) as UTCTimestamp;
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

      const newCandle = {
        time: timeToLocal(data.openTime) + secondsPerCandle,
        closeTime: data.closeTime + 1000 * secondsPerCandle,
        ...data,
      };

      const lastCandle = { ...historyPrices[historyPrices.length - 1] };

      //trong history chưa có cây này
      if (lastCandle.time != newCandle.time) {

        const timeScale = currentChart.timeScale();
        timeScale.scrollToPosition(timeScale.scrollPosition() + 1, true);

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


        historyPrices.push(tempCandle);
        candleSeries.setData(historyPrices);
        updateHozData();

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

    for (var i = 1; i <= candleCount; i++) {
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
    updateHozData();
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
        updateHozPos();
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
    const xCoordinate = timeScale.timeToCoordinate(targetTime as UTCTimestamp);
    const xGreyCoordinate = timeScale.timeToCoordinate(
      targetTime - IGNORE_BID_SECONDS as UTCTimestamp
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
          xPos! - radius / 2,
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
        timeToLocal(priceLines[i].bidTime) + secondsPerCandle as UTCTimestamp
      );
      if (!x1) {
        x1 = timeScale.timeToCoordinate(historyPrices[0].time as UTCTimestamp);
      }
      const y1 = candleSeries.priceToCoordinate(priceLines[i].price)!;


      let x2 = timeScale.timeToCoordinate(
        timeToLocal(priceLines[i].processTime) as UTCTimestamp
      );
      if (!x2) {
        x2 = timeScale.timeToCoordinate(
          futureTimeData[futureTimeData.length - 1].time as UTCTimestamp
        );
      }
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

      const px = x1! - 80;
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
        <span className="hoz-line-icon-container">
        </span>
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
    // lineColor: '#2B2B43',
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
    horzLine: {
      labelBackgroundColor: 'rgb(255, 255, 255)',
    }
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
  visible: false,
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
  pair: String;
  amount: number;
  price: number;
  bidTime: number;
  processTime: number;
  type: String;
}
interface IBalanceInfo {
  demo: number;
  main: number;
  reward: number;
}


interface IHozLine {
  tagId: string;
  symbol: string;
  price: number;
}
