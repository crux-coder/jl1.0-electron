import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import TextField from "@mui/material/TextField";

export default function SearchQuery({ numberOfResults, setNumberOfResults, errors, setErrors }) {
  const handleChange = (e) => {
    const value = e.target.value;

    setNumberOfResults(value);
    delete errors.numberOfResults;
    setErrors(errors);
  };

  const handleReset = (e) => {
    setNumberOfResults(100);
    delete errors.numberOfResults;
    setErrors(errors);
  };

  return (
    <Card square>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Num. of Results
        </Typography>
        <Divider />
        <Box
          component="form"
          sx={{
            width: "100%",
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            size="small"
            fullWidth
            value={numberOfResults}
            onChange={handleChange}
            error={errors.numberOfResults}
            helperText={errors.numberOfResults && 'You must at least have 10 results.'}
            type="number"
            margin="dense"
            id="filled-basic"
            variant="outlined"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button
            onClick={handleReset}
            variant="outlined"
            color="error"
            size="small"
          >
            RESET TO DEFAULT
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
