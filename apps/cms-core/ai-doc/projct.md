# Spec

## UI

### Package

- react@^19
- @master/css@^1
- @tanstack/react-query
- @tanstack/react-router
- react-hook-form
- zod

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

#### i18n key example

```txt
auth__login-page--page-title
auth__field-label--username
auth__login-page-link--register
auth__field-placeholder--username
auth__login-error-message--username--required
auth__login-error-message--username--min-length
```

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
- locale: i18n instance.

## App Context

Root provides queryClient of @tanstack/react-query.

## Library

- `@/libs/CoreContext`
  - useCoreContext
  - getCoreContext
- `@/libs/http`
  - createFetcher
  - defineRestResource
- `@/libs/locale`
  - useTranslate
- `@/libs/components`
  - Button
  - Form
  - TextField
- `@/constants/routes`
  - ROOT_ROUTE
  - HOME_ROUTE
  - LOGIN_ROUTE
  - REGISTER_ROUTE
  - FORGET_PASSWORD_ROUTE
- `@/constants/query`
  - GET_BASE_FETCHER_CONFIG
  - GET_AUTH_FETCHER_CONFIG
- `@/remotes/<feature_name>/resources/<resource_name>`
  - *
