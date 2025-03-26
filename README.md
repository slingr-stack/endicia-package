# Overview

Repo: [https://github.com/slingr-stack/endicia-package](https://github.com/slingr-stack/endicia-package)

This [package](https://platform-docs.slingr.io/dev-reference/data-model-and-logic/packages/) allows direct access to the [Endicia SOAP API](https://www.endicia.com/developer/docs/els.html#endicia-label-server-api) and the [Stamps.com/Endicia REST API](https://developer.stamps.com/rest-api/reference/serav1.html).
However, it provides shortcuts and helpers for most common use cases.

Some features available in this package are:

- Authentication and authorization
- Direct access to the Endicia SOAP API and Stamps.com/Endicia REST API.
- Helpers for both APIs.

## Configuration

#### Endicia API

The API you want to use, either the Endicia SOAP API or the Stamps.com/Endicia REST API. This parameter selects which of the two API methods will be used for requests.

**Name**: `endiciaApi`
**Type**: buttonsGroup
**Mandatory**: true

#### Endicia Label Server API URL (SOAP)

The URL for the Endicia SOAP API, where requests will be made if you select the "Endicia Label Server API (SOAP)" method.

**Name**: `SOAP_API_BASE_URL`
**Type**: buttonsGroup
**Mandatory**: true

#### Stamps.com/Endicia API URL (REST)

The URL for the Stamps.com/Endicia REST API, where requests will be made if you select the "Stamps.com/Endicia API (REST)" method.

**Name**: `REST_API_BASE_URL`
**Type**: text
**Mandatory**: true

#### Client ID

The unique client ID for authenticating with the Endicia API. This parameter is provided by Endicia when you register your application or account. Required when using Stamps.com/Endicia REST API.

**Name**: `clientId`
**Type**: text
**Mandatory**: true

#### API Token

The API token used to authenticate and authorize requests to the Endicia services. This is a sensitive value provided by Endicia and should be handled securely. Required when using Stamps.com/Endicia REST API.

**Name**: `apiToken`
**Type**: text
**Mandatory**: true

#### Client secret

The client secret used alongside the Client ID to authenticate API requests. This parameter is also provided by Endicia and should be kept private. Required when using Stamps.com/Endicia REST API.

**Name**: `clientSecret`
**Type**: text
**Mandatory**: true

#### Code Verifier

The "code verifier" used in the OAuth 2.0 authorization flow to ensure the security of the token exchange. This parameter is part of the authorization process and must be generated and used properly. Required when using Stamps.com/Endicia REST API.

**Name**: `codeVerifier`
**Type**: text
**Mandatory**: true

#### Request Token

The action to generate the access and refresh tokens. This is required when using Stamps.com/Endicia REST API.

**Name**: `requestToken`
**Type**: oauth2
**Mandatory**: true

#### Access Token

The access token obtained after completing the authorization flow. This token is used to make authenticated requests to the Endicia APIs. Required when using Stamps.com/Endicia REST API.

**Name**: `accessToken`
**Type**: text
**Mandatory**: true

#### Refresh Token

The refresh token is used to obtain a new access token when the original token expires. This is a necessary parameter to maintain long-term authentication. Required when using Stamps.com/Endicia REST API.

**Name**: `refreshToken`
**Type**: text
**Mandatory**: true

#### Account Number

The account number associated with your Endicia account. This number is necessary for identifying your account and making shipping-related requests. Required when using Endicia SOAP API.

**Name**: `accountNumber`
**Type**: text
**Mandatory**: true

#### Passphrase

The passphrase used alongside the account number to authenticate shipping and label service requests. This value should be treated as confidential. Required when using Endicia SOAP API.

**Name**: `passphrase`
**Type**: password
**Mandatory**: true

#### Requester ID

The requester ID used in the Endicia SOAP API to uniquely identify requests made to the Endicia API. Required when using Endicia SOAP API.

**Name**: `requesterId`
**Type**: text
**Mandatory**: true

#### OAuth Callback

The callback URL used in the OAuth 2.0 authentication flow. This URL is used to redirect the user after completing the authorization on the Endicia server.

**Name**: `oauthCallback`
**Type**: label

# JavaScript API

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
