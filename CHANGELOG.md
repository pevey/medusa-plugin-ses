# Change Log

## 2.0.15

### Patch Changes

- Print useful MedusaError messages to console when steps fail to assist with debugging and configuration

## 2.0.14

### Patch Changes

- Fixed import reference for helper functions from @medusajs/utils to medusa-core-utils

# Change Log

## 2.0.13

### Patch Changes

- Fixed validation of 'data' object on the dev/test api endpoint that was causing valid data to be dropped

# Change Log

## 2.0.12

### Patch Changes

- Minor: Removed unused dependency

## 2.0.11

### Patch Changes

- Minor: Switch to typescript build process
- Minor: Move most peer dependencies to dev dependencies

## 2.0.10

### Patch Changes

- Remove extraneous code from index.js

## 2.0.9

### Patch Changes

- The API endpoint will now return a more useful error when the templates are not found or compile errors are encountered rather than simply returning false.

## 2.0.8

### Patch Changes

- Added CHANGELOG
- The template path option can now be absolute or relative to the Medusa root folder
- No error will be thrown if html.hbs or text.hbs does not exist, so long as the other exists.
