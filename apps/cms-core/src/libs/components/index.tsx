import { getCoreContext } from '../CoreContext/core'
import { CustomComponentDict } from '@/modules/core'

export const NotFound = ((props) => {
  const Component = getCoreContext().componentRegistry.get('NotFound')
  return <Component {...props} />
}) as CustomComponentDict['NotFound']

export const Button = ((props) => {
  const Component = getCoreContext().componentRegistry.get('Button')
  return <Component {...props} />
}) as CustomComponentDict['Button']

export const ConfigProvider = ((props) => {
  const Component = getCoreContext().componentRegistry.get('ConfigProvider')
  return <Component {...props} />
}) as CustomComponentDict['ConfigProvider']

export const Form = ((props) => {
  const Component = getCoreContext().componentRegistry.get('Form')
  return <Component {...props} />
}) as CustomComponentDict['Form']

export const TextField = ((props) => {
  const Component = getCoreContext().componentRegistry.get('TextField')
  return <Component {...props} />
}) as CustomComponentDict['TextField']

export const Teleport = ((props) => {
  const Component = getCoreContext().componentRegistry.get('Teleport')
  return <Component {...props} />
}) as CustomComponentDict['Teleport']

export const Spin = ((props) => {
  const Component = getCoreContext().componentRegistry.get('Spin')
  return <Component {...props} />
}) as CustomComponentDict['Spin']

export const Input = ((props) => {
  const Component = getCoreContext().componentRegistry.get('Input')
  return <Component {...props} />
}) as CustomComponentDict['Input']
