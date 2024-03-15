import {Box, Button, TextField, Typography} from "@mui/material"
import BaseButton from "../../base/BaseButton/BaseButton";
import './ForgotPassword.scss'
const ForgotPassword = () => {
  return (
      <>
          <Box className={'password-recovery'}>
              <Typography className={'title'} variant='h5' mb={4}>Password recovery</Typography>
              <Typography>Password reset link will be emailed to you.</Typography>
              <Box mb={3}>
                  <TextField
                      className={'custom-input'}
                      label="Email"
                      variant="filled"
                      style={{ width: "100%" }}
                      size="small"

                  />
              </Box>
              <Button className={'custom-btn'}>Send</Button>
              <Typography sx={{cursor: 'pointer'}}>Back</Typography>
          </Box>
      </>
  )
}
export default ForgotPassword