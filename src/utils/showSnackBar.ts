import {enqueueSnackbar} from "notistack";

export const snackActions = {
    success(msg: string) {
        enqueueSnackbar(msg, {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: { vertical: "top", horizontal: "center" }
        })
    },
    error(msg: string) {
        enqueueSnackbar(msg, {
            variant: 'error',
            autoHideDuration: 3000,
            anchorOrigin: { vertical: "top", horizontal: "center" }
        })
    },
    warning(msg: string) {
        enqueueSnackbar(msg, {
            variant: 'warning',
            autoHideDuration: 3000,
            anchorOrigin: { vertical: "top", horizontal: "center" }
        })
    },
    default(msg: string) {
        enqueueSnackbar(msg, {
            variant: 'default',
            autoHideDuration: 3000,
            anchorOrigin: { vertical: "top", horizontal: "center" }
        })
    }
}