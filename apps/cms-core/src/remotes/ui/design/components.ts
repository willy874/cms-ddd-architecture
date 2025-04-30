import { reactive, watch } from 'vue'

export interface ComponentsToken {}

export const defaultComponentsToken = reactive({}) as ComponentsToken

export const onComponentTokenChange = (cb: (value: ComponentsToken) => void): (() => void) => {
  return watch(defaultComponentsToken, cb)
}
