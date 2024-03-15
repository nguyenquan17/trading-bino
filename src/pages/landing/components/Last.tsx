import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Link, useNavigate} from "react-router-dom";
import {Container} from "@mui/material";
import './Last.scss'
import {useApp, useSettings} from "../../../contexts";
const Last = () => {
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
            <Box className={'last'}>
                <Container className={'container'}>
                    <h1 className={'title'}>Elevate your trading to new heights</h1>
                    <Typography className={'desc'}>The total amount deposited must be $1000. Deposit money into your account and enjoy all the privileges of VIP status right now.
                    </Typography>
                    <div className={'btn-vip'} onClick={handleUpgradeVip}>Become a VIP</div>
                </Container>
            </Box>
        </>
    )
}
export default Last