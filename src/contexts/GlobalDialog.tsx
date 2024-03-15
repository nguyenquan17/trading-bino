import React, { createContext, useState, useContext } from 'react';
import {DIALOG_NAME} from "../interfaces/dialog.type";

export type ContextType = {
    dialogs: string[],
    openDialog: (name: DIALOG_NAME, isOpen: boolean) => void,
}

//merge array
const getUnion = (array1: any, array2:any) => {
    const difference = array1.filter((element: any) => !array2.includes(element));

    return [...difference, ...array2];
}
// Create context
const DialogContext = createContext<ContextType>({
    dialogs: [],
    openDialog: (name, isOpen) => {}
});

// Provider component
export const DialogProvider = ({ children }: any) => {
    const [dialogs, setDialogs] = useState<string[]>([]);

    const openDialog = (dialogName: DIALOG_NAME, isOpen = true) => {
        if (isOpen) {
            const unionDialog: string[] = getUnion(dialogs, [dialogName])
            setDialogs(prevState => ([...prevState,...unionDialog]))
        } else {
            setDialogs(prevState => dialogs.filter((value: string) => {
                return value !== dialogName
            }))
        }
    }

    return (
        <DialogContext.Provider value={{ dialogs, openDialog }}>
            {children}
        </DialogContext.Provider>
    );
};

export const useDialog = () => {
    return useContext(DialogContext);
};