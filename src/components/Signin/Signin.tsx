import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { emailValidator } from "../../lib/Utils";
import BaseButton from "../../base/BaseButton/BaseButton";
import { useApp } from "../../contexts/AppContext";
import { login } from "../../apis/AuthApi";
import { useSettings } from "../../contexts/SettingsContext";
import "./Signin.scss";

const valuesDefault = {
  email: "",
  password: "",
};

const errorsDefault = {
  email: "",
  password: "",
};

interface SigninProps {
  onSwitch: () => void;
  isDark?: boolean;
}

function Signin({ onSwitch, isDark }: SigninProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authenticate } = useApp();
  const { closeAuthDialog } = useSettings();
  const values = valuesDefault;
  const [errors, setErrors] = useState(errorsDefault);
  const [loading, setLoading] = useState(false);

  const handleChangeEmail = (e: any) => {
    const { value } = e.target;
    const error = emailValidator(value);
    setErrors({ ...errors, email: error || "" });
    values.email = value;
  };

  const handleChangePassword = (e: any) => {
    const { value } = e.target;
    values.password = value;
    setErrors({ ...errors, password: "" });
  };

  const handleSubmit = async () => {
    const err = {
      password: !values.password ? "Please enter your password" : "",
      email: emailValidator(values.email) || "",
    };
    setErrors(err);
    if (!err.email && !err.password) {
      setLoading(true);
      try {
        const data = await login(values);
        authenticate(data?.uid);
        closeAuthDialog();
        const redirect = searchParams.get("redirect");
        navigate(redirect || "/trading");
      } catch (err: any) {
        setErrors({ ...errors, email: err.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box className={`signin-com ${isDark ? "dark" : "light"}`}>
      <Box mb={2}>
        <TextField
          label="Email"
          variant="filled"
          onChange={handleChangeEmail}
          helperText={errors.email}
          style={{ width: "100%" }}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Password"
          variant="filled"
          type="password"
          onChange={handleChangePassword}
          helperText={errors.password}
          style={{ width: "100%" }}
        />
      </Box>
      <Box className="forgot-action" my={2}>
        <Typography>
          <Link to="/password-recovery">Forgot my password</Link>
        </Typography>
      </Box>
      <BaseButton onClick={handleSubmit}>Sign in</BaseButton>
      <Box display="flex" alignItems="center" justifyContent="center" my={2}>
        <Typography color="white" mr={2}>
          No account?
        </Typography>
        <Button
          className="btn-grey"
          variant="contained"
          size="small"
          style={{ textTransform: "none" }}
          onClick={onSwitch}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

export default Signin;
