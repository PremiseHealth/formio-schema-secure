'use strict';

const bluebird = require('bluebird');
const bossy = require('bossy');
const fs = require('fs');
const superagent = require('superagent');

const definition = {
  h: {
    description: 'Show help',
    alias: 'help',
    type: 'boolean'
  },
  u: {
    description: 'Username',
    alias: 'username',
    require: true
  },
  p: {
    description: 'Password',
    alias: 'password',
    require: true
  },
  a: {
    description: 'API Endpoint to form.io project',
    alias: 'api',
    require: true
  }
};


const args = bossy.parse(definition);
const excludePaths = fs.readFileSync('excludepaths').toString().split('\n');
const roles = fs.readFileSync('roles').toString().split('\n');

excludePaths.pop();
roles.pop();

if (args instanceof Error) {
  console.error(args.message);
  process.exit(1);
}

if (args.h) {
  console.log(bossy.usage(definition, 'schema-secure -u <form.io username> -p <password> -a <api endpoint>'));
  process.exit(0);
}


function getForms(header) {
  return superagent
    .get(`${args.api}/form`)
    .query('limit=9999999')
    .set(header)
    .then((response) => response.body);
}

function login() {
  return bluebird.try(() => {
    return superagent
      .post('https://formio.form.io/user/login')
      .send({ data: { email: args.username, password: args.password } })
      .then((response) => {
        return { 'x-jwt-token': response.headers['x-jwt-token'] };
      });
  });
}

function setRoles(header, path) {
  return superagent
    .put(`${args.api}/${path}`)
    .set(header)
    .send({ "access": [{ "type": "read_all", "roles": roles }] })
    .then((response) => console.log(`${args.api}/${path}: ${response.statusCode}`))
    .catch((error) => console.log(`${path}: ${error.message}`));
}


login()
  .then((header) => [header, getForms(header)])
  .spread((header, forms) => {
    return forms.map((form) => {
      if (excludePaths.indexOf(form.path) < 0) {
        return setRoles(header, form.path);
      }
    });
  })
  .then(bluebird.all)
  .then(() => {
    console.log('excluded paths:', excludePaths);
    process.exit(0);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
