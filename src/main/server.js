"use strict";
(function () {
  const express = require("express");
  const bodyParser = require("body-parser");
  const cors = require("cors");
  const axios = require("axios");

  const app = express();
  const port = 3000;

  app.use(bodyParser.json());
  app.use(cors());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use("/login", (req, res) => {
    const { apiKey } = req.body;
    axios
      .get(`https://serpapi.com/account?api_key=${apiKey}`)
      .then(function (response) {
        // handle success
        res.send(response.data);
      })
      .catch(function (error) {
        // handle error
        res.send(400);
      });
  });

  app.use("/import-search", (req, res) => {
    const { apiKey, searchId } = req.body;
    axios
      .get(`https://serpapi.com/searches/${searchId}?api_key=${apiKey}`)
      .then(function (response) {
        // handle success
        res.send(response.data);
      })
      .catch(function (error) {
        // handle error
        res.send(400);
      });
  });

  app.use("/search", (req, res) => {
    const { apiKey, param } = req.body;
    console.log(apiKey, param);
    console.log('LOL');
    axios
      .get(`https://serpapi.com/search?q=${param.q}&location=${param.location}&num=${param.num}&api_key=${apiKey}`)
      .then(function (response) {
        // handle success
        res.send(response.data);
      })
      .catch(function (error) {
        // handle error
        res.send(400);
      });
  });

  const server = app.listen(port, () =>
    console.log(`Express server listening on port ${port}`)
  );

  module.exports = app;
})();
