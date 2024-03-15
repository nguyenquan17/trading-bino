import BaseDialog from "../../base/BaseDialog/BaseDialog";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import React from "react";
import { IDialog } from "../../interfaces/dialog.type";
import Box from "@mui/material/Box";


const DialogExample = () => {

    const handleOpen = () => {
    }
    const propsDialog: IDialog = {
        name: 'dialog-example',
        width: 'md',
        open: () => handleOpen(),
        title: 'Title Dialog',
        isShowFooter: true,
        classCustom: '',
        children: null,
        action: [
            <Button autoFocus>
                Save changes
            </Button>,
            <Button autoFocus >
                Cancel
            </Button>
        ]
    }
    return (
        <>
            <BaseDialog
                name={propsDialog.name}
                open={propsDialog.open}
                width={propsDialog.width}
                title={propsDialog.title}
                isShowFooter={propsDialog.isShowFooter}
                action={propsDialog.action}
            >
                <Box>
                    <Typography gutterBottom>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                        consectetur ac, vestibulum at eros.
                    </Typography>
                    <Typography gutterBottom>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
                        Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
                    </Typography>
                    <Typography gutterBottom>
                        Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
                        magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
                        ullamcorper nulla non metus auctor fringilla.
                    </Typography>
                </Box>
            </BaseDialog>
        </>
    )
}

export default DialogExample