# Project Specifications

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

#### CSS className

#### i18n key

Pattern: BEM

- `${feature}__${component_name}--${field_name}`
- `${feature}__${component_name}--${status}`
- `${feature}__${form_field}--${status}`

example:

```txt
auth__login-page--page-title
auth__field-label--username
auth__login-page-link--register
auth__field-placeholder--username
auth__login-error-message--username--required
auth__login-error-message--username--min-length
```

#### testid

Pattern: BEM

- `${feature}__${component_name}--${field_name}`
- `${feature}__${component_name}--${status}`
- `${feature}__${event_type}--${component_name}`

## Frontend API

### App Context

- Root provides queryClient of @tanstack/react-query.

### lib CoreContext

path: `@/libs/CoreContext`

#### function useCoreContext and getCoreContext

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

### lib http method

path: `@/libs/http`

#### createFetcher

#### defineRestResource

### lib locale

path: `@/libs/locale`

#### useTranslate

### lib Components

path: `@/libs/components`

#### Button

Base on `React.ComponentProps<'button'>`

| attribute | type | description |
| --- | --- | --- |
| loading | boolean | display loading icon. |

#### Form

Base on `React.ComponentProps<'form'>`

#### TextField

Base on `React.ComponentProps<'input'>`

### lib routes

#### Route Constants

path: `@/constants/routes`

- ROOT_ROUTE
- HOME_ROUTE
- LOGIN_ROUTE
- REGISTER_ROUTE
- FORGET_PASSWORD_ROUTE

### lib query bus

#### QueryBus Constants

path: `@/constants/query`

- GET_BASE_FETCHER_CONFIG
- GET_AUTH_FETCHER_CONFIG

#### Resources

- `@/remotes/<feature_name>/resources/<resource_name>`
  - *

## Common Requirement

### Additional information for me

If the original library is not available, please help me design and list it.

- translate key
- testid
- components
