# wordpress-auth-tests
**Contents:**
- [Point of this repo](#Point of this repo)
- [Walkthrough](#Walkthrough)
  * [Server](#Server)
    + [Installing plugins in your WordPress dashboard](#Installing plugins in your WordPress dashboard)
  * [Client](#Client)
    + [Getting your token](#Getting your token)

- [Credits](#heading-2)
  * [Sub-heading](#sub-heading-2)
    + [Sub-sub-heading](#sub-sub-heading-2)

# Point of this repo
I wanted to try and see if I could get a somewhat decent type of authentication/authorization working on the WordPress REST API, specifically on HTTP PUT requests trying to change custom fields of custom post types (this will also work to create WP vanilla posts). The options I considered were [basic auth](https://github.com/WP-API/Basic-Auth), [OAuth1.0a](https://github.com/WP-API/OAuth1), [application passwords](https://wordpress.org/plugins/application-passwords/) and [JSON Web Tokens (JWT)](https://github.com/Tmeister/wp-api-jwt-auth). All of these were mentioned on the WordPress dev resources wiki on this topic: https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/

I used a local node.js script to try out some of these plugins and eventually decided on using authentication through [JSON Web Tokens (JWT)](https://github.com/Tmeister/wp-api-jwt-auth). I tried to write down a summary of how I did this below. You can also check out the .js files in this repo if you want to see some sample code.

# Walkthrough
## Server
### Installing plugins in your WordPress dashboard
Install the following plugins according to your needs:
- [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) **(required for authentication)**

- If you need to **change the custom fields** of the post, install these plugins as well: [ACF to REST API](https://wordpress.org/plugins/acf-to-rest-api/) (and [Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/) if you don't have a custom fields plugin yet).

- If you want to **secure all API endpoints**, including GET requests, install this plugin: [Disable REST API and Require JWT / OAuth Authentication](https://wordpress.org/plugins/disable-rest-api-and-require-jwt-oauth-authentication/).

### Editing .htaccess to allow the _authorization_ header in your HTTP requests
If your WordPress site is hosted on **WPEngine**, you'll need to edit your .htaccess file to include this:
```
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
```

If your WordPress install is on a **shared host**, add these lines to your .htaccess file:
```
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
```

### Editing wp-config.php to enable the JWT plugin.
Edit your site's wp-config.php to include these lines of code *at or near the top of your file*.
```
define('JWT_AUTH_CORS_ENABLE', true);
define('JWT_AUTH_SECRET_KEY', 'your-long-difficult-secret-string');
```
You can get a randomised secure string from [here](https://api.wordpress.org/secret-key/1.1/salt/).
More info on CORS [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

## Client (eg React Native, Node.js, Angular, ...)
### Getting your token
**Execute a HTTP POST** to `[wp-install]/wp-json/jwt-auth/v1/token` with a user's credentials in the postdata as `{username: bob, password: secret}`. The response (if done correctly) should include a bearer token in `response.data.token`, save this token somewhere (localStorage, cookie, ...). This token shouldn't be shared with anyone else other than the user who logged in (including you).

**Include the bearer token in the header** of any following POST requests as `'Authorization': "Bearer " + token`

### Creating and editing a post
Send a POST request to `[wp-install]/wp-json/wp/v2/{post-type}`. Don't forget to include the bearer in your header. You can include any of [these arguments](https://developer.wordpress.org/rest-api/reference/posts/#create-a-post) in the postdata.

Example:
```
const postdata = {
    title: 'Title of my Post',
    content: 'Some text. Can include <span style="font-size:25;">HTML tags</span>',
    status: 'publish', // default if left empty is 'draft'
}

const token = localStorage.getItem('auth-token'); // get the token from localStorage, a cookie or wherever
const config = {
    headers: {
        'Authorization': "Bearer " + token 
        }
    };

axios.post(`${apiUri}/wp/v2/${post.type}`, postdata, config)
    .then(function (response) {
        console.log(response.data.id); // will include the post ID
    })
    .catch(function (err) {
        console.log(err);
    });
```

### Editing a post's custom fields
Send your POST requests to `[wp-install]/wp-json/acf/v3/{post-type}/{post-id}` and include the custom fields in the postdata as the fields object:
```
postdata = {
    fields: {
        first_name: 'Bobby',
        last_name: 'Smith'
    }
}

axios.put(`${apiUri}/acf/v3/${post.type}/${postId}`, postdata, config)
    .then(function (response) {
        console.log(response);
    })
    .catch(function (err) {
        console.log(err.response.data);
    });
```
This uses an endpoint created by the [ACF to REST API plugin](https://github.com/airesvsg/acf-to-rest-api). For more information on that plugin, refer to their GitHub page.

# Credits and PS
Contributors: [Adriaan Marain](https://github.com/AdrianMrn) and [Ruben Pauwels](https://github.com/RubenPauwels1). 

Create an issue or a pull request if something was unclear or wrong mmkay?