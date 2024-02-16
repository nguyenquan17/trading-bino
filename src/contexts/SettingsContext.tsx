import React, { useContext } from 'react';
import { useDisclosure } from '../hooks/useDisclosure';

export type SettingContent = {
  showAuthDialog: boolean,
  openAuthDialog: () => void,
  closeAuthDialog: () => void,
}

const SettingsContext = React.createContext<SettingContent>({
  showAuthDialog: false,
  openAuthDialog: () => { },
  closeAuthDialog: () => { },
});

export const SettingsProvider = ({ children }: any) => {

  const {
    isOpen: showAuthDialog,
    open: openAuthDialog,
    close: closeAuthDialog,
  } = useDisclosure(false);

  return (
    <SettingsContext.Provider
      value={{
        showAuthDialog,
        openAuthDialog,
        closeAuthDialog,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
