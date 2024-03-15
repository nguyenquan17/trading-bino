import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import React, { ReactElement, useEffect } from "react";
import { useDialog } from "../../contexts";
import { DIALOG_NAME, IDialog } from "../../interfaces/dialog.type";


const defaultProps = {
    name: '' as DIALOG_NAME,
    width: 'md',
    open: () => { },
    title: '',
    isShowFooter: true,
    classCustom: '',
    children: null,
    action: []
} satisfies Partial<IDialog>
const BaseDialog: React.FC<IDialog> = (props) => {
    const { dialogs, openDialog } = useDialog();

    const isOpen = dialogs.findIndex((value: string) => {
        return value === props.name
    }) !== -1
    const handleClose = () => {
        openDialog(props.name, !isOpen)
    };

    useEffect(() => {
        props.open()
    }, [isOpen]);
    return (
        <>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={isOpen}
                className={props.classCustom}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {props.title}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers >
                    {props.children}
                </DialogContent>
                {props.isShowFooter && <DialogActions>{props.action}</DialogActions>}
            </Dialog>
        </>
    )
}

export default BaseDialog