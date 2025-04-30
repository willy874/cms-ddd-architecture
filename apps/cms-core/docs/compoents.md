# Components

## Components API

### Button

| Attribute        | Type                             | Description                                            |
| ---------------- | -------------------------------- | ------------------------------------------------------ |
| `loading`        | `boolean`                        | display loading icon.                                  |
| ...`buttonProps` | `React.ComponentProps<'button'>` | Additional props passed to the root `<button>` element |

### Form

Base on `React.ComponentProps<'form'>`.

### Input

#### Input Overview

`Input` is a wrapped version of the native HTML `<input>` element that provides consistent styling and state management.

---

#### Usage Example

```tsx
import Input from '@/components/Input'

function Example() {
  return (
    <Input placeholder="Please enter text" />
  )
}
```

Supports all standard native `<input>` attributes, plus the following:

| Prop          | Type                                           | Description                     |
| ------------- | ---------------------------------------------- | ------------------------------- |
| `data-testid` | `string`                                       | Identifier for testing purposes |
| ...inputProps | `React.InputHTMLAttributes<HTMLInputElement>`  | Inherits all native input props |

##### Supported States

| State         | Description                                              |
| ------------- | -------------------------------------------------------- |
| hover         | Border color changes to `colorPrimaryHover`             |
| focus         | Border and shadow change to theme color `colorPrimary`  |
| disabled      | Background and border fade out, interaction disabled    |
| aria-invalid  | Shows error shadow and sets border color to red         |

#### Input Tips

- Can inherit the Input related parameters from TextField

### TextField

`TextField` is a flexible and customizable input field component designed for forms. It supports error states, helper texts, prefix/suffix elements, password toggle, and native form compatibility. It also integrates with `react-hook-form` via a helper resolver.

#### TextField Props

| Attribute     | Type                                 | Description                                                          |
| ------------- | ------------------------------------ | -------------------------------------------------------------------- |
| `error`       | `boolean`                            | If `true`, displays error styling and marks the input as invalid     |
| `helperText`  | `React.ReactNode`                    | Helper text shown below the input field                              |
| `prefixNode`  | `React.ReactNode`                    | Element rendered on the left inside the input (e.g. icon)            |
| `suffixNode`  | `React.ReactNode`                    | Element rendered on the right inside the input (e.g. icon or toggle) |
| `inputProps`  | `React.ComponentProps<typeof Input>` | Props passed directly to the inner `Input` component                 |
| `disabled`    | `boolean`                            | Whether the input is disabled                                        |
| `readOnly`    | `boolean`                            | Whether the input is read-only                                       |
| `type`        | `'text' \| 'password' \| ...`        | Input type, supports dynamic toggle when type is `password`          |
| `children`    | `React.ReactNode`                    | If provided, replaces the default `<Input />` with custom children   |
| `className`   | `string`                             | Custom class for the wrapper element                                 |
| ...`divProps` | `React.ComponentProps<'div'>`        | Additional props passed to the root `<div>` container                |

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

### Collapsible

#### Collapsible Overview

It provides animated, accessible collapsible UI behavior with consistent styling and component composition via context. 

---

#### Collapsible Usage Example

```tsx
import Collapsible, {
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/Collapsible'

function Example() {
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>
        <p>This content can be expanded or collapsed.</p>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

---

#### Collapsible Props

| Prop            | Type                               | Description                                       |
|-----------------|------------------------------------|--------------------------------------------------|
| `children`      | `React.ReactNode`                  | The trigger and content components               |
| `open`          | `boolean`                          | Controlled open state                            |
| `defaultOpen`   | `boolean` (default: `true`)        | Uncontrolled default open state                  |
| `onOpenChange`  | `(open: boolean) => void`          | Callback when open state changes                 |
| `disabled`      | `boolean`                          | Whether the collapsible is disabled              |

---

#### Trigger Component

```tsx
<CollapsibleTrigger>Toggle</CollapsibleTrigger>
```

##### CollapsibleTrigger Props

| Prop        | Type                  | Description                       |
|-------------|-----------------------|-----------------------------------|
| `children`  | `React.ReactNode`     | Button label                      |
| ...props    | `React.ComponentProps<'button'>` | All native button props supported |

---

#### Content Component

```tsx
<CollapsibleContent>
  <p>Expandable content here.</p>
</CollapsibleContent>
```

##### CollapsibleContent Props

| Prop        | Type                | Description                     |
|-------------|---------------------|---------------------------------|
| `children`  | `React.ReactNode`   | Content to show when expanded   |
| ...props    | `React.ComponentProps<'div'>` | All native div props supported |

---

#### Collapsible Animation & Styling

The `Collapsible` component uses keyframe animations for smooth transitions:

- `expand`: for expanding content (`height: 0 → var(--height)`)
- `collapse`: for collapsing content (`height: var(--height) → 0`)

The component also applies styles to the following data parts:

```css
[data-part="trigger"] {
  display: block;
  width: 100%;
  text-align: left;
}

[data-part="content"] {
  overflow: hidden;
}

[data-part="content"][data-state="open"] {
  animation: expand 110ms cubic-bezier(0, 0, 0.38, 0.9);
}

[data-part="content"][data-state="closed"] {
  animation: collapse 110ms cubic-bezier(0, 0, 0.38, 0.9);
}
```

---

#### Collapsible Context Usage

`CollapsibleTrigger` and `CollapsibleContent` must be rendered as children of the `Collapsible` component. If not, an error will be thrown:

```ts
throw new Error('Collapsible compound components must be rendered within a Collapsible component')
```

---

#### Collapsible Design Considerations

- **Animated transitions**: Uses CSS keyframes for smooth open/close effects.
- **Composable**: Trigger and content are designed to work as compound components using Context.
