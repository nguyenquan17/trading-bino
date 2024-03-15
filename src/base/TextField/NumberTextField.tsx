
import { Button, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

interface NumberTextFieldProps {
  label: string;
  defaultValue?: number
  onchange?: Function;
}

const NumberTextField = (params: NumberTextFieldProps) => {
  const [value, setValue] = useState<number | ''>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (/^\d*$/g.test(inputValue) && parseInt(inputValue, 10) > 0) {
      const v = inputValue === '' ? '' : parseInt(inputValue, 10);
      setValue(v);
      params.onchange && params.onchange(v);
    }
  };

  return (
    <TextField
      label={params.label}
      type="number"
      defaultValue={params.defaultValue}
      variant="filled"
      onChange={handleChange}
      InputProps={{
        inputProps: {
          pattern: '[0-9]*',
          inputMode: 'numeric',
          min: 1
        },
      }}
      style={{ width: "100%" }}
      size="small"
      className={'custom-input'}
    />
  );
};

export default NumberTextField;