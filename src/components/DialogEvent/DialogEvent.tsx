import {Button, Dialog, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import './DialogEvent.scss'
import BaseButton from "../../base/BaseButton/BaseButton";
import {useDialog} from "../../contexts/GlobalDialog";
const DialogEvent = () => {
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
            maxWidth={ 'md'}
            className={'dialog-event'}
        >
            <DialogTitle id="alert-dialog-title" sx={{
                textAlign: 'center',
                backgroundColor: '#2a2b30',
                color: '#fff',
                padding: '48px 0',
                fontSize: '36px',
                fontWeight: 600,
                lineHeight: '48px',
                // borderRadius: '12px'
            }}
                className={'dialog-title'}
            >
                {"Welcome to Quarax!"}
            </DialogTitle>
            <DialogContent className={'dialog-content'} sx={{
                textAlign: 'center',
                backgroundColor: '#2a2b30',
            }}>
                <DialogContentText id="alert-dialog-description" className={'dialog-content-text'} sx={{color: '#fff', paddingBottom: '24px'}}>
                    The tutorial will guide you through your first steps on the platform. Please, pick the option describes your trading experience best.
                </DialogContentText>

                <Box className={'dialog-content-box'} sx={{display: 'flex', justifyContent: 'space-between', color: '#fff', paddingBottom: '24px'}}>
                    <Box className={'dialog-content-box__item'} sx={{padding: '36px 92px', backgroundColor: '#3d4247', borderRadius: '12px', flex: '0 0 48%'}}>
                        <Typography variant="h5" component="div" fontWeight={600} paddingBottom={2}>Never traded before</Typography>
                        <Typography>Teach me the basics</Typography>
                    </Box>
                    <Box className={'dialog-content-box__item'} sx={{padding: '36px 92px', backgroundColor: '#3d4247', borderRadius: '12px', flex: '0 0 48%'}}>
                        <Typography variant="h5" component="div" fontWeight={600} paddingBottom={2}>Already traded</Typography>
                        <Typography>Show me how it's here</Typography>
                    </Box>
                </Box>
                <Box>
                    <BaseButton onClick={() => handleClose()}>Let's start</BaseButton>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default DialogEvent