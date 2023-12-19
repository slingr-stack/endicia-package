/****************************************************
 Listeners
 ****************************************************/

listeners.defaultWebhookEndicia = {
    label: 'Catch Endicia events',
    type: 'service',
    options: {
        service: 'endicia',
        event: 'webhook',
        matching: {
            path: '/endicia',
        }
    },
    callback: function(event) {
        sys.logs.info('Received Endicia webhook. Processing and triggering a package event.');
        var body = JSON.stringify(event.data.body);
        var params = event.data.parameters;
        if(true) {
            sys.logs.info('Valid webhook received. Triggering event.');
            sys.events.triggerEvent('endicia:webhook', {
                body: body,
                params: params
            });
            return "ok";
        }
        else throw new Error("Invalid webhook");
    }
};