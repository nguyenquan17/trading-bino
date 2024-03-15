import Promo from "./components/Promo";
import Last from "./components/Last";
import Reasons from "./components/Reasons";
import { hideLoader } from "../../lib/Utils";
import {useEffect} from "react";
import Box from "@mui/material/Box";
import Footer from "../../layout/_Footer";
import './LandingVip.scss'
import AuthDialog from "../../components/AuthDialog/AuthDialog";
const LandingVip = () => {

    useEffect(() => {
        hideLoader()
    }, []);
    return (
        <>
            <Box sx={{color: '#fff'}}>
                <Promo />
                <Reasons />
                <Last />
                <div className={'custom-footer'}>
                    <Footer />
                </div>
                <AuthDialog />
            </Box>
        </>
    )
}
export default LandingVip