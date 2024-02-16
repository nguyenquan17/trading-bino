import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import Signup from "../../components/Signup/Signup";
import Signin from "../../components/Signin/Signin";
import { useApp } from "../../contexts/AppContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { isAuthenticated } = useApp();
  const [value, setValue] = React.useState(hash === "#signup" ? 0 : 1);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/trading");
    }
  }, [isAuthenticated]);

  return (
    <Box width={350} p={2} mt={4}>
      <Typography
        color="black"
        variant="h5"
        align="center"
        fontWeight={900}
        mb={2}
      >
        {value === 1 ? "Login" : "Create account"}
      </Typography>
      {value === 0 ? (
        <Signup onSwitch={() => setValue(1)} />
      ) : (
        <Signin onSwitch={() => setValue(0)} />
      )}
    </Box>
  );
}
