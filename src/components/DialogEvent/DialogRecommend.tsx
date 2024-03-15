import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BaseButton from "../../base/BaseButton/BaseButton";
import EastIcon from '@mui/icons-material/East';
import './DialogRecommend.scss'
const DialogRecommend = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        handleClickOpen()
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
            }}
            maxWidth={ 'sm'}
            className={'dialog-rec-deposit'}
        >
            <DialogContent sx={{
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0, 0.8)',
                minWidth: '400px',
                color: '#fff',
                padding: '36px'
            }}>
                <Box>
                    <Typography component="div" sx={{color: '#246fda', textTransform: 'uppercase', fontWeight: 600, fontSize: '14px', paddingBottom: '32px'}}>Recommended to you</Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '24px'
                    }}>
                        <Typography component="div" paddingBottom={2} sx={{
                            fontWeight: 800,
                            fontSize: '20px',
                            lineHeight: '24px'
                        }}>Real</Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'end'
                            }}
                        >
                            <Typography component="div" sx={{fontSize: '14px'}}>Minimal deposit</Typography>
                            <Typography component="span" sx={{fontWeight: 600}}>$10</Typography>

                        </Box>
                    </Box>
                    <Box className={'content-box'}>
                        <Box className={'description'} >
                            <EastIcon sx={{ fontSize:16, marginRight: '6px' }}/>
                            <Typography component="div">Real account - real funds!</Typography>
                        </Box>
                        <Box className={'description'}>
                            <EastIcon sx={{ fontSize:16, marginRight: '6px' }}/>
                            <Typography component="div">Withdraw your income 24/7</Typography>
                        </Box>
                        <Box className={'description'}>
                            <EastIcon sx={{ fontSize:16, marginRight: '6px' }}/>
                            <Typography component="div">Account 70+ popular assets with a profitability of up to 90%</Typography>
                        </Box>
                        <Box className={'description'}>
                            <EastIcon sx={{ fontSize:16, marginRight: '6px' }}/>
                            <Typography component="div">Complete in tournaments, get extra funds as prizes!</Typography>
                        </Box>
                    </Box>
                    <BaseButton onClick={() => handleClose()} style={{width: '120px'}}>Deposit</BaseButton>
                </Box>


            </DialogContent>
        </Dialog>
    )
}

export default DialogRecommend