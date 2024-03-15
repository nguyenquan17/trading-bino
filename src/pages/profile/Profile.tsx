import Box from "@mui/material/Box";
import AccountDetails from "./Components/AccountDetails";
import Kyc from "./Components/Kyc";
import React, {useState} from "react";
import {Tab, Tabs} from "@mui/material";
import './Profile.scss'
const Profile = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
  return (
      <>
          <Box className={'layout-profile'} sx={{width: '100%', height:'64px', borderBottom: 1, borderColor: 'divider'}}>
              <Tabs className={'custom-tabs'} value={value} onChange={handleChange} centered sx={{height: '64px'}}>
                  <Tab className={'tab-item'} label="Account Details" />
                  <Tab className={'tab-item'} label="Kyc" />
              </Tabs>
          </Box>
          <Box sx={{width: '100%'}}>
              {
                  value === 0 ? <AccountDetails /> : <Kyc/>
              }
          </Box>
      </>
  )
}
export default Profile