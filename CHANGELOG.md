# Change Log

## 3.0.0

- Methods related to retrieving event data have been moved to a separate internal service.
- Template names are no longer set individually in the plugin options.  Templates MUST take the name of the event name, with "." replaced by "_".  For example, the "claim.created" event will only be processed by this notification plugin if the "claim_created" folder exists at the configure template parent path and contains a valid template.
- Greatly expanded the events available to use without having to create a custom subscriber.  Events will only be handled if a template folder exists.  Possible handled events now include:
   * batch.created
   * batch.updated
   * batch.canceled
   * batch.pre_processed
   * batch.confirmed
   * batch.processing
   * batch.completed
   * batch.failed
   * claim.created
   * claim.updated
   * claim.canceled
   * claim.fulfillment_created
   * claim.shipment_created
   * claim.refund_processed
   * customer.created
   * customer.updated
   * customer.password_reset
   * gift_card.created
   * invite.created
   * order.placed
   * order.updated
   * order.canceled
   * order.completed
   * order.orders_claimed
   * order.gift_card_created
   * order.payment_captured
   * order.payment_capture_failed
   * order.fulfillment_created
   * order.shipment_created
   * order.fulfillment_canceled
   * order.return_requested
   * order.items_returned
   * order.return_action_required
   * order.refund_created
   * order.refund_failed
   * order.swap_created
   * restock-notification.restocked
   * swap.created
   * swap.received
   * swap.fulfillment_created
   * swap.shipment_created
   * swap.payment_completed
   * swap.payment_captured
   * swap.payment_capture_failed
   * swap.refund_processed
   * swap.process_refund_failed
   * user.created
   * user.updated
   * user.password_reset
   * user.deleted
- Fixed bug where simulation mode setting would apply to usage of the sendEmail method that were not tiggered through the API endpoint.  Simulation mode will now only affect request to the /ses/send endpoint.
- Updated from javascript to typescript
- License updated to GPL v3

## 2.2.3

- Feat: The optional endpoint now uses a passkey.  Please see the Readme.
- Feat: The internal sesService.sendEmail(template_id, from, to, data) function is now available whether or not the endpoint is enabled.  This allows you to use the email sending ability in custom services without having to expose the endpoint.
- Fix: Remove unused package

## 2.1.1

- Feat: Add ability to use partials
- Feat: Add option to use optional endpoint in similation mode.  If enabled, no emails will be sent.  The plugin will attempt to compile the template and return the results.  This is useful for template debugging.

## 2.1.1

- Feat: Add ability to use partials
- Feat: Add option to use optional endpoint in similation mode.  If enabled, no emails will be sent.  The plugin will attempt to compile the template and return the results.  This is useful for template debugging.

## 2.0.17

- Add option to cc email address(es) on notifications for order.placed events
```js
order_placed_cc: 'person1@example.com,person2@example.com', // string, email address separated by comma
```
- Bump all dependencies to latest

## 2.0.16

- Clean up dependencies (again) to address the circular dep CJS issue.  Be sure to yarn link all the peer deps if you want to make changes to the plugin locally.

## 2.0.15

- Print useful MedusaError messages to console when steps fail to assist with debugging and configuration

## 2.0.14

- Fixed import reference for helper functions from @medusajs/utils to medusa-core-utils

## 2.0.13

- Fixed validation of 'data' object on the dev/test api endpoint that was causing valid data to be dropped

## 2.0.12

- Minor: Removed unused dependency

## 2.0.11

- Minor: Switch to typescript build process
- Minor: Move most peer dependencies to dev dependencies

## 2.0.10

- Remove extraneous code from index.js

## 2.0.9

- The API endpoint will now return a more useful error when the templates are not found or compile errors are encountered rather than simply returning false.

## 2.0.8

- Added CHANGELOG
- The template path option can now be absolute or relative to the Medusa root folder
- No error will be thrown if html.hbs or text.hbs does not exist, so long as the other exists.
