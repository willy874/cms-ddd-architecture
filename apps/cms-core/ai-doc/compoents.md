# Components

## Components API

### Button

| Attribute        | Type                              | Description                                               |
| ---------------- | --------------------------------- | --------------------------------------------------------- |
| `loading`        | `boolean`                         | display loading icon.                                     |
| ...`buttonProps` | `React.ComponentProps<'button'>`  | Additional props passed to the root `<button>` element    |

### Form

Base on `React.ComponentProps<'form'>`.

### TextField

`TextField` is a flexible and customizable input field component designed for forms. It supports error states, helper texts, prefix/suffix elements, password toggle, and native form compatibility. It also integrates with `react-hook-form` via a helper resolver.

#### TextField Props

| Attribute      | Type                                 | Description                                                             |
| -------------- | ------------------------------------ | ----------------------------------------------------------------------- |
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
