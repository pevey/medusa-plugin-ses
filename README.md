# medusa-plugin-ses

Notifications plugin for Medusa ecommerce server that sends transactional emails via AWS SES (Simple Email Service).

## Features

- Uses the email templating features built into AWS SES
- Templates are based on handlebars, so they are compatible with Sendgrid email templates
- AWS has no frontend for managing templates like Sendgrid does.  You must use the AWS CLI or a third party template manager.
- Refer to the AWS documentation at https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_CreateEmailTemplate.html.
- This plugin does not currently handle email attachments of any sort.  If you have a plugin that adds pdf invoices or other attachments, they will not be sent via this plugin.  This may be added at a later time if the need is there.

## Configuration

Enable in your medusa-config.js file similar to other plugins:

```
  {
    resolve: `medusa-plugin-ses`,
    options: {
      access_key_id: process.env.SES_ACCESS_KEY_ID,
      secret_access_key: process.env.SES_SECRET_ACCESS_KEY,
      region: process.env.SES_REGION,
      from: "example@example.com",
      order_placed_template: "order_placed"
      //order_return_requested_template: ""
      //swap_shipment_created_template: ""
      //claim_shipment_created_template: ""
      //order_items_returned_template: ""
      //swap_received_template: ""
      //swap_created_template: ""
      //gift_card_created_template: ""
      //gift_card_created_template: ""
      //order_shipped_template: ""
      //order_canceled_template: ""
      //user_password_reset_template: ""
      //medusa_restock_template: ""
      //order_refund_created_template: ""
    }
  }
```

The credentials and region are pulled from env variables.  
```
SES_REGION=""
SES_ACCESS_KEY_ID=""
SES_SECRET_ACCESS_KEY=""
```
- SES_REGION will be for example "us-east-1"
- Obtain the access key and secret access key by creating an IAM user with SES send permissions

The from email address must be a verified sender in your AWS account.

## Acknowledgement

This plugin borrows extensively from medusa-plugin-sendgrid by Oliver Juhl.