/****************************************************
 Dependencies
 ****************************************************/

let httpReference = dependencies.http;

let httpDependency = {
    get: httpReference.get,
    post: httpReference.post,
    put: httpReference.put,
    delete: httpReference.delete,
};

let httpService = {};

/**
 *
 * Handles a request with retry from the platform side.
 */
function handleRequestWithRetry(requestFn, options, callbackData, callbacks) {
    try {
        return requestFn(options, callbackData, callbacks);
    } catch (error) {
        sys.logs.info("[endicia] Handling request "+JSON.stringify(error));
        if (ENDICIA_API_TYPE === "apiRest") {
            refreshToken();
            return requestFn(setAuthorization(options), callbackData, callbacks);
        }
        return requestFn(options, callbackData, callbacks);
    }
}

function createWrapperFunction(requestFn) {
    return function(options, callbackData, callbacks) {
        return handleRequestWithRetry(requestFn, options, callbackData, callbacks);
    };
}

for (let key in httpDependency) {
    if (typeof httpDependency[key] === 'function') httpService[key] = createWrapperFunction(httpDependency[key]);
}


/****************************************************
 Public API - Generic Functions
 ****************************************************/

/**
 * Sends an HTTP GET request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the GET request to.
 * @param {object} httpOptions  - The options to be included in the GET request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the GET request. [optional]
 * @return {object}             - The response of the GET request.
 */
exports.get = function(path, httpOptions, callbackData, callbacks) {
    if (ENDICIA_API_TYPE === "apiSoap") {
        throw "HTTP method unavailable for Endicia SOAP API";
    }
    let options = checkHttpOptions(path, httpOptions);
    return httpService.get(Endicia(options), callbackData, callbacks);
};

/**
 * Sends an HTTP POST request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the POST request to.
 * @param {object} httpOptions  - The options to be included in the POST request check http-service documentation.
 * @param {string} soapAction  - The SOAP Action for the request if the Endicia SOAP API is being used.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the POST request. [optional]
 * @return {object}             - The response of the POST request.
 */
exports.post = function(path, httpOptions, soapAction, callbackData, callbacks) {
    let options = checkHttpOptions(path, httpOptions);
    return httpService.post(Endicia(options, soapAction), callbackData, callbacks);
};

/**
 * Sends an HTTP PUT request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the PUT request to.
 * @param {object} httpOptions  - The options to be included in the PUT request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the POST request. [optional]
 * @return {object}             - The response of the PUT request.
 */
exports.put = function(path, httpOptions, callbackData, callbacks) {
    if (ENDICIA_API_TYPE === "apiSoap") {
        throw "HTTP method unavailable for Endicia SOAP API";
    }
    let options = checkHttpOptions(path, httpOptions);
    return httpService.put(Endicia(options), callbackData, callbacks);
};

/**
 * Sends an HTTP DELETE request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the DELETE request to.
 * @param {object} httpOptions  - The options to be included in the DELETE request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the DELETE request. [optional]
 * @return {object}             - The response of the DELETE request.
 */
exports.delete = function(path, httpOptions, callbackData, callbacks) {
    if (ENDICIA_API_TYPE === "apiSoap") {
        throw "HTTP method unavailable for Endicia SOAP API";
    }
    let options = checkHttpOptions(path, httpOptions);
    return httpService.delete(Endicia(options), callbackData, callbacks);
};

/****************************************************
 Helpers
 ****************************************************/

exports.trackByPicNumber = function (picNumber, carrier) {
    if  (ENDICIA_API_TYPE === "apiRest") {
        throw "Helper unavailable for Stamps/Endicia API REST";
    }
    return httpService.post(Endicia({
        path: '',
        body:  generateSoapRequestBody("PicNumber", picNumber, carrier)
    }, "www.envmgr.com/LabelService/StatusRequest"));
};

exports.trackByPieceNumber = function (pieceNumber, carrier) {
    if  (ENDICIA_API_TYPE === "apiRest") {
        throw "Helper unavailable for Stamps/Endicia API REST";
    }
    return httpService.post(Endicia({
        path: '',
        body:  generateSoapRequestBody("PieceNumber", pieceNumber, carrier)
    }, "www.envmgr.com/LabelService/StatusRequest"));};

exports.trackByTransactionId = function (transactionId, carrier) {
    if  (ENDICIA_API_TYPE === "apiRest") {
        throw "Helper unavailable for Stamps/Endicia API REST";
    }
    return httpService.post(Endicia({
        path: '',
        body:  generateSoapRequestBody("TransactionId", transactionId, carrier)
    }, "www.envmgr.com/LabelService/StatusRequest"));};

exports.trackByTrackingNumber = function (trackingNumber) {
    if  (ENDICIA_API_TYPE === "apiSoap") {
        throw "Helper unavailable for Endicia API SOAP";
    }
    if  (ENDICIA_API_TYPE === "apiRest") {
        return httpService.get('/track/' + trackingNumber);
    }
};

/****************************************************
 Private helpers
 ****************************************************/

function checkHttpOptions (path, options) {
    options = options || {};
    if (!!path) {
        if (isObject(path)) {
            // take the 'path' parameter as the options
            options = path || {};
        } else {
            if (!!options.path || !!options.params || !!options.body) {
                // options contain the http package format
                options.path = path;
            } else {
                // create html package
                options = {
                    path: path,
                    body: options
                }
            }
        }
    }
    return options;
}

function isObject (obj) {
    return !!obj && stringType(obj) === '[object Object]'
}

function generateRequestID() {
    const dateTime = new Date().toISOString().replace(/[-:.]/g, '');
    const uid = Math.floor(Math.random() * 1000000);
    return `${dateTime}${uid}`;
}

function generateSoapRequestBody (idType, value, carrier) {
    carrier = carrier || "USPS";
    let body = {
        "soap:Envelope": {
            "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "@xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                "@xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
                "soap:Body": {
                "StatusRequest": {
                    "@xmlns": "www.envmgr.com/LabelService",
                        "PackageStatusRequest": {
                            "RequesterID": config.get("requesterId"),
                                "RequestID": generateRequestID(),
                                "CertifiedIntermediary": {
                                "AccountID": config.get("accountNumber"),
                                    "PassPhrase": config.get("passphrase"),
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
    }
    body.StatusRequest.PackageStatusRequest.RequestOptions.Carrier = carrier;
    let pluralId = idType+"s";
    body.StatusRequest.PackageStatusRequest.RequestOptions[pluralId] = {};
    body.StatusRequest.PackageStatusRequest.RequestOptions[pluralId][idType] = value;
    return body;
}

let stringType = Function.prototype.call.bind(Object.prototype.toString)

/****************************************************
 Constants
 ****************************************************/

const ENDICIA_API_TYPE = config.get("endiciaApi");

const ENDICIA_API_BASE_URL = ENDICIA_API_TYPE === "apiSoap" ?  config.get("SOAP_API_BASE_URL") : config.get("REST_API_BASE_URL");

/****************************************************
 Configurator
 ****************************************************/

let Endicia = function (options, soapAction) {
    options = options || {};
    options = setApiUri(options);
    options = setRequestHeaders(options, soapAction);
    if (ENDICIA_API_TYPE === "apiRest") {
        options = setAuthorization(options);
    }
    return options;
}

/****************************************************
 Private API
 ****************************************************/

function setApiUri(options) {
    let url = options.path || "";
    options.url = ENDICIA_API_BASE_URL + url;
    sys.logs.info('[endicia] Set url: ' + options.path + "->" + options.url);
    return options;
}

function setRequestHeaders(options, soapAction) {
    let headers = options.headers || {};
    if (ENDICIA_API_TYPE === 'apiSoap') {
        headers['SOAPAction'] = soapAction;
        headers = mergeJSON(headers, {"Content-Type": "text/xml"});
    } else {
        headers = mergeJSON(headers, {"Content-Type": "application/json"});
    }
    options.headers = headers;
    return options;
}

function setAuthorization(options) {
    let authorization = options.authorization || {};
    authorization = mergeJSON(authorization, {
        type: "oauth2",
        accessToken: config.get("accessToken"),
        headerPrefix: "Bearer"
    });
    options.authorization = authorization;
    return options;
}

function refreshToken() {
    try {
        sys.logs.info("[endicia] Refresh Token request");
        let refreshTokenResponse = httpService.post({
            url: "https://signin.stampsendicia.com/oauth/token",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            authorization : {
                type: "basic",
                username: config.get("clientId"),
                password: config.get("clientSecret")
            },
            body: {
                grant_type: "refresh_token",
                refresh_token: config.get("refreshToken")
            }
        });
        sys.logs.info("[endicia] Refresh Token request response: "+JSON.stringify(refreshTokenResponse));
        if (response && response.access_token) {
            _config.set("accessToken", refreshTokenResponse.access_token);
            _config.set("refreshToken", refreshTokenResponse.refresh_token);
        } else {
            sys.logs.error("[endicia] Refresh Token request failed, no access token received.");
        }
    } catch (error) {
        sys.logs.error("[endicia] Error refreshing token: " + error.message);
    }
}

function mergeJSON (json1, json2) {
    var result = {};
    let key;
    for (key in json1) {
        if(json1.hasOwnProperty(key)) result[key] = json1[key];
    }
    for (key in json2) {
        if(json2.hasOwnProperty(key)) result[key] = json2[key];
    }
    return result;
}