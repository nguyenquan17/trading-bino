import Box from "@mui/material/Box";
import './HeaderTrading.scss'
import { Button } from "@mui/material";
import { useApp, useDialog } from "../../../contexts";
import DialogExample from "../../../components/DialogEvent/DialogExample";
import SocketGlobal from "../../../lib/SocketGlobal";
import { useEffect, useState } from "react";
import { I24hChange } from "../../../apis/interfaces/SocketInterfaces";

const HeaderTrading = () => {
    const { openDialog } = useDialog();
    const { tokenCurrent } = useApp();
    const socket = SocketGlobal.getInstance(tokenCurrent!.symbol);
    const [dataChange, setDataChange] = useState<I24hChange>({ symbol: '', high: 0, low: 0, change: 0, changePercent: '' });
    useEffect(() => {
        socket?.on("channel:24h_change", (data) => {
            setDataChange(data[tokenCurrent!.symbol]);
        });
    }, []);
    return (
        <>
            <Box width='100%' className={'layout-header-trading'}>
                <Box className={'ticker-list-container'}>
                    <div className={'ticker-list'}>
                        <Box className={'ticker-item'}>
                            <div className={'ticker-item-label'}>24h Change</div>
                            <div className={'ticker-item-price'}>
                                <span style={{ display: "flex" }}>
                                    <div>{Math.abs(dataChange.change)}</div>&nbsp;
                                    <div className={dataChange.change < 0 ? 'down' : 'up'}>{(dataChange.change < 0 ? '-' : '+') + dataChange.changePercent}</div>
                                </span>

                            </div>
                        </Box>
                        <Box className={'ticker-item'}>
                            <div className={'ticker-item-label'}>24h High</div>
                            <div className={'ticker-item-price'}>{dataChange.high}</div>
                        </Box>
                        <Box className={'ticker-item'}>
                            <div className={'ticker-item-label'}>24h Low</div>
                            <div className={'ticker-item-price'}>{dataChange.low}</div>
                        </Box>
                    </div>
                </Box>
            </Box>
            <DialogExample ></DialogExample>
        </>
    )
}
export default HeaderTrading;

