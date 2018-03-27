# wordpress-auth-tests
Trying out this plugin: https://github.com/Tmeister/wp-api-jwt-auth

# Walkthrough
## Backend (WordPress)
- Install https://github.com/Tmeister/wp-api-jwt-auth

- Add the following lines of code to the top of your wp-config.php file:
```
/* JWT auth secret key for 'JWT Authentication for WP-API' plugin */
define('JWT_AUTH_SECRET_KEY', '[long-difficult-secret-string]');
define('JWT_AUTH_CORS_ENABLE', true);
```

## Client (eg React Native, Node.js, Angular, ...)
- HTTP POST to `[wp-install]/jwt-auth/v1/token` with a user's credentials as `{username: bob, password: secret}`

- The response (if done correctly) should include a bearer token, save this somewhere (localStorage, cookie, ...)

- Include the bearer token in the header of any following requests as `'Authorization': "Bearer " + token`
