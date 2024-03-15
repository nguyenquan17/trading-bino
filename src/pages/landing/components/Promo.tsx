import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Link, useNavigate} from "react-router-dom";
import './Promo.scss'
import {Container} from "@mui/material";
import feature1 from "../../../assets/images/landing-vip/feature1.svg"
import feature2 from "../../../assets/images/landing-vip/feature2.svg"
import feature3 from "../../../assets/images/landing-vip/feature3.svg"
import feature4 from "../../../assets/images/landing-vip/feature4.svg"
import {useApp, useSettings} from "../../../contexts";
const Promo = () => {
    const { openAuthDialog } = useSettings();
    const {isAuthenticated} = useApp();
    const navigate = useNavigate();
    const handleUpgradeVip = () => {
        if(isAuthenticated) {
            navigate('/wallet/deposit')
        }else{
            openAuthDialog()
        }
    }
    return (
        <>
            <Box className={'promo'}>
                <Container className={'container'}>
                    <Box className={'logo-wrap'}>
                        <Typography variant="h6" component="div">
                            <Link to={"/"} className="logo-text">
                                <img src="/images/logo.png" alt="logo" />
                                <span>uarax</span>
                            </Link>
                        </Typography>
                    </Box>
                    <h1 className={'title'}>Make the most of your transactions</h1>
                    <Typography className={'desc'}>Enjoy more privileges and elevate your investments to new heights. Deposit a total of $1,000 to become a VIP trader.</Typography>
                    <div className={'btn-vip'} onClick={handleUpgradeVip}>Upgrade to VIP status.</div>
                    <Box className={'features-block'}>
                        <Box className={'block'}>
                            <div className={'icon-wrap'}>
                                <img className="image" loading="lazy" decoding="async"
                                     src={feature1} alt={''}/>
                            </div>
                            <div className={'text-block'}>
                                <Typography>Assets</Typography>
                                <Typography className={'bold'}>75+</Typography>
                            </div>
                        </Box>
                        <Box className={'block'}>
                            <div className={'icon-wrap'}>
                                <img className="image" loading="lazy" decoding="async"
                                     src={feature2} alt={''}/>
                            </div>
                            <div className={'text-block'}>
                                <Typography>refunds</Typography>
                                <Typography className={'bold'}>10%</Typography>
                            </div>
                        </Box>
                        <Box className={'block'}>
                            <div className={'icon-wrap'}>
                                <img className="image" loading="lazy" decoding="async"
                                     src={feature3} alt={''}/>
                            </div>
                            <div className={'text-block'}>
                                <Typography>profits</Typography>
                                <Typography className={'bold'}>up to 90% maximum</Typography>
                            </div>
                        </Box>
                        <Box className={'block'}>
                            <div className={'icon-wrap'}>
                                <img className="image" loading="lazy" decoding="async"
                                     src={feature4} alt={''}/>
                            </div>
                            <div className={'text-block'}>
                                <Typography>Deposit bonus</Typography>
                                <Typography className={'bold'}>up to 300%</Typography>
                            </div>
                        </Box>
                    </Box>
                </Container>

            </Box>
        </>
    )
}
export default Promo