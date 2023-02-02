# medusa-plugin-ses

Notifications plugin for Medusa ecommerce server that sends transactional emails via AWS SES (Simple Email Service).

## Features

- THERE ARE BREAKING CHANGES IF YOU ARE UPGRADING FROM 1.x to 2.0
- ~~Uses the email templating features built into AWS SES~~ Changed in version 2.0.  Templates are now stored locally.  See Configuration section below.
- Templates are based on handlebars, so they are compatible with Sendgrid email templates
- ~~This plugin does not currently handle email attachments of any sort.  If you have a plugin that adds pdf invoices or other attachments, they will not be sent via this plugin.  This may be added at a later time if the need is there.~~  Support for attachments added in version 2.0.
- An API endpoint for testing and potentially for use with other non-Medusa applications is included.  By default, the endpoint does nothing for security reasons.  See configuration options below to enable it.

## Configuration

Enable in your medusa-config.js file similar to other plugins:

```
  {
    resolve: `medusa-plugin-ses`,
    options: {
      access_key_id: process.env.SES_ACCESS_KEY_ID,
      secret_access_key: process.env.SES_SECRET_ACCESS_KEY,
      region: process.env.SES_REGION,
      from: process.env.SES_FROM,
      enable_endpoint: process.env.SES_ENABLE_ENDPOINT,
      template_path: process.env.SES_TEMPLATE_PATH,
      order_placed_template: 'order_placed',
      order_shipped_template: 'order_shipped',
      user_password_reset_template: 'user_password_reset',
      gift_card_created_template: 'gift_card_created',
      //order_canceled_template: 'order_canceled',
      //order_refund_created_template: 'order_refund_created',
      //order_return_requested_template: 'order_return_requested',
      //order_items_returned_template: 'order_items_returned',
      //swap_created_template: 'swap_created',
      //swap_shipment_created_template: 'swap_shipment_created',
      //swap_received_template: 'swap_received',
      //claim_shipment_created_template: 'claim_shipment_created',
      //medusa_restock_template: 'medusa_restock',
    }
  },
```

The credentials and region are pulled from env variables.  
```
SES_REGION=""
SES_ACCESS_KEY_ID=""
SES_SECRET_ACCESS_KEY=""
SES_FROM="Cool Company <orders@example.com>"
SES_ENABLE_ENDPOINT=false
SES_TEMPLATE_PATH="/full/absolute/path/to/medusa-server/data/templates"
```
- SES_REGION will be for example "us-east-1"

- Obtain the access key id and secret access key by creating an IAM user with SES send permissions.

- The SES_FROM email address must be a verified sender in your AWS account.

- The sending rate is the max number of emails to send per second.  Messages beyond the max will by queued, up to a point.  The initial max sending rate for most AWS accounts when you are first moved out of the sandbox is 14.  You can set to higher or lower as desired.

- The template path needs to be the full absolute path to the folder.  For example, if your build runs from /home/medusa/medusa-server/, create a 'data/templates' folder and include the entire path in the SES_TEMPLATE_PATH variable.
```
medusa-server  // root directory
|-data
      |-templates
            |-order_placed  // or whatever you name your templates and specify in the config file
                  |-subject.hbs
                  |-html.hbs
                  |-text.hbs
            |-gift_card_created
                  |-subject.hbs
                  |-html.hbs
                  |-text.hbs
            |- etc            
--
```

When emails are sent, each of the three parts will be compiled. 
- subject is required
- either html or text is required, but one or the other can be blank.

The template reference here explains the variables that can be used:
https://docs.medusajs.com/add-plugins/sendgrid/#template-reference


- This plugin adds an endpoint at http://[server]/ses/send
By default, the endpoint will refuse to send any emails.
This endpoint may be useful for testing purposes and for use by related applications.
There is NO SECURITY on the endpoint by default.
Most people will NOT need to enable this endpoint.
If you are certain that you want to enable it and that you know what you are doing,
set the environment variable SES_ENABLE_ENDPOINT to "42" (string).
The unsual setting is meant to prevent enabling by accident or without thought.
To use the endpoint, POST a json req.body with: template_id, from, to, and data to /ses/send.
Remember that the from email address must be a verified sender in your AWS console.
Also remember that if your AWS account is still in sandbox mode, you can only SEND emails to verified sender email addresses, as well.

## Acknowledgement

This plugin borrows extensively from medusa-plugin-sendgrid by Oliver Juhl.