import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";
import { v4 as uuid } from "uuid";

export default function SearchQuery({ searchQueries, setSearchQueries, errors, setErrors }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;

    setSearchQuery(value);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSearchQuery();
      delete errors.searchQueries;
      setErrors(errors);
    }
  };

  const handleClear = (e) => {
    setSearchQuery("");
    setSearchQueries([]);
    delete errors.searchQueries;
    setErrors(errors);
  };

  const addSearchQuery = () => {
    searchQueries.push({ id: uuid(), query: searchQuery });
    setSearchQueries(searchQueries);
    setSearchQuery("");
    delete errors.searchQueries;
    setErrors(errors);
  };

  const handleDelete = (query) => {
    setSearchQueries(searchQueries.filter((_query) => _query.id !== query.id));
  };

  return (
    <Card square>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Search Query
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
          <OutlinedInput
            size="small"
            fullWidth
            sx={{ mt: 1, mb: 0.5, pr: 0.5 }}
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={handleEnter}
            error={errors.searchQueries}
            margin="dense"
            id="filled-basic"
            variant="outlined"
            autoFocus
            endAdornment={
              <>
                {searchQuery && (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      edge="end"
                      size="small"
                      onClick={addSearchQuery}
                    >
                      Add
                    </Button>
                  </InputAdornment>
                )}
              </>
            }
          />
          {errors.searchQueries && (
            <FormHelperText error id="accountId-error">
              You must have at least one search query added.
            </FormHelperText>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              m: 0,
              pl: 0,
            }}
            component="ul"
          >
            {searchQueries &&
              searchQueries.map((query) => {
                return (
                  <ListItem sx={{ p: 0.5 }} key={query.id}>
                    <Chip
                      label={query.query}
                      onDelete={() => handleDelete(query)}
                    />
                  </ListItem>
                );
              })}
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button
            onClick={handleClear}
            variant="outlined"
            color="error"
            size="small"
          >
            clear
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
