# Change Log

## 2.2.1

- Feat: The optional endpoint now uses a passkey.  Please see the Readme.
- Feat: The internal sesService.sendEmail(template_id, from, to, data) function is now available whether or not the endpoint is enabled.  This allows you to use the email sending ability in custom services without having to expose the endpoint.

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
