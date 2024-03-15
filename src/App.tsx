import { SettingsProvider } from "./contexts/SettingsContext";
import { AppProvider } from "./contexts";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { theme } from "./lib/Theme";
import Routes from "./Routes";
import "./assets/css/App.scss";
import { DialogProvider } from "./contexts/GlobalDialog";
import { SnackbarProvider } from "notistack";
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <AppProvider>
            <DialogProvider>
              <SettingsProvider>
                <Routes />
              </SettingsProvider>
            </DialogProvider>
          </AppProvider>
        </ThemeProvider>
      </div>
    </SnackbarProvider>

  );
}
