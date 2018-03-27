# wordpress-auth-tests
Trying out this plugin: https://github.com/Tmeister/wp-api-jwt-auth

# Walkthrough
## Backend (WordPress)
- Install this plugin: [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/).

- If you need the ACFs of the post, install these plugins as well: [ACF to REST API](https://wordpress.org/plugins/acf-to-rest-api/) and [Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/).

- If you want to secure all API routes, including for GET requests, install this plugin: [Disable REST API and Require JWT / OAuth Authentication](https://wordpress.org/plugins/disable-rest-api-and-require-jwt-oauth-authentication/).

- Editing .htaccess to allow the `authorization` header in your HTTP requests
If your WordPress site is hosted on *WPEngine*, you'll need to edit your .htaccess file to include this:
```
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
```

If your WordPress install is on a *shared host*, add these lines to your .htaccess file (in your wp root):
```
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
```

- Add the following lines of code to the top of your site's wp-config.php file:
```
define('JWT_AUTH_CORS_ENABLE', true);
define('JWT_AUTH_SECRET_KEY', 'your-long-difficult-secret-string');
```
You can get a randomised secure string from here: https://api.wordpress.org/secret-key/1.1/salt/

## Client (eg React Native, Node.js, Angular, ...)
- HTTP POST to `[wp-install]/wp-json/jwt-auth/v1/token` with a user's credentials in the postdata as `{username: bob, password: secret}`. The response (if done correctly) should include a bearer token, save this somewhere (localStorage, cookie, ...)

- Include the bearer token in the header of any following POST requests as `'Authorization': "Bearer " + token`

- To edit a post's (Advanced) Custom Fields, you'll have to send your POST requests to `[wp-install]/wp-json/acf/v3/{post-type}/{id}` and include the fields in the postdata as the fields object:
```
postdata: {
    fields: {
        first_name: 'Bobby',
        last_name: 'Smith'
    }
}
```
Refer to [the plugin's GitHub](https://github.com/airesvsg/acf-to-rest-api) for more information on the ACF to REST API plugin.
