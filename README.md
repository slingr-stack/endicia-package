# Overview

# Javascript API

The Javascript API of the endicia endpoint has two pieces:

- **HTTP requests**

## HTTP requests
You can make `GET`,`PUT`,`PATCH`,`DELETE` requests to the [endicia API](https://developer.stamps.com/rest-api/reference/serav1.html) like this:
```javascript
var response = pkg.endicia.api.get('/balance')
var response = pkg.endicia.api.post('/balance/add-funds', body)
var response = pkg.endicia.api.put('/account/security_questions', body)
var response = pkg.endicia.api.delete('/pickups/:pickup_id')
```

Please take a look at the documentation of the [HTTP service](https://github.com/slingr-stack/http-service)
for more information about generic requests.


## Dependencies
* HTTP Service

## About SLINGR

SLINGR is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

## License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
