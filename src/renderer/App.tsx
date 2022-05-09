import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import {
  ThemeProvider,
  createTheme,
  useTheme
} from '@mui/material/styles';
import axios from "axios";
import APILoginForm from "./components/APILoginForm";
import NavBar from "./components/NavBar";
import Searches from "./components/Searches";
import "./App.css";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function App() {
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => {
    if (theme.palette.mode === 'dark') {
      setTheme(lightTheme);
      localStorage.setItem('theme', 'light');
    } else {
      setTheme(darkTheme)
      localStorage.setItem('theme', 'dark');
    };
  }
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const theme = localStorage.getItem("theme");
    if (user)
      setUser(user);
    if (theme && theme === 'light')
      setTheme(lightTheme);
    else
      setTheme(darkTheme);
  }, []);

  const refreshUser = () => {
    axios
      .post("http://localhost:3000/login", {
        apiKey: user.api_key,
      })
      .then(function (response) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
      })
      .catch(function (error) {
        setUser(undefined);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} sx={{ backgroundColor: 'background.paper', minHeight: '100vh' }} disableGutters>
        <NavBar user={user} setUser={setUser} toggleTheme={toggleTheme} theme={theme} />
        {user ? (
          <>
            <Searches user={user} refreshUser={refreshUser} />
          </>
        ) : (
            <APILoginForm setUser={setUser} />
          )}
      </Container>
    </ThemeProvider>
  );
}
