import {ReactElement} from "react";
export type DIALOG_NAME =
    | 'dialog-event'
    | 'dialog-recommend'
    | 'dialog-example'
    | ''
export interface IDialog {
    name: DIALOG_NAME,
    width: string,
    open: () => void,
    title: string,
    isShowFooter?: boolean,
    classCustom?: string,
    children: any,
    action: ReactElement[]
}

