import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Divider, List, ListItem, ListItemText, ListItemButton, TextField, Chip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import "../assets/css/App.css";
import Typography from "@mui/material/Typography";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from "axios";
import { green } from "@mui/material/colors";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import _ from 'lodash';
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmImportDialog(props) {
  const {
    importModalOpen,
    handleCloseImportModal,
    completeImport,
    user
  } = props;
  const [searchId, setSearchId] = useState('');
  const [importing, setImporting] = useState(false);

  const confirmImport = () => {
    setImporting(true);
    axios
      .post("http://localhost:3000/import-search", {
        apiKey: user.api_key,
        searchId: searchId,
      })
      .then(function (response) {
        const res = response.data;
        const _searchResults = {
          data: res, param: {
            engine: "google",
            q: res.search_parameters.q,
            location: res.search_parameters.location_requested,
            num: res.search_parameters.num,
          }
        };
        setSearchId('');
        completeImport(_searchResults);
        setImporting(false);
      })
      .catch(function (error) {
        setImporting(false);
      });
  }

  const openYourSearches = () => {
    shell.openExternal("https://serpapi.com/searches");
  };

  return (
    <Dialog
      open={importModalOpen}
      TransitionComponent={Transition}
      keepMounted
      maxWidth='md'
      fullWidth
      onClose={handleCloseImportModal}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        <Box sx={{ textAlign: 'center', mt: 3 }} alignItems="center" justifyContent="center">
          <Typography variant="button" display="block">Import by Search ID</Typography>
          <Typography variant="caption" display="block">
            <Button
              sx={{ borderRadius: 0 }}
              endIcon={<OpenInNewIcon />}
              variant="text"
              size="small"
              href="https://serpapi.com/searches"
              target="_blank">
              Search ID can be found here
          </Button>
          </Typography>
          <TextField sx={{ width: "50%" }} value={searchId} onChange={(e) => setSearchId(e.target.value)} size="small" margin="dense" label="SearchID" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleCloseImportModal}>
          Cancel
        </Button>
        <LoadingButton
          disabled={!Boolean(searchId)}
          variant="outlined"
          loading={importing}
          loadingPosition="end"
          onClick={confirmImport}
          endIcon={<DownloadForOfflineIcon />}>
          Import
        </LoadingButton>
      </DialogActions>
    </Dialog >
  );
}
