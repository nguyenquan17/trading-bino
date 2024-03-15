import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import './Withdraw.scss'
import BaseSvgIcon from "../../../base/BaseSvgIcon";
import {useNavigate} from "react-router-dom";

const Withdraw = ({emitTab}: any) => {

  return (
      <>
        <Box className={'wallet-withdraw'}>
            <Box className={'deposit-now-block'}>
                <Box className={'notify-body'}>
                    <div className={'title'}>
                        <div className={'description'}>
                            To withdraw funds, you need to deposit first in any way convenient for you
                        </div>
                        <div>
                            <Button className={'custom-btn'} onClick={() => emitTab(0)}>
                                Deposit now
                            </Button>
                        </div>
                    </div>
                    <div className={'benefits'}>
                        <div className={'benefit'}>
                            <BaseSvgIcon iconName="clocke-filled" size={24}></BaseSvgIcon>
                            <p>Withdraw your funds 24/7</p>
                        </div>
                        <div className={'benefit'}>
                            <BaseSvgIcon iconName='coin-stack' size={24}></BaseSvgIcon>
                            <p>Withdrawal fee starts with 0%</p>
                        </div>
                        <div className={'benefit'}>
                            <BaseSvgIcon iconName='wallet' size={24}></BaseSvgIcon>
                            <p>Wide range of convenient methods</p>
                        </div>
                        <div className={'benefit'}>
                            <BaseSvgIcon iconName='calender' size={24}></BaseSvgIcon>
                            <p>95% of withdrawals are processed within 30 minutes</p>
                        </div>
                    </div>
                    <div className={'licenses'}>
                        <a href="#">
                            Licenses and regulations
                        </a>
                    </div>
                </Box>
            </Box>
        </Box>
      </>
  )
}
export default Withdraw