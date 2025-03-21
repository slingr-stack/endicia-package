# Overview

Repo: [https://github.com/slingr-stack/endicia-package](https://github.com/slingr-stack/endicia-package)

This package allows direct access to the [Endicia SOAP API](https://www.endicia.com/developer/docs/els.html#endicia-label-server-api) and the [Stamps.com/Endicia REST API](https://developer.stamps.com/rest-api/reference/serav1.html).
However, it provides shortcuts and helpers for most common use cases.

Some features available in this package are:

- Authentication and authorization
- Direct access to the Endicia SOAP API and Stamps.com/Endicia REST API.
- Helpers for both APIs.

## Configuration

#### Endicia API

**Name**: `endiciaApi`
**Type**: buttonsGroup
**Mandatory**: true

#### Endicia Label Server API URL (SOAP)

**Name**: `SOAP_API_BASE_URL`
**Type**: buttonsGroup
**Mandatory**: true

#### Stamps.com/Endicia API URL (REST)

**Name**: `REST_API_BASE_URL`
**Type**: buttonsGroup
**Mandatory**: true

#### Client ID

**Name**: `clientId`
**Type**: text
**Mandatory**: true

#### Endicia API

**Name**: `apiToken`
**Type**: text
**Mandatory**: true

#### Client secret

**Name**: `clientSecret`
**Type**: text
**Mandatory**: true

#### Code Verifier

**Name**: `codeVerifier`
**Type**: text
**Mandatory**: true

#### Request Token

**Name**: `requestToken`
**Type**: oauth2
**Mandatory**: true

#### Access Token

**Name**: `accessToken`
**Type**: text
**Mandatory**: true

#### Refresh Token

**Name**: `refreshToken`
**Type**: text
**Mandatory**: true

#### Account Number

**Name**: `accountNumber`
**Type**: text
**Mandatory**: true

#### Passphrase

**Name**: `passphrase`
**Type**: password
**Mandatory**: true

#### Requester ID

**Name**: `requesterId`
**Type**: text
**Mandatory**: true

#### OAuth Callback

**Name**: `oauthCallback`
**Type**: label

# Javascript API

The Javascript API of the Endicia package has two pieces:

- **HTTP requests**
- **Helpers**

## HTTP requests
You can make `GET`,`PUT`,`POST` and `DELETE` requests to the [Stamps.com/Endicia Rest API](https://developer.stamps.com/rest-api/reference/serav1.html) like this:
```javascript
var response = pkg.endicia.api.get('/balance')
var response = pkg.endicia.api.post('/balance/add-funds', body)
var response = pkg.endicia.api.put('/account/security_questions', body)
var response = pkg.endicia.api.delete('/pickups/:pickup_id')
```
For [Endicia SOAP API](https://www.endicia.com/developer/docs/els.html#endicia-label-server-api) only `POST`requests to the same endpoint are allowed.
```javascript
var response = pkg.endicia.api.post('', {
    body: {
        "soap:Envelope": {
            "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "@xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "@xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
            "soap:Body": {
                "StatusRequest": {
                    "@xmlns": "www.envmgr.com/LabelService",
                    "PackageStatusRequest": {
                        "RequesterID": 123123,
                        "RequestID": 1,
                        "CertifiedIntermediary": {
                            "AccountID": 123123,
                            "PassPhrase": "frase",
                        },
                        "RequestOptions": {
                            "@CostCenter": "",
                            "@ReferenceID": "",
                            "@PackageStatus": "CURRENT",
                            "@StartingTransactionID": ""
                        }
                    }
                }
            }
        }
    }}, "www.envmgr.com/LabelService/StatusRequest");
```
Please take a look at the documentation of the [HTTP service](https://github.com/slingr-stack/http-service)
for more information about generic requests.

## Helpers

These are the helpers for Endicia Soap API:

```javascript
pkg.endicia.api.trackByPieceNumber(":pieceNumber");
pkg.endicia.api.trackByPicNumber(":picNumber");
pkg.endicia.api.trackByTransactionId(":transactionId");
```

For Stamps.com/Endicia there is one helper:

```javascript
pkg.endicia.api.trackByTrackingNumber(":trackingNumber");
```

Note that if you use the helpers of the another API the package will throw an error.


## Events

This package does not generate webhooks for events.

## Dependencies
* HTTP Service

## About Slingr

Slingr is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about Slingr](https://slingr.io)

## License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
