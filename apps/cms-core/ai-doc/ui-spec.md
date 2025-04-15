# UI Specifications

## genStyleHook Documentation

### Overview

`genStyleHook` is a utility function that creates style hooks for React components. It integrates with your design system's theming capabilities and provides a structured way to define and manage component styles.

### Import

```typescript
import { genStyleHook } from './path/to/genStyleHook';
```

### Basic Usage

```ts
const useStyle = genStyleHook('Button', 
  ({ token }) => ({
    // Component tokens
    primaryColor: token.colorPrimary,
    borderRadius: token.borderRadiusLG,
  }),
  ({ componentToken }) => ({
    // CSS styles with component tokens
    root: {
      backgroundColor: componentToken.primaryColor,
      borderRadius: componentToken.borderRadius,
      padding: '8px 16px',
    },
    icon: {
      marginRight: '8px',
    }
  })
);

function Button({ children, className, ...props }) {
  const [wrap, hashId, styles] = useStyle();
  
  return wrap(
    <button 
      className={`${styles.root} ${hashId} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
```

### API Reference

### Function Signatures

`genStyleHook` has two overloads:

#### With Component Tokens

```typescript
genStyleHook<Path, CSS, Token>(
  name: Path,
  createComponentToken: (params: { token: AliasToken }) => Token,
  createCSS: (params: { token: AliasToken, componentToken: Token }) => CSS
): UseStyleHook<Token, CSS>
```

#### Without Component Tokens

```typescript
genStyleHook<Path, CSS, Token>(
  name: Path,
  createCSS: (params: { token: AliasToken, componentToken: Token }) => CSS
): UseStyleHook<Token, CSS>
```

#### Parameters

- **name** `string | string[]`:
  - Component identifier(s) used to create CSS class names and CSS variable paths
  - If an array is provided, the paths will be joined with hyphens

- **createComponentToken** `(params: { token: AliasToken }) => Token`:
  - Optional function that returns component-specific tokens
  - Uses global design tokens from the theme system
  - These tokens will be available as CSS variables

- **createCSS** `(params: { token: AliasToken, componentToken: Token }) => CSS`:
  - Function that generates CSS objects for your component
  - Has access to both global design tokens and component-specific tokens
  - The keys of the returned object will become part of the generated class names

#### Return Value

The `genStyleHook` function returns a custom hook that, when called, returns a tuple with:

1. **wrap** `(node: React.ReactElement) => React.JSX.Element`:
   - Function to wrap your component with the generated styles

2. **hashId** `string`:
   - Unique hash identifier for the component's styles
   - Useful for additional class name uniqueness

3. **styles** `Record<keyof CSS, string>`:
   - Object mapping style keys to generated class names
   - Use these to apply specific styles to elements

4. **componentToken** `Token`:
   - The component-specific token object
   - Useful for accessing token values in your component

### CSS Variables

Component tokens are automatically converted to CSS variables:

```css
--component-name-token-name: value
```

For example, a token `primaryColor` for a component named 'Button' would become:

```css
--button-primary-color: #3b82f6
```

These variables can be used throughout your component's styles.

### Type Inferring

You can extract the token type for TypeScript integration:

```typescript
import { InferToken } from './path/to/genStyleHook';

// Get the token type from the style hook
type ButtonToken = InferToken<typeof useButtonStyle>;

// Use in component token declarations
declare module '@/your/design/path' {
  export interface ComponentsToken {
    Button: ButtonToken;
  }
}
```

### Practical Example

Here's how to create a complete Input component with styling:

```ts
//
const AliasToken = {
  colorOutline: #79747e,
  colorPrimary: #6750a4,
}
// Define the style hook
const useStyle = genStyleHook('Input',
  ({ token }) => ({
    borderColor: token.colorOutline,
    backgroundColor: token.colorPrimary,
  }),
  ({ componentToken }) => ({
    root: {
      padding: '8px 12px',
      border: `1px solid ${componentToken.borderColor}`,
      // output log: var(--input-background-color, #79747e)
      backgroundColor: componentToken.backgroundColor,
      borderRadius: '4px',
      outline: 'none',
      transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      '&:focus': {
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6',
      },
    },
  })
);

// Add type definitions for the token
declare module '@/remotes/design' {
  export interface ComponentsToken {
    Input: InferToken<typeof useStyle>;
  }
}

// Create the component using the style hook
function Input({ className, ...props }) {
  const [wrap, hashId, styles] = useStyle();
  
  return wrap(
    <input
      className={`${styles.root} ${hashId} ${className || ''}`}
      {...props}
    />
  );
}
```

### Advanced Usage

#### Nested Path Names

You can use an array for the name parameter to create nested paths:

```ts
const useStyle = genStyleHook(['Form', 'Input'], /* ... */);
// Generates class names like "Form-Input__root-a1b2c3"
```

#### Accessing Generated Class Names

The returned `styles` object contains all the class names keyed by your CSS object keys:

```tsx
const [wrap, hashId, styles] = useStyle();

// Use specific style classes
return (
  <div className={styles.container}>
    <span className={styles.label}>Label</span>
    <input className={styles.input} />
  </div>
);
```
