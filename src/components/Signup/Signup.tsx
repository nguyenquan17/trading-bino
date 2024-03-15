import { BaseSyntheticEvent, useState } from 'react';
import { Box, TextField, Checkbox, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import { emailValidator, passwordValidator } from '../../lib/Utils';
import { register } from '../../apis/AuthApi';
import BaseButton from '../../base/BaseButton/BaseButton';
import { useApp } from '../../contexts/AppContext';
import { useSettings } from '../../contexts/SettingsContext';
import './Signup.scss';
import SigninWithSocial from "../SigninWithSocial/SigninWithSocial";


const valuesDefault = {
  email: '',
  password: '',
  checked: false,
}

const errorsDefault = {
  email: '',
  password: '',
}

interface SignupProps {
  onSwitch: () => void,
  isDark?: boolean,
}

function Signup({ onSwitch, isDark }: SignupProps) {
  const navigate = useNavigate();
  const { authenticate } = useApp();
  const { closeAuthDialog } = useSettings();
  const values = valuesDefault;
  const [errors, setErrors] = useState(errorsDefault);
  const [submited, setSubmited] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangeEmail = (e: any) => {
    setSubmited(false);
    const { value } = e.target;
    const error = emailValidator(value);
    setErrors({ ...errors, email: error || '' });
    values.email = value;
  }

  const handleChangePassword = (e: any) => {
    setSubmited(false);
    const { value } = e.target;
    const error = passwordValidator(e.target.value);
    setErrors({ ...errors, password: error || '' });
    values.password = value;
  }

  const handleCheck = (e: BaseSyntheticEvent) => {
    values.checked = e.target.checked;
    setSubmited(false);
  }

  const handleSubmit = async () => {
    setSubmited(true);
    const err = {
      ...errors,
      email: emailValidator(values.email) || '',
      password: passwordValidator(values.password) || '',
    }
    setErrors(err);
    if (!err.email && !err.password) {
      setLoading(true);
      try {
        const data = await register(values);
        authenticate(data?.uid);
        closeAuthDialog();
        navigate('/auth?redirect=/trading#signin');
      } catch (error: any) {
        setErrors({ ...errors, email: error.message })
      }
      finally {
        setLoading(false);
      }
    }
  }

  return (
    <Box className={`signup-com ${isDark ? 'dark' : 'light'}`}>
      <Box mb={2}>
        <TextField
          label="Email"
          variant="filled"
          onChange={handleChangeEmail}
          helperText={errors.email}
          style={{ width: '100%' }}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Password"
          variant="filled"
          onChange={handleChangePassword}
          helperText={errors.password}
          type="password"
          style={{ width: '100%' }}
        />
      </Box>
      {!errors.password && (
        <Typography mb={1} className="text-grey">8-64 characters. Latin letters, numbers or special symbols. Ensure you don’t use this password anywhere else</Typography>
      )}
      <Box className="agree-condition" mb={2}>
        <Checkbox onChange={handleCheck} />
        <Typography color="black">I accept the terms of the <Link to="/agreement" target="_blank">Client Agreement</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link> and confirm being adult</Typography>
      </Box>
      {(submited && !errors.email && !errors.password && !values.checked) && (
        <Typography mb={2} className="text-danger">Please accept terms and conditions</Typography>
      )}
      <BaseButton onClick={handleSubmit}>Create account</BaseButton>
      <Box
        width='100%'
        sx={{
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
        className="wrapper-btn-social"
      >
        <div style={{ width: '100%', marginRight: '16px' }}>
          <SigninWithSocial typeLogin="GOOGLE" tab="SIGN_UP" />
        </div>
        <SigninWithSocial typeLogin="FACEBOOK" tab="SIGN_UP" />
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" my={2}>
        <Typography color="white" mr={2}>Have an account?</Typography>
        <Button
          className='btn-grey'
          variant='contained'
          size='small'
          style={{ textTransform: 'none' }}
          onClick={onSwitch}
        >Sign In</Button>
      </Box>

    </Box>
  )
}

export default Signup;
