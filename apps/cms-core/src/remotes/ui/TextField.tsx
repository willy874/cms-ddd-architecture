function TextField({ ...props }: React.ComponentProps<'input'>) {
  return (
    <input {...props} />
  )
}

export default TextField

declare module '@/modules/core' {
  export interface CustomComponentDict {
    TextField: typeof TextField
  }
}
