/****************************************************
 Configuration builder

 The configuration object should be built to configure the package dependencies

 ****************************************************/

let configurationBuilder = function (config) {
    config.oauth = {
        id: config.id || 'installationInfo-Endicia-User-'+sys.context.getCurrentUserRecord().id(),
        authUrl: config.authUrl,
        accessTokenUrl: config.accessTokenUrl,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        scope: config.scope,
        state: config.state,
        oauthCallback: config.oauthCallback
    };
    return config;
}
