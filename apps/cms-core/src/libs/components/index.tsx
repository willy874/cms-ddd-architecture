import { getCoreContext } from '../CoreContext/core'
import { CustomComponentDict } from '@/modules/core'

export const NotFound = (props: React.ComponentProps<CustomComponentDict['NotFound']>) => {
  const Component = getCoreContext().componentRegistry.get('NotFound')
  return <Component {...props} />
}

export const Button = (props: React.ComponentProps<CustomComponentDict['Button']>) => {
  const Component = getCoreContext().componentRegistry.get('Button')
  return <Component {...props} />
}

export const ConfigProvider = (props: React.ComponentProps<CustomComponentDict['ConfigProvider']>) => {
  const Component = getCoreContext().componentRegistry.get('ConfigProvider')
  return <Component {...props} />
}

export const Form = (props: React.ComponentProps<CustomComponentDict['Form']>) => {
  const Component = getCoreContext().componentRegistry.get('Form')
  return <Component {...props} />
}

export const TextField = (props: React.ComponentProps<CustomComponentDict['TextField']>) => {
  const Component = getCoreContext().componentRegistry.get('TextField')
  return <Component {...props} />
}

export const Teleport = (props: React.ComponentProps<CustomComponentDict['Teleport']>) => {
  const Component = getCoreContext().componentRegistry.get('Teleport')
  return <Component {...props} />
}
