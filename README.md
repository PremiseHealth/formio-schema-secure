### Securing form.io form definitions
By default form.io makes every new form publicly available to anyone with the API endpoint.
For example: `https://my_env.form.io/consent` (`my_env` is the project environment name) will
show you the consent form definition. Currently there isn't a way to secure form endpoints 
in the form.io portal, but it can be accomplished with this script.

This script will iterate over all API endpoints for a specific project environment setting the 
permissions on the form endpoint to `Authenticated`, which means that only an authenticated user
(via passing a JWT token header) can see the form definition.

### Usage

##### Help
```sh
› node bin/schema-secure.js -h
Usage: schema-secure -u <form.io username> -p <password> -a <api endpoint>

Options:

  -h, --help        Show help
  -u, --username    Username
  -p, --password    Password
  -a, --api         API Endpoint to form.io project (https://my_env.form.io)
```

##### Passing credentials
Override form.io credentials
```sh
› node bin/schema-secure.js \
    -u rod@rammer.com \
    -p N3atn3AtneaT
```

##### Override all
Override form.io credentials and API Endpoint
```sh
› node bin/schema-secure.js \
    -u rod@rammer.com \
    -p N3atn3AtneaT \
    -a https://my_env.form.io
```

##### Exclude paths
To exclude certain API Enpoints add the endpoint path on a newline in a file named `excludepaths`
```sh
admin
user
user/login
user/register
```

##### Roles to apply to all API Endpoints
Add the role id's on a newline that you want applied to your API endpoints in a file named `roles`
```sh
3425312e9c27b1670000346a
358d312e9c27c1670000206b
js88812e9c27b1670002306c
```

##### Example output
200 is the status code of the http response of the schema update request
```sh
› node bin/schema-secure.js \
    -u rod@rammer.com \
    -p N3atn3AtneaT \
    -a https://my_env.form.io
https://my_env.form.io/no-filter: 200
https://my_env.form.io/fourq: 200
https://my_env.form.io/police-and-theives: 200
https://my_env.form.io/the-germs: 200
https://my_env.form.io/teenage-timekiller: 200
https://my_env.form.io/hot-knives: 200
https://my_env.form.io/sushi-cat: 200
https://my_env.form.io/team-wrex: 200
https://my_env.form.io/burninators: 200
https://my_env.form.io/team-snow: 200
https://my_env.form.io/alan-alan-alan: 200
https://my_env.form.io/steve-steve-steve: 200
https://my_env.form.io/old-greg: 200
https://my_env.form.io/webscale: 200
excluded paths: [ 'admin', 'user', 'user/login', 'user/register' ]
```
