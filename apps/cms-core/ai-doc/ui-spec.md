# UI Specifications

## Design Token

```css
:root {
  --blue: #1677FF;
  --purple: #722ED1;
  --cyan: #13C2C2;
  --green: #52C41A;
  --magenta: #EB2F96;
  --pink: #EB2F96;
  --red: #F5222D;
  --orange: #FA8C16;
  --yellow: #FADB14;
  --volcano: #FA541C;
  --geekblue: #2F54EB;
  --gold: #FAAD14;
  --lime: #A0D911;
  --color-primary: #1677ff;
  --color-success: #52c41a;
  --color-warning: #faad14;
  --color-error: #ff4d4f;
  --color-info: #1677ff;
  --color-link: #1677ff;
  --color-text-base: #000;
  --color-bg-base: #fff;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-family-code: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  --font-size: 14px;
  --line-width: 1px;
  --line-type: solid;
  --motion-ease-out-circ: cubic-bezier(0.08, 0.82, 0.17, 1);
  --motion-ease-in-out-circ: cubic-bezier(0.78, 0.14, 0.15, 0.86);
  --motion-ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
  --motion-ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
  --motion-ease-out-back: cubic-bezier(0.12, 0.4, 0.29, 1.46);
  --motion-ease-in-back: cubic-bezier(0.71, -0.46, 0.88, 0.6);
  --motion-ease-in-quint: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  --motion-ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
  --border-radius: 6px;
  --size-popup-arrow: 16px;
  --control-height: 32px;
  --z-index-base: 0;
  --z-index-popup-base: 1000;
  --opacity-image: 1;
  --blue-1: #e6f4ff;
  --blue-2: #bae0ff;
  --blue-3: #91caff;
  --blue-4: #69b1ff;
  --blue-5: #4096ff;
  --blue-6: #1677ff;
  --blue-7: #0958d9;
  --blue-8: #003eb3;
  --blue-9: #002c8c;
  --blue-10: #001d66;
  --purple-1: #f9f0ff;
  --purple-2: #efdbff;
  --purple-3: #d3adf7;
  --purple-4: #b37feb;
  --purple-5: #9254de;
  --purple-6: #722ed1;
  --purple-7: #531dab;
  --purple-8: #391085;
  --purple-9: #22075e;
  --purple-10: #120338;
  --cyan-1: #e6fffb;
  --cyan-2: #b5f5ec;
  --cyan-3: #87e8de;
  --cyan-4: #5cdbd3;
  --cyan-5: #36cfc9;
  --cyan-6: #13c2c2;
  --cyan-7: #08979c;
  --cyan-8: #006d75;
  --cyan-9: #00474f;
  --cyan-10: #002329;
  --green-1: #f6ffed;
  --green-2: #d9f7be;
  --green-3: #b7eb8f;
  --green-4: #95de64;
  --green-5: #73d13d;
  --green-6: #52c41a;
  --green-7: #389e0d;
  --green-8: #237804;
  --green-9: #135200;
  --green-10: #092b00;
  --magenta-1: #fff0f6;
  --magenta-2: #ffd6e7;
  --magenta-3: #ffadd2;
  --magenta-4: #ff85c0;
  --magenta-5: #f759ab;
  --magenta-6: #eb2f96;
  --magenta-7: #c41d7f;
  --magenta-8: #9e1068;
  --magenta-9: #780650;
  --magenta-10: #520339;
  --pink-1: #fff0f6;
  --pink-2: #ffd6e7;
  --pink-3: #ffadd2;
  --pink-4: #ff85c0;
  --pink-5: #f759ab;
  --pink-6: #eb2f96;
  --pink-7: #c41d7f;
  --pink-8: #9e1068;
  --pink-9: #780650;
  --pink-10: #520339;
  --red-1: #fff1f0;
  --red-2: #ffccc7;
  --red-3: #ffa39e;
  --red-4: #ff7875;
  --red-5: #ff4d4f;
  --red-6: #f5222d;
  --red-7: #cf1322;
  --red-8: #a8071a;
  --red-9: #820014;
  --red-10: #5c0011;
  --orange-1: #fff7e6;
  --orange-2: #ffe7ba;
  --orange-3: #ffd591;
  --orange-4: #ffc069;
  --orange-5: #ffa940;
  --orange-6: #fa8c16;
  --orange-7: #d46b08;
  --orange-8: #ad4e00;
  --orange-9: #873800;
  --orange-10: #612500;
  --yellow-1: #feffe6;
  --yellow-2: #ffffb8;
  --yellow-3: #fffb8f;
  --yellow-4: #fff566;
  --yellow-5: #ffec3d;
  --yellow-6: #fadb14;
  --yellow-7: #d4b106;
  --yellow-8: #ad8b00;
  --yellow-9: #876800;
  --yellow-10: #614700;
  --volcano-1: #fff2e8;
  --volcano-2: #ffd8bf;
  --volcano-3: #ffbb96;
  --volcano-4: #ff9c6e;
  --volcano-5: #ff7a45;
  --volcano-6: #fa541c;
  --volcano-7: #d4380d;
  --volcano-8: #ad2102;
  --volcano-9: #871400;
  --volcano-10: #610b00;
  --geekblue-1: #f0f5ff;
  --geekblue-2: #d6e4ff;
  --geekblue-3: #adc6ff;
  --geekblue-4: #85a5ff;
  --geekblue-5: #597ef7;
  --geekblue-6: #2f54eb;
  --geekblue-7: #1d39c4;
  --geekblue-8: #10239e;
  --geekblue-9: #061178;
  --geekblue-10: #030852;
  --gold-1: #fffbe6;
  --gold-2: #fff1b8;
  --gold-3: #ffe58f;
  --gold-4: #ffd666;
  --gold-5: #ffc53d;
  --gold-6: #faad14;
  --gold-7: #d48806;
  --gold-8: #ad6800;
  --gold-9: #874d00;
  --gold-10: #613400;
  --lime-1: #fcffe6;
  --lime-2: #f4ffb8;
  --lime-3: #eaff8f;
  --lime-4: #d3f261;
  --lime-5: #bae637;
  --lime-6: #a0d911;
  --lime-7: #7cb305;
  --lime-8: #5b8c00;
  --lime-9: #3f6600;
  --lime-10: #254000;
  --color-text: rgba(0, 0, 0, 0.88);
  --color-text-secondary: rgba(0, 0, 0, 0.65);
  --color-text-tertiary: rgba(0, 0, 0, 0.45);
  --color-text-quaternary: rgba(0, 0, 0, 0.25);
  --color-fill: rgba(0, 0, 0, 0.15);
  --color-fill-secondary: rgba(0, 0, 0, 0.06);
  --color-fill-tertiary: rgba(0, 0, 0, 0.04);
  --color-fill-quaternary: rgba(0, 0, 0, 0.02);
  --color-bg-solid: rgb(0, 0, 0);
  --color-bg-solid-hover: rgba(0, 0, 0, 0.75);
  --color-bg-solid-active: rgba(0, 0, 0, 0.95);
  --color-bg-layout: #f5f5f5;
  --color-bg-container: #ffffff;
  --color-bg-elevated: #ffffff;
  --color-bg-spotlight: rgba(0, 0, 0, 0.85);
  --color-bg-blur: transparent;
  --color-border: #d9d9d9;
  --color-border-secondary: #f0f0f0;
  --color-primary-bg: #e6f4ff;
  --color-primary-bg-hover: #bae0ff;
  --color-primary-border: #91caff;
  --color-primary-border-hover: #69b1ff;
  --color-primary-hover: #4096ff;
  --color-primary-active: #0958d9;
  --color-primary-text-hover: #4096ff;
  --color-primary-text: #1677ff;
  --color-primary-text-active: #0958d9;
  --color-success-bg: #f6ffed;
  --color-success-bg-hover: #d9f7be;
  --color-success-border: #b7eb8f;
  --color-success-border-hover: #95de64;
  --color-success-hover: #95de64;
  --color-success-active: #389e0d;
  --color-success-text-hover: #73d13d;
  --color-success-text: #52c41a;
  --color-success-text-active: #389e0d;
  --color-error-bg: #fff2f0;
  --color-error-bg-hover: #fff1f0;
  --color-error-bg-filled-hover: #ffdfdc;
  --color-error-bg-active: #ffccc7;
  --color-error-border: #ffccc7;
  --color-error-border-hover: #ffa39e;
  --color-error-hover: #ff7875;
  --color-error-active: #d9363e;
  --color-error-text-hover: #ff7875;
  --color-error-text: #ff4d4f;
  --color-error-text-active: #d9363e;
  --color-warning-bg: #fffbe6;
  --color-warning-bg-hover: #fff1b8;
  --color-warning-border: #ffe58f;
  --color-warning-border-hover: #ffd666;
  --color-warning-hover: #ffd666;
  --color-warning-active: #d48806;
  --color-warning-text-hover: #ffc53d;
  --color-warning-text: #faad14;
  --color-warning-text-active: #d48806;
  --color-info-bg: #e6f4ff;
  --color-info-bg-hover: #bae0ff;
  --color-info-border: #91caff;
  --color-info-border-hover: #69b1ff;
  --color-info-hover: #69b1ff;
  --color-info-active: #0958d9;
  --color-info-text-hover: #4096ff;
  --color-info-text: #1677ff;
  --color-info-text-active: #0958d9;
  --color-link-hover: #69b1ff;
  --color-link-active: #0958d9;
  --color-bg-mask: rgba(0, 0, 0, 0.45);
  --color-white: #fff;
  --font-size-sm: 12px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;
  --font-size-heading-1: 38px;
  --font-size-heading-2: 30px;
  --font-size-heading-3: 24px;
  --font-size-heading-4: 20px;
  --font-size-heading-5: 16px;
  --line-height: 1.5714285714285714;
  --line-height-lg: 1.5;
  --line-height-sm: 1.6666666666666667;
  --font-height: 22px;
  --font-height-lg: 24px;
  --font-height-sm: 20px;
  --line-height-heading-1: 1.2105263157894737;
  --line-height-heading-2: 1.2666666666666666;
  --line-height-heading-3: 1.3333333333333333;
  --line-height-heading-4: 1.4;
  --line-height-heading-5: 1.5;
  --control-height-sm: 24px;
  --control-height-xs: 16px;
  --control-height-lg: 40px;
  --motion-duration-fast: 0.1s;
  --motion-duration-mid: 0.2s;
  --motion-duration-slow: 0.3s;
  --line-width-bold: 2px;
  --border-radius-xs: 2px;
  --border-radius-sm: 4px;
  --border-radius-lg: 8px;
  --border-radius-outer: 4px;
  --color-fill-content: rgba(0, 0, 0, 0.06);
  --color-fill-content-hover: rgba(0, 0, 0, 0.15);
  --color-fill-alter: rgba(0, 0, 0, 0.02);
  --color-bg-container-disabled: rgba(0, 0, 0, 0.04);
  --color-border-bg: #ffffff;
  --color-split: rgba(5, 5, 5, 0.06);
  --color-text-placeholder: rgba(0, 0, 0, 0.25);
  --color-text-disabled: rgba(0, 0, 0, 0.25);
  --color-text-heading: rgba(0, 0, 0, 0.88);
  --color-text-label: rgba(0, 0, 0, 0.65);
  --color-text-description: rgba(0, 0, 0, 0.45);
  --color-text-light-solid: #fff;
  --color-highlight: #ff4d4f;
  --color-bg-text-hover: rgba(0, 0, 0, 0.06);
  --color-bg-text-active: rgba(0, 0, 0, 0.15);
  --color-icon: rgba(0, 0, 0, 0.45);
  --color-icon-hover: rgba(0, 0, 0, 0.88);
  --color-error-outline: rgba(255, 38, 5, 0.06);
  --color-warning-outline: rgba(255, 215, 5, 0.1);
  --font-size-icon: 12px;
  --line-width-focus: 3px;
  --control-outline-width: 2px;
  --control-interactive-size: 16px;
  --control-item-bg-hover: rgba(0, 0, 0, 0.04);
  --control-item-bg-active: #e6f4ff;
  --control-item-bg-active-hover: #bae0ff;
  --control-item-bg-active-disabled: rgba(0, 0, 0, 0.15);
  --control-tmp-outline: rgba(0, 0, 0, 0.02);
  --control-outline: rgba(5, 145, 255, 0.1);
  --font-weight-strong: 600;
  --opacity-loading: 0.65;
  --link-decoration: none;
  --link-hover-decoration: none;
  --link-focus-decoration: none;
  --control-padding-horizontal: 12px;
  --control-padding-horizontal-sm: 8px;
  --padding-xxs: 4px;
  --padding-xs: 8px;
  --padding-sm: 12px;
  --padding: 16px;
  --padding-md: 20px;
  --padding-lg: 24px;
  --padding-xl: 32px;
  --padding-content-horizontal-lg: 24px;
  --padding-content-vertical-lg: 16px;
  --padding-content-horizontal: 16px;
  --padding-content-vertical: 12px;
  --padding-content-horizontal-sm: 16px;
  --padding-content-vertical-sm: 8px;
  --margin-xxs: 4px;
  --margin-xs: 8px;
  --margin-sm: 12px;
  --margin: 16px;
  --margin-md: 20px;
  --margin-lg: 24px;
  --margin-xl: 32px;
  --margin-xxl: 48px;
  --box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  --box-shadow-secondary: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  --box-shadow-tertiary: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
  --box-shadow-popover-arrow: 2px 2px 5px rgba(0, 0, 0, 0.05);
  --box-shadow-card: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
  --box-shadow-drawer-right: -6px 0 16px 0 rgba(0, 0, 0, 0.08), -3px 0 6px -4px rgba(0, 0, 0, 0.12), -9px 0 28px 8px rgba(0, 0, 0, 0.05);
  --box-shadow-drawer-left: 6px 0 16px 0 rgba(0, 0, 0, 0.08), 3px 0 6px -4px rgba(0, 0, 0, 0.12), 9px 0 28px 8px rgba(0, 0, 0, 0.05);
  --box-shadow-drawer-up: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  --box-shadow-drawer-down: 0 -6px 16px 0 rgba(0, 0, 0, 0.08), 0 -3px 6px -4px rgba(0, 0, 0, 0.12), 0 -9px 28px 8px rgba(0, 0, 0, 0.05);
  --box-shadow-tabs-overflow-left: inset 10px 0 8px -8px rgba(0, 0, 0, 0.08);
  --box-shadow-tabs-overflow-right: inset -10px 0 8px -8px rgba(0, 0, 0, 0.08);
  --box-shadow-tabs-overflow-top: inset 0 10px 8px -8px rgba(0, 0, 0, 0.08);
  --box-shadow-tabs-overflow-bottom: inset 0 -10px 8px -8px rgba(0, 0, 0, 0.08);
}
```

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
