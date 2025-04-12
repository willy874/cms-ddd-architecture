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
auth__login-error-message--username--required
auth__login-error-message--username--min-length
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

#### Tip

- zod Don't declare schema outside of react components unless it solves the problem of re-rendering when switching languages.

## lib Components

path: `@/libs/components`

### Button

| Attribute        | Type                              | Description                                               |
| ---------------- | --------------------------------- | --------------------------------------------------------- |
| `loading`        | `boolean`                         | display loading icon.                                     |
| ...`buttonProps` | `React.ComponentProps<'button'>`  | Additional props passed to the root `<button>` element    |

### Form

Base on `React.ComponentProps<'form'>` d

### TextField

`TextField` is a flexible and customizable input field component designed for forms. It supports labels, error states, helper texts, prefix/suffix elements, password toggle, and native form compatibility. It also integrates with `react-hook-form` via a helper resolver.

#### TextField Props

| Attribute      | Type                                 | Description                                                             |
| -------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| `label`        | `React.ReactNode`                    | Label displayed above the input field                                   |
| `error`        | `boolean`                            | If `true`, displays error styling and marks the input as invalid        |
| `helperText`   | `React.ReactNode`                    | Helper text shown below the input field                                 |
| `prefixNode`   | `React.ReactNode`                    | Element rendered on the left inside the input (e.g. icon)               |
| `suffixNode`   | `React.ReactNode`                    | Element rendered on the right inside the input (e.g. icon or toggle)    |
| `inputProps`   | `React.ComponentProps<typeof Input>` | Props passed directly to the inner `Input` component                    |
| `disabled`     | `boolean`                            | Whether the input is disabled                                           |
| `readOnly`     | `boolean`                            | Whether the input is read-only                                          |
| `type`         | `'text' \| 'password' \| ...`        | Input type, supports dynamic toggle when type is `password`             |
| `children`     | `React.ReactNode`                    | If provided, replaces the default `<Input />` with custom children      |
| `className`    | `string`                             | Custom class for the wrapper element                                    |
| ...`divProps`  | `React.ComponentProps<'div'>`        | Additional props passed to the root `<div>` container                   |

#### TextField Example

```tsx
<TextField
  label="Password"
  helperText="Must be at least 8 characters"
  error={hasError}
  type="password"
  prefixNode={<LockIcon />}
  suffixNode={<EyeIcon />}
  inputProps={{
    placeholder: 'Enter your password',
    onChange: handleChange,
    value: form.password,
  }}
/>
```

#### TextField Tips

- When `error` is `true`, `label` and `helperText` are styled in red, and `aria-invalid` is set.
- When `type="password"` and a `suffixNode` is present, clicking the suffix will toggle visibility.
- You can pass custom `children` to render a fully controlled `Input`, useful for advanced use cases.
- Use `TextField.reactHookFormRegisterResolver(register(...))` to convert `react-hook-form` registration into `TextField`-compatible props.

#### React Hook Form Integration

```tsx
const { register } = useForm()
const registerResolver = TextField.reactHookFormRegisterResolver

<TextField
  label="Email"
  helperText="We’ll never share your email."
  error={!!errors.email}
  {...registerResolver(register('email'))}
/>
```

## lib routes

### Route Constants

path: `@/constants/routes`

- ROOT_ROUTE
- HOME_ROUTE
- LOGIN_ROUTE
- REGISTER_ROUTE
- FORGET_PASSWORD_ROUTE

#### Tip

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
