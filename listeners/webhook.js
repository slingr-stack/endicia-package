/****************************************************
 Listeners
 ****************************************************/

listeners.defaultWebhookEndicia = {
    label: 'Catch Endicia events',
    type: 'service',
    options: {
        service: 'http',
        event: 'webhook',
        matching: {
            path: '/endicia',
        }
    },
    callback: function(event) {
        sys.logs.info('Received Endicia webhook. Processing and triggering a package event.');
        var body = JSON.stringify(event.data.body);
        var signature = event.data.parameters.signature || "";

        if (pkg.endicia.functions.verifySignature(body, signature)) {
            sys.events.triggerEvent('Endicia:webhook', body);
            return "ok";
        }
        else throw new Error("Invalid webhook");
    }
};
