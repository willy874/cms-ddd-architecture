// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'

function Form({ ...props }: React.ComponentProps<'form'>) {
  return (
    <form {...props} />
  )
}

export default Form

declare module '@/modules/core' {
  export interface CustomComponentDict {
    Form: typeof Form
  }
}
