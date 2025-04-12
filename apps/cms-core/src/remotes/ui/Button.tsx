interface ButtonProps extends React.ComponentProps<'button'> {
  loading?: boolean
}

function Button({ loading, children, ...props }: ButtonProps) {
  return (
    <button {...props}>
      {loading
        ? (
            <span className="animate-spin">Loading...</span>
          )
        : (
            children
          )}
    </button>
  )
}

export default Button

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Button: typeof Button
  }
}
