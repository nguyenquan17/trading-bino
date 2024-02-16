import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Dialog, Box, Typography, Tab, Tabs, AppBar } from '@mui/material';

import { useSettings } from '../../contexts/SettingsContext';
import Signup from '../Signup/Signup';
import Signin from '../Signin/Signin';
import './AuthDialog.scss';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AuthDialog() {
  const theme = useTheme();
  const { showAuthDialog, closeAuthDialog } = useSettings();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Dialog onClose={closeAuthDialog} open={showAuthDialog}>
      <Box className="auth-dialog">
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab label="Registration" />
            <Tab label="Login" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Signup
            onSwitch={() => setValue(1)}
            isDark={true}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Signin
            onSwitch={() => setValue(0)}
            isDark={true}
          />
        </TabPanel>
      </Box>
    </Dialog>
  );
}
