import Box from "@mui/material/Box";
import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import './Reasons.scss'
import reason1 from '../../../assets/images/landing-vip/reason1.png'
import reason2 from '../../../assets/images/landing-vip/reason2.png'
import reason3 from '../../../assets/images/landing-vip/reason3.png'
import reason4 from '../../../assets/images/landing-vip/reason4.png'
import reason5 from '../../../assets/images/landing-vip/reason5.png'
const Reasons = () => {
    return (
        <>
            <Box className={'reasons'}>
                <Container className={'container'}>
                    <h2 className={'title'}>
                        Other reasons to upgrade to VIP status.
                    </h2>
                    <Box className={'row'}>
                        <Box className={'img-wrap'}>
                            <img className="image" loading="lazy"
                                 src={reason1} alt=''/>
                        </Box>
                        <Box className={'text-block'}>
                            <Typography className={'name'}>1 REASON</Typography>
                            <Typography component={'h3'} className={'title-block'}>Personalized management</Typography>
                            <Typography className={'desc'}>Any questions you have will be supported individually. Personalized management will provide you with:</Typography>
                            <ul>
                                <li>Personal consultation on trading and market conditions to improve your results.</li>
                                <li>Special offers and bonuses to help you trade successfully and enthusiastically.</li>
                                <li>Latest trading strategies and recommendations.</li>
                            </ul>
                        </Box>
                    </Box>
                    <Box className={'row'}>
                        <Box className={'img-wrap'}>
                            <img className="image" loading="lazy"
                                 src={reason2} alt=''/>
                        </Box>
                        <Box className={'text-block'}>
                            <Typography className={'name'}>2 REASON</Typography>
                            <Typography component={'h3'} className={'title-block'}>Compensation for losses.</Typography>
                            <Typography className={'desc'}>Unsuccessful trades in VIP status are no longer daunting. Each week, you will receive 10% of your weekly losses as cashback. Use the formula to calculate the amount you can recover:</Typography>
                            <div className={'cashback'}>
                                <p>Cashback = (amount deposited - amount withdrawn - account balance) * 10%</p>
                            </div>
                        </Box>
                    </Box>
                    <Box className={'row'}>
                        <Box className={'img-wrap'}>
                            <img className="image" loading="lazy"
                                 src={reason3} alt=''/>
                        </Box>
                        <Box className={'text-block'}>
                            <Typography className={'name'}>3 REASON</Typography>
                            <Typography component={'h3'} className={'title-block'}>Investment capital insurance</Typography>
                            <Typography className={'desc'}>Trading comes with many risks, which is why we're here to support you. Protect your investment capital with our free insurance program. If your balance reaches 0, we will refund a portion of your investment capital in either real money or bonuses.</Typography>
                        </Box>
                    </Box>
                    <Box className={'row'}>
                        <Box className={'img-wrap'}>
                            <img className="image" loading="lazy"
                                 src={reason4} alt=''/>
                        </Box>
                        <Box className={'text-block'}>
                            <Typography className={'name'}>4 REASON</Typography>
                            <Typography component={'h3'} className={'title-block'}>Special offers</Typography>
                            <Typography className={'desc'}>You will regularly receive special offers and gifts to help you increase your profits:</Typography>
                            <ul>
                                <li>Boosting additional funds for risk-free trades.</li>
                                <li>Deposit bonus up to 300% for your account.</li>
                                <li>Accept invitations to join exclusive free tournaments with big prizes.</li>
                            </ul>
                        </Box>
                    </Box>
                    <Box className={'row'}>
                        <Box className={'img-wrap'}>
                            <img className="image" loading="lazy"
                                 src={reason5} alt=''/>
                        </Box>
                        <Box className={'text-block'}>
                            <Typography className={'name'}>5 REASON</Typography>
                            <Typography component={'h3'} className={'title-block'}>Advanced VIP app</Typography>
                            <Typography className={'desc'}>Handle the energy of superiority in trading with the exclusive Android app Quarax. Take everything you need from its unique features:</Typography>
                            <ul>
                                <li>The Scalp Pro indicator and drawing tools for chart reading</li>
                                <li>Callback from your personal manager in just 2 clicks</li>
                                <li>Trading on 3 assets simultaneously</li>
                            </ul>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    )
}
export default Reasons