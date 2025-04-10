# Spec

## UI

### Library

- react@^19
- antd@^5
- @master/css@^1

### Naming conventions

The following dynamic variables all use javascript template literals.

- className: master.css
  - 不採用除了 master.css 以外任何方案
- i18n: BEM
  - `${feature}__${component_name}--${field_name}`
  - `${feature}__${component_name}--${status}`
  - `${feature}__${form_field}--${status}`
- testid: BEM
  - `${feature}__${component_name}--${field_name}`
  - `${feature}__${component_name}--${status}`
  - `${feature}__${event_type}--${component_name}`
- API: lowerCamelCase
  - `api${resources_name}`
- Route: upperCamelCase
  - `${page_name}Route`

## Frontend API

### lib CoreContext

path: @/libs/CoreContext

#### function useCoreContext

Get current portal CoreContext, if current portal is not created, it throws Error.

CoreContext has many global singleton objects:

- config: Settings for the front-end website.
- queryClient: It is the queryClient of react-query.
- emitter: He is an event manager.
- store: It is a state manager.
- localStorage: It is a proxy for localStorage.
- sessionStorage: It is a proxy for sessionStorage.
- componentRegistry: Used to register components for global use.
