require('dotenv').config();
const axios = require('axios');

const apiUri = process.env.API_URI

axios.post(`${apiUri}/jwt-auth/v1/token`, {
    username: process.env.USER_NAME,
    password: process.env.USER_PASSWORD
})
    .then(function (response) {
        console.log(response.data.token);
    })
    .catch(function (err) {
        console.log(err);
    });
