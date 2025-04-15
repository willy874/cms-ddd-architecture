# Project Specifications

## UI

### Package

- react@^19
- @master/css@^1
- @tanstack/react-query
- @tanstack/react-router
- react-hook-form
- zod
- classnames

### Naming conventions

The following dynamic variables all use javascript template literals.

#### CSS className

Always use Master CSS, no shorthand.

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
auth__username-error-message--required
```

#### testid

Pattern: BEM

- `${feature}__${component_name}--${field_name}`
- `${feature}__${component_name}--${status}`
- `${feature}__${event_type}--${component_name}`

## App Context

- Root provides queryClient of @tanstack/react-query.

## lib CoreContext

path: `@/libs/CoreContext`

### function useCoreContext and getCoreContext

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

## lib http method

path: `@/libs/http`

### createFetcher

### defineRestResource

## lib locale

path: `@/libs/locale`

### useTranslate

#### useTranslate Example

```tsx
function FC() {
  const t = useTranslate()
  return (
    <div>{t('i18n_key')}</div>
  )
}
```

```tsx
function FC() {
  const t = useTranslate()
  const FormSchema = z.object({
    test: z.nonempty({ message: t('test__heading') }),
  })
  return (...)
}
```

#### useTranslate Tip

- zod Don't declare schema outside of react components unless it solves the problem of re-rendering when switching languages.

## lib Components

path: `@/libs/components`

example:

```ts
import { TextField, Button, Form } from '@/libs/components'
```

## lib routes

### Route Constants

path: `@/constants/routes`

- ROOT_ROUTE
- HOME_ROUTE
- LOGIN_ROUTE
- REGISTER_ROUTE
- FORGET_PASSWORD_ROUTE

#### Route Example

```tsx
import { Link } from '@tanstack/react-router'
import { HOME_ROUTE } from '@/constants/routes';
import { getCoreContext } from '@/libs/CoreContext'

function FC() {
  const ctx = getCoreContext()
  const HomeRoute = ctx.routes.get(HOME_ROUTE)
  return (
    <Link to={HomeRoute.to}>Go to Home</Link>
  )
}
```

```tsx
import { Link } from '@tanstack/react-router'
import { HOME_ROUTE } from '@/constants/routes';
import { getCoreContext } from '@/libs/CoreContext'

function FC1() {
  const ctx = getCoreContext()
  const HomeRoute = ctx.routes.get(HOME_ROUTE)
  const navigate = HomeRoute.useNavigate()
  const onCall = () => {
    navigate({ to: HomeRoute.to })
  }
  return (
    <FC2 onCall={onCall}>Go to Home</FC2>
  )
}
```

#### Route Tips

- If you want to navigate, do not use the a tag, use @tanstack/react-router's Link instead

## lib query bus

### QueryBus Constants

path: `@/constants/query`

- GET_BASE_FETCHER_CONFIG
- GET_AUTH_FETCHER_CONFIG

### Resources

- `@/remotes/<feature_name>/resources/<resource_name>`
  - *

## Common Requirement

### Additional information for me

If the original library is not available, please help me design and list it.

- translate key
- testid
- components
