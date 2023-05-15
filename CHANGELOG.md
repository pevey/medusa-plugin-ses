# Change Log

## 2.0.11

### Patch Changes

- Minor: Switch to typexcript build process
- Minor: Move most peer depencies to dev dependencies

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
