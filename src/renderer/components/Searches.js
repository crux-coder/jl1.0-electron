import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Container, Button, IconButton, Tooltip, Grow, Alert } from "@mui/material";
import SearchQuery from "./SearchQuery";
import "../assets/css/App.css";
import GeoLocationSelect from "./GeoLocationSelect";
import DataTable from "./DataTable";
import NumberOfResults from "./NumberOfResults";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import ConfirmSearchDialog from './ConfirmSearchDialog';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmImportDialog from "./ConfirmImportDialog";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { v4 as uuid } from 'uuid';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';

function LinearProgressWithLabel(props) {
  const { value } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mx: 3, mb: 2 }}>
      <Box sx={{ minWidth: 200 }}>
        <Typography variant="body2" color="text.secondary">Search progress</Typography>
      </Box>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box sx={{ minWidth: 50 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function Searches(props) {
  const { user, refreshUser } = props;
  const theme = useTheme();
  const [searchQueries, setSearchQueries] = useState([]);
  const [locations, setLocations] = useState(["United States"]);
  const [numberOfResults, setNumberOfResults] = useState(100);
  const [confirmSearchModalOpen, setConfirmSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [conductingFirstSearch, setConductingFirstSearch] = useState(false);
  const [searchesCompleted, setSearchesCompleted] = useState(0);
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState(0);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }

  const handleCloseImportModal = () => {
    setImportModalOpen(false);
  }

  const openImportModal = () => {
    setImportModalOpen(true);
  }

  const completeImport = (_searchResult) => {
    setImportModalOpen(false);
    const _searchResults = [...searchResults, _searchResult];
    setSearchResults(_searchResults);
    setValue(_searchResults.length - 1);
  }

  const selectTabAfterClosing = (index, _results) => {
    if (value === index || index < value) {
      setValue(Math.max(value - 1, 0));
    } else if (value >= _results.length) {
      setValue(_results.length - 1);
    }
  }

  const closeTab = (e, index) => {
    e.stopPropagation();
    searchResults.splice(index, 1);
    setSearchResults([...searchResults]);
    selectTabAfterClosing(index, [...searchResults]);
  }

  const validateFields = () => {
    let _errors = {};
    if (!searchQueries.length) _errors = { ..._errors, searchQueries: true, };
    if (!locations.length) _errors = { ..._errors, locations: true, };
    if (!numberOfResults || numberOfResults < 10) _errors = { ..._errors, numberOfResults: true, };

    setErrors(_errors);
    if (Object.keys(_errors).length) return false;

    return true;
  };

  const handleRunSearch = () => {
    if (validateFields())
      setConfirmSearchModalOpen(true);
  };
  const handleClose = () => {
    setConfirmSearchModalOpen(false);
  };

  useEffect(() => {
    if (Math.round(searchesCompleted) >= 100) {
      setSearchesCompleted(0);
    }
  }, [searchesCompleted]);

  const callback = function (data, param, params) {
    const searchIncrement = 100 / params.length;
    setSearchResults(prevValue => [...prevValue, { data, param }]);
    setSearchesCompleted(prevValue => prevValue + searchIncrement);
    setConductingFirstSearch(false);
  };

  const ranOutOfSearches = () => {
    return user.plan_searches_left == 0;
  }

  const confirmRunSearch = () => {
    if (ranOutOfSearches()) {
      refreshUser();
      handleClose();
      setSnackbarOpen(true);
      return;
    };
    setConductingFirstSearch(true);
    const params = [];

    for (let i = 0; i < searchQueries.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        params.push({
          engine: "google",
          q: searchQueries[i].query,
          location: locations[j],
          num: numberOfResults,
        });
      }
    }

    params.forEach((param, index) => {
      handleClose();
      axios
      .post("http://localhost:3000/search", {
        apiKey: user.api_key,
        param: param,
      })
      .then(function (response) {
        callback(response.data, param, params);
        refreshUser();
      })
      .catch(function (error) {
        refreshUser();
      });

    });
  };

  return (
    <>
      <Container maxWidth={false} sx={{ mt: 5 }}>
        <Paper sx={{ padding: 2 }} variant="outlined" square>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <SearchQuery
                errors={errors}
                setErrors={setErrors}
                searchQueries={searchQueries}
                setSearchQueries={setSearchQueries}
              />
            </Grid>
            <Grid item xs={8} md={4}>
              <GeoLocationSelect
                errors={errors}
                setErrors={setErrors}
                locations={locations}
                setLocations={setLocations}
              />
            </Grid>
            <Grid item xs={4} md={3}>
              <NumberOfResults
                errors={errors}
                setErrors={setErrors}
                numberOfResults={numberOfResults}
                setNumberOfResults={setNumberOfResults}
              />
            </Grid>
          </Grid>
        </Paper>
        <Box
          mt={2}
          mb={2}
          justifyContent="center"
          align-alignItems="center"
          textAlign="center"
        >
          <Button
            variant="contained"
            onClick={handleRunSearch}
            sx={{ borderRadius: 0 }}
          >
            RUN SEARCH
          </Button>
        </Box>
        <Paper variant="outlined" square>
          {searchesCompleted ? <Grow in={searchesCompleted} appear>
            <Box
              mt={2}
              justifyContent="center"
              align-alignItems="center"
              textAlign="center"
            >
              <LinearProgressWithLabel value={searchesCompleted} />
            </Box>
          </Grow> : ''}
          <Box
            justifyContent="right"
            alignItems="end"
            textAlign="end"
          >
            <Button sx={{ borderRadius: 0, m: 0.5 }} onClick={openImportModal} variant="outlined" endIcon={<UploadFileIcon />}>
              Import
            </Button>
          </Box>
          <Grid container>
            <Grid item xs={12}>
              <Box sx={{ padding: 0 }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  TabIndicatorProps={{
                    style: {
                      display: "none",
                    },
                  }}
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  aria-label="full width tabs example"
                  sx={{
                    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'white' : 'black'}`,
                  }}
                >
                  {searchResults.map((searchResult, index) => (
                    <Tab
                      key={uuid()}
                      label={(
                        <Grid container>
                          <Grid item justifyContent="center" sx={{ display: "flex", alignItems: "center" }} xs={10}>
                            <Tooltip title={searchResult.param.q + ' ' + searchResult.param.location}>
                              <Typography variant="caption" noWrap>
                                {searchResult.param.q}
                                {' - '}
                                {searchResult.param.location}
                              </Typography>
                            </Tooltip>
                          </Grid>
                          <Grid item textAlign="right" xs={2}>
                            <Tooltip title="Close tab">
                              <IconButton sx={{ borderRadius: 0.5 }} size="small" onClick={(e) => closeTab(e, index)}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      )}
                      wrapped
                      sx={{
                        border: `${index === value ? `1px solid ${theme.palette.mode === 'dark' ? 'white' : 'black'}` : `1x solid white`}`,
                        borderBottom: 'none',
                        borderRadius: '4px 4px 0 0'
                      }}
                      {...a11yProps(index)}
                    />
                  ))}
                </Tabs>
                {searchResults.length ? (
                  searchResults.map((searchResult, index) => (
                    <TabPanel key={uuid()} value={value} index={index}>
                      <DataTable openImportModal={openImportModal} searchResults={searchResult} />
                    </TabPanel>
                  ))
                ) : (
                    <Box sx={{ p: 10 }} textAlign="center">
                      <Typography sx={{ color: 'text.secondary' }} variant="button">
                        Run search or use import to get results.
                      </Typography>
                    </Box>
                  )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert variant="filled" elevation={6} onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Your searches for the month are exhausted. You can upgrade plans on <Button href="https://serpapi.com/change-plan"
                    target="_blank" size="small" endIcon={<OpenInNewIcon />}>SerpApi.com</Button>  website.
        </Alert>
      </Snackbar>
      <ConfirmSearchDialog
        handleClose={handleClose}
        confirmSearchModalOpen={confirmSearchModalOpen}
        confirmRunSearch={confirmRunSearch}
        searchQueries={searchQueries}
        locations={locations}
        numberOfResults={numberOfResults}
      />
      <ConfirmImportDialog
        handleCloseImportModal={handleCloseImportModal}
        importModalOpen={importModalOpen}
        completeImport={completeImport}
        user={user}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={conductingFirstSearch}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
