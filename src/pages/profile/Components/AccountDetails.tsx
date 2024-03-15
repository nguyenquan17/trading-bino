import {
  Autocomplete,
  Avatar,
  Box,
  Button, InputAdornment,
  SelectChangeEvent,
  TextField
} from "@mui/material"
import Typography from "@mui/material/Typography";
import "./AccountDetails.scss"
import { useEffect, useState } from "react";
import TelegramIcon from '@mui/icons-material/Telegram';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {getCountry, getProfile, updateProfile, changeUserPassword, emailConfirm} from "../../../apis/UserApi";
import { snackActions } from "../../../utils/showSnackBar";
import { convertNullToEmptyString } from "../../../lib/Helpers";
import { passwordValidator } from "../../../lib/Utils";

interface IProfile {
  country_code: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  telegram?: string
  email_verified? :number
  is_vip?: boolean,
  is_agent?: boolean,
  enable_2fa?: boolean
}
const AccountDetails = () => {
  const [userProfile, setUserProfile] = useState<IProfile>({
    country_code: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    telegram: '',
    email_verified: 0
  })
  const [selectedCountry, setSelectedCountry] = useState<any>({
    name:'',
    code:''
  });
  const [countries, setCountries] = useState([]);
  const [changePassword, setChangePassword] = useState({
    oldPassword: '',
    newPassword: '',
    reenterPassword: ''
  })
  const [errors, setErrors] = useState({
    errorPassword: '',
    errorNewPassword: ''
  });
  const [isDisabledBtnChangePassword, setIsDisabledBtnChangePassword] = useState(true);
  const [isChangedEmail, setIsChangedEmail] = useState(false)
  const [currentEmail ,setCurrentEmail] = useState('')
  const [isConfirmEmail ,setIsConfirmEmail] = useState(false)


  const getUserProfile = async (): Promise<any> => {
    try {
      const rs = await getProfile()
      if(rs.code === 'SUCCESS'){
        setUserProfile(rs.data)
        setCurrentEmail(rs.data.email)
        const countryList = await getCountry()
        setCountries(countryList.data);
        countryList.data.map((e: any) => {
          if (e.code === rs.data.country_code) {
            setSelectedCountry(e);
          }
        })
      }
    } catch (e) {
      console.log(e)
      // throw new Error(e)
    }
  }

  const saveUserProfile = async () => {
    try {
      console.log(selectedCountry);
      const rs = await updateProfile({
        ...userProfile,
        country_code: selectedCountry!.code,
        first_name: userProfile.first_name ? userProfile.first_name : '',
        last_name: userProfile.last_name ? userProfile.last_name : '',
        phone: userProfile.phone ? userProfile.phone : '',
        telegram: userProfile.telegram ? userProfile.telegram : ''
      })
      if (rs.code === 'SUCCESS') {
        snackActions.success(rs.message)
      } else {
        snackActions.error(rs.message)
      }
    } catch (e: any) {
      snackActions.error(e.message)
      console.log(e)
    }
  }

  const resetPassword = () => {
    setChangePassword((value) => ({
      ...value,
      oldPassword: '',
      newPassword: '',
      reenterPassword: ''
    }))
  }

  const submitChangePassword = async () => {
    try {
      const rs = await changeUserPassword({
        oldPassword: changePassword.oldPassword,
        newPassword: changePassword.newPassword,
      })
      if (rs.code === 'SUCCESS') {
        snackActions.success(rs.message)
        resetPassword()
      } else {
        snackActions.error(rs.message)
        resetPassword()
      }
    } catch (e) {
      snackActions.error('An error occurred.')
      resetPassword()
    }
  }

  const handleChangeValue = (event: any) => {
    let name = event.target.name
    setUserProfile({
      ...userProfile, [name]: event.target.value
    })
  }

  const handleChangePassword = (event: any) => {
    let name = event.target.name
    setChangePassword((state) => ({
      ...state, [name]: event.target.value
    }))
  }

  const handleChangeEmail = (event: any) => {
    const emailChanged = event.target.value
    if(emailChanged !== currentEmail){
      setIsChangedEmail(true)
      setIsConfirmEmail(false)
    }
    else setIsChangedEmail(false)
    setUserProfile((userProfile) => ({...userProfile, email: emailChanged}))
  }

  const handleConfirmEmail = async () => {
    try {
      if(!isConfirmEmail){
        setIsConfirmEmail(true)
        setIsChangedEmail(false)
        const rs = await emailConfirm({email: userProfile.email})
        if (rs.code === 'SUCCESS') {
          snackActions.success(rs.message)
        }
        setTimeout( () => {
          setIsConfirmEmail(false);
        }, 60000);
      }
    }catch (e) {
      snackActions.error('An error occurred.')
    }
  }

  const isDisabledBtnChangePass = () => {
    return !changePassword.oldPassword ||
      !changePassword.newPassword ||
      !changePassword.reenterPassword ||
      (changePassword.newPassword !== changePassword.reenterPassword)
  }

  useEffect(() => {
    if ((changePassword.newPassword && changePassword.reenterPassword) && changePassword.newPassword !== changePassword.reenterPassword) {
      setErrors((errors) =>({ ...errors, errorPassword: 'Passwords do not match' }))
    } else {
      setErrors((errors) => ({ ...errors, errorPassword: '', errorNewPassword: changePassword.newPassword ? passwordValidator(changePassword.newPassword)! : '' }))
    }

    setIsDisabledBtnChangePassword(isDisabledBtnChangePass)
  }, [changePassword]);

  useEffect(() => {
    getUserProfile()
  }, []);



  return (
    <>
      <Box className={'account-details'}>
        <Box>
          <Box className={'account-container'}>
            <Box className={'account-avatar'}>
              <Avatar sx={{ width: '136px', height: '136px' }}>

              </Avatar>
              <Typography className={'account-id'}>ID:
                <span>162232243</span>
              </Typography>
            </Box>
          </Box>
          <Box className={'account-container'}>
            <Box className={'account-info'}>
              <Typography variant="h5" gutterBottom mb={3} fontWeight={600}>Personal Data</Typography>
              <Box sx={{ display: 'flex', gap: '16px' }}>
                <Box mb={3} width={'100%'}>
                  <TextField
                    className={'custom-input'}
                    label="First name"
                    variant="filled"
                    style={{ width: "100%" }}
                    size="small"
                    name="first_name"
                    defaultValue={userProfile.first_name}
                    value={userProfile.first_name}
                    onChange={(e) => handleChangeValue(e)}
                  />
                </Box>
                <Box mb={3} width={'100%'}>
                  <TextField
                    className={'custom-input'}
                    label="Last name"
                    variant="filled"
                    style={{ width: "100%" }}
                    size="small"
                    name="last_name"
                    defaultValue={userProfile.last_name}
                    value={userProfile.last_name}
                    onChange={handleChangeValue}
                  />
                </Box>
              </Box>

              <Box mb={3} sx={{ display: 'flex' }}>
                <TextField
                  className={'custom-input'}
                  label="Email"
                  variant="filled"
                  style={{ width: "100%" }}
                  size="small"
                  name="email"
                  defaultValue={userProfile.email}
                  value={userProfile.email}
                  InputProps={{
                    endAdornment: <InputAdornment position="end" className={'verified-email'}>
                      {userProfile.email_verified === 1 ? <CheckIcon sx={{color: '#14C679FF'}}/> : isConfirmEmail ? <AccessTimeIcon /> : null}
                    </InputAdornment>,
                  }}
                  onChange={handleChangeEmail}
                />
                {
                  userProfile.email_verified === 0 && !isConfirmEmail ?
                      (
                          <Box sx={{ width: '100px', marginLeft: '16px' }}>
                            <Button className={'custom-btn'} onClick={handleConfirmEmail}>Confirm</Button>
                          </Box>
                      ) : null
                }
              </Box>
              {
                isChangedEmail && (
                      <Box mb={3} className={'notification-change-email'}>
                        <ErrorOutlineIcon />
                        <Typography>Once the email is changed, we will send you a new confirmation link and change your new login information for you.</Typography>
                      </Box>
                  )
              }
              {
                isConfirmEmail && (
                    <Box mb={3} className={'notification-confirm-email'}>
                      <ErrorOutlineIcon />
                      <Typography>We sent a confirmation link via email that is valid for 1 hour. You don't get it? Please check your spam folder or resend your request</Typography>
                    </Box>
                )
              }
              <Box mb={3}>
                <Autocomplete
                  defaultValue={selectedCountry}
                  value={selectedCountry}
                  id="country-select-demo"
                  sx={{ width: '100%' }}
                  onChange={(e, value) => { setSelectedCountry(value); }}
                  options={countries}
                  autoHighlight
                  getOptionLabel={(option: any) => option.name}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                      />
                      {option.name} ({option.code})
                    </Box>
                  )}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label="Choose a country"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}
                      variant="filled"
                      size="small"
                      className={'custom-input'}
                    />
                  )}
                  size="small"

                />
              </Box>
              <Box mb={3}>
                <TextField
                  label="Phone number"
                  variant="filled"
                  style={{ width: "100%" }}
                  size="small"
                  className={'custom-input'}
                  name="phone"
                  defaultValue={userProfile.phone}
                  value={userProfile.phone}
                  onChange={handleChangeValue}
                />
              </Box>
              <Box mb={3}>
                <TextField
                  id="input-with-icon-textfield"
                  label="Telegram"
                  style={{ width: "100%" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TelegramIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="filled"
                  size="small"
                  className={'custom-input'}
                  name="telegram"
                  defaultValue={userProfile.telegram}
                  value={userProfile.telegram}
                  onChange={handleChangeValue}
                />
              </Box>
              <Button className={'btn-save-account'} onClick={() => saveUserProfile()}>Save</Button>
            </Box>

          </Box>
          <Box className={'account-container'}>
            <Box className={'account-security'}>
              <Typography variant="h5" gutterBottom mb={3} fontWeight={600}>Security</Typography>

              <Typography variant="inherit" mb={1}>Change password</Typography>
              <Box mb={3}>
                <TextField
                  label="Current password"
                  variant="filled"
                  style={{ width: "100%" }}
                  size="small"
                  className={'custom-input'}
                  type="password"
                  name="oldPassword"
                  defaultValue={changePassword.oldPassword}
                  value={changePassword.oldPassword}
                  onChange={handleChangePassword}
                />
              </Box>
              <Box mb={3}>
                <TextField
                  label="New password"
                  variant="filled"
                  style={{ width: "100%" }}
                  size="small"
                  className={'custom-input'}
                  type="password"
                  name="newPassword"
                  defaultValue={changePassword.newPassword}
                  value={changePassword.newPassword}
                  onChange={handleChangePassword}
                  helperText={errors.errorNewPassword}

                />
                <Typography mt={1} fontSize={14} color={'#868893'}>
                  8-64 characters. Latin letters, numbers or special symbols. Ensure you don’t use this password
                  anywhere else
                </Typography>
              </Box>
              <Box mb={3}>
                <TextField
                  label="Re-enter password"
                  variant="filled"
                  style={{ width: "100%" }}
                  size="small"
                  className={'custom-input'}
                  type="password"
                  name="reenterPassword"
                  onChange={handleChangePassword}
                  defaultValue={changePassword.reenterPassword}
                  value={changePassword.reenterPassword}
                  helperText={errors.errorPassword}
                />

              </Box>
              <Button className={'btn-save-account'} onClick={() => submitChangePassword()} disabled={isDisabledBtnChangePassword}>Save</Button>
            </Box>
            <Box className={'account-two-factor'}>
              <Typography variant="inherit" mb={1}>Two-factor authentication (2FA)</Typography>
              <Typography mt={1} mb={1} fontSize={14} color={'#868893'}>
                8-64 characters. Latin letters, numbers or special symbols. Ensure you don’t use this password anywhere else
              </Typography>
              <Button className={'btn-save-account'}>Set up</Button>
              <Typography mt={1} fontSize={14} color={'#868893'}>
                Please confirm your email to use two-factor authentication
              </Typography>
            </Box>
          </Box>
          <Box className={'account-container'}>
          </Box>
        </Box>
      </Box>
    </>
  )
}
export default AccountDetails