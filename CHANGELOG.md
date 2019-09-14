# Changelog

## v2.0.0

#### Breaking changes

- The default export is removed, you can now access to the old default export via the named (`decompose`) export.
  ```javascript
    const { decompose } = require('fernandez-polygon-decomposition');
    // or (if you can use ES2015's import syntax)
    import { decompose } from 'fernandez-polygon-decomposition';
  ```
#### Other changes

- Updated all the dependencies.