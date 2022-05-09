import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Button, Divider } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import "../assets/css/App.css";
import Typography from "@mui/material/Typography";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmSearchDialog(props) {
  const {
    confirmSearchModalOpen,
    handleClose,
    confirmRunSearch,
    searchQueries,
    locations,
    numberOfResults } = props;
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    const _searches = [];
    for (let i = 0; i < searchQueries.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        _searches.push({
          query: searchQueries[i].query,
          location: locations[j],
          numberOfResults: numberOfResults,
        });
      }
    }
    setSearches(_searches);
  }, [confirmSearchModalOpen, searchQueries, locations, numberOfResults]);

  return (
    <Dialog
      open={confirmSearchModalOpen}
      TransitionComponent={Transition}
      keepMounted
      maxWidth='md'
      fullWidth
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Confirm search?"}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'white' }}>
          This will cost you {searchQueries.length * locations.length} searches on SerpAPI.
        </DialogContentText>
        <Divider />
        <Grid container sx={{ mt: 2 }} spacing={1}>
          <Grid item xs={1}>
            <Typography color="textSecondary" textAlign="center">No.</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography>Search query</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography>Locations</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography textAlign="center">Num. of results</Typography>
          </Grid>
          {searches.map((search, i) => {
            return (<>
              <Grid item xs={1}>
                <Typography color="textSecondary" textAlign="center">{i + 1}.</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography color="textSecondary">{search.query.trim()}</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography color="textSecondary">{search.location}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography color="textSecondary" textAlign="center">{search.numberOfResults}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </>)
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Cancel
              </Button>
        <Button variant="outlined" onClick={confirmRunSearch}>
          Confirm
              </Button>
      </DialogActions>
    </Dialog>
  );
}
