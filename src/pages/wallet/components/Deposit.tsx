import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import './Deposit.scss'
import { Outlet, useNavigate } from "react-router-dom";
const Deposit = () => {
    const navigate = useNavigate()
    const tokenList = [
        {
            id: 0,
            icon: 'https://binomoidr.com/uploads/payment_systems/binance_pay/icons/1660205762.svg',
            name: 'Binance Pay',
            routeName: 'BNB'
        },
        {
            id: 1,
            icon: 'https://binomoidr.com/uploads/payment_systems/USDTT/icons/1635952949.svg',
            name: 'Tether USD TRC20 token (USDT)',
            routeName: 'USDTT'
        },
        {
            id: 2,
            icon: 'https://binomoidr.com/uploads/payment_systems/BTC/icons/1635950991.svg',
            name: 'Bitcoin (BTC)',
            routeName: 'BTC'
        },
        {
            id: 3,
            icon: 'https://binomoidr.com/uploads/payment_systems/ETH/icons/1635952767.svg',
            name: 'Ethereum (ETH)',
            routeName: 'ETH'
        },
        {
            id: 3,
            icon: 'https://binomoidr.com/uploads/payment_systems/USDC/icons/1635952871.svg',
            name: 'USD Coin ERC20 token (USDC)',
            routeName: 'USDC'
        },
        {
            id: 4,
            icon: 'https://binomoidr.com/uploads/payment_systems/USDTE/icons/1635952910.svg',
            name: 'Tether USD ERC20 token (USDT)',
            routeName: 'USDTE'
        }
    ]
    return (
        <>
            <Box className={'wallet-deposit'}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }} py={3}>
                        <CurrencyBitcoinIcon className={'icon-deposit-method'} />
                        <Typography>Crypto wallets</Typography>
                    </Box>
                    <Box className={'cards'}>
                        {tokenList.map((item, index) => {
                            return (
                                <div key={index} className={'card-item'} onClick={() => navigate(`/wallet/deposit/${item.routeName}`)}>
                                    <img src={item.icon} alt="" />
                                    <p>{item.name}</p>
                                </div>
                            )
                        })}
                    </Box>
                </Box>
            </Box>
            {/*<Outlet />*/}

        </>
    )
}
export default Deposit