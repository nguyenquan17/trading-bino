import { SettingsProvider } from "./contexts/SettingsContext";
import { AppProvider, Web3Provider } from "./contexts";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { theme } from "./lib/Theme";
import Routes from "./Routes";
import "./assets/css/App.scss";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Web3Provider>
          <AppProvider>
            <SettingsProvider>
              <Routes />
            </SettingsProvider>
          </AppProvider>
        </Web3Provider>
      </ThemeProvider>
    </div>
  );
}
