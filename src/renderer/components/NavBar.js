import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { green } from "@mui/material/colors";
import { List, ListItem, ListItemText, Divider } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import logo from '../assets/logo.png';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const NavBar = ({ user, setUser, theme, toggleTheme }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleLogout = () => {
    setAnchorElUser(null);
    setUser(undefined);
    localStorage.removeItem("user");
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            <Avatar variant="rounded" src={logo} />
          </Typography>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <Avatar variant="rounded" src={logo} />
          </Typography>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex" } }}
            >
              {user && `Searches left: ${user.total_searches_left}/${user.searches_per_month}`}
            </Typography>
          </Box>
          <FormControlLabel
            control={<MaterialUISwitch onChange={toggleTheme} sx={{ m: 1 }} checked={theme.palette.mode === 'dark'} />}
          />
          <Box sx={{ flexGrow: 0 }}></Box>
          {user && <Box sx={{ flexGrow: 0 }}>

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: green[500] }}>
                  {user.account_email[0].toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <List sx={{ width: 350, maxWidth: "100%" }}>
                <ListItem
                  secondaryAction={
                    <Typography textAlign="center">
                      {user.account_email}
                    </Typography>
                  }
                >
                  <ListItemText primary="Email" />
                </ListItem>
                <ListItem
                  secondaryAction={
                    <Typography textAlign="center">{user.plan_name}</Typography>
                  }
                >
                  <ListItemText primary="Plan Name" />
                </ListItem>
                <ListItem
                  secondaryAction={
                    <Typography textAlign="center">
                      {user.total_searches_left}
                    </Typography>
                  }
                >
                  <ListItemText primary="Searches left" />
                </ListItem>
                <ListItem
                  secondaryAction={
                    <Typography textAlign="center">
                      {user.searches_per_month}
                    </Typography>
                  }
                >
                  <ListItemText primary="Searches per month" />
                </ListItem>
                <ListItem>
                  <Button
                    sx={{ borderRadius: 0 }}
                    endIcon={<OpenInNewIcon />}
                    variant="outlined"
                    fullWidth
                    href="https://serpapi.com/dashboard"
                    target="_blank"
                    >
                    SerpAPI Dashboard
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    sx={{ borderRadius: 0 }}
                    endIcon={<OpenInNewIcon />}
                    variant="outlined"
                    fullWidth
                    href="https://serpapi.com/searches"
                    target="_blank">
                    My searches
                  </Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <Button
                    sx={{ borderRadius: 0 }}
                    variant="contained"
                    fullWidth
                    color="error"
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </Button>
                </ListItem>
              </List>
            </Menu>
          </Box>}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
