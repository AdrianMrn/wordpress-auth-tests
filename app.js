require('dotenv').config();
const axios = require('axios');

const apiUri = process.env.API_URI;

getToken = (credentials, callback) => {
    console.log(`Starting test for user ${credentials.username}`)
    axios.post(`${apiUri}/jwt-auth/v1/token`, credentials)
        .then(function (response) {
            callback(response.data);
        })
        .catch(function (err) {
            callback(null, err);
        });
}

testPost = (token) => {
    console.log(`Running POST`);

    const postData = {
        content: 'get kekbaited',
        title: '5 ways top kek is kek',
        excerpt: 'kek'
    };
    const config = { headers: { 'Authorization': "Bearer " + token } };

    axios.post(`${apiUri}/wp/v2/posts`, postData, config)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (err) {
            console.log(err);
        });
}

const token = getToken({ username: process.env.USER_NAME, password: process.env.USER_PASSWORD }, (response, err) => {
    if (err) {
        console.log("We ran into an error:");
        console.log(err);
        /* err.response.data should provide more info about the error,
        unless we didn't get a response at all (eg server down) */
    } else {
        console.log(`Got token: ${response.token}`);
        testPost(response.token);
    }
});

