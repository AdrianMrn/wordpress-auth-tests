require('dotenv').config();
const axios = require('axios');
const moment = require('moment');

const apiUri = process.env.API_URI;

let config;
const post = {
    // WP reserved fields (https://developer.wordpress.org/rest-api/reference/posts/#create-a-post)
    content: 'leegggogoooooo',
    title: 'very talk much speak',
    excerpt: 'wow',
    status: 'publish',
    // CPT
    type: 'talks',
    // ACFs
    fields: {
        type: 'talk',
        start_datetime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        description: 'Very very very nice talk, incredible!',
        language: 'English',
        speaker: { ID: 207 }
    }
};

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

testPost = (token, callback) => {
    console.log(`Running POST`);

    config = { headers: { 'Authorization': "Bearer " + token } };

    axios.post(`${apiUri}/wp/v2/${post.type}`, post, config)
        .then(function (response) {
            console.log(response.data);
            callback(response.data.id);
        })
        .catch(function (err) {
            console.log(err);
        });
}

const token = getToken({ username: process.env.USER_NAME, password: process.env.USER_PASSWORD }, (response, err) => {
    if (err) {
        console.log("We ran into an error:");
        console.log(err); //err.response.data should provide more info about the error, unless we didn't get a response at all (eg server down)
    } else {
        console.log(`Got token: ${response.token}`);
        testPost(response.token, (postId) => {
            axios.put(`${apiUri}/acf/v3/${post.type}/${postId}`, post, config)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (err) {
                    console.log(err.response.data);
                });
        });
    }
});
