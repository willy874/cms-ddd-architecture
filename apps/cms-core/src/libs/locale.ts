import { useEffect, useState } from 'react'
import { getCoreContext } from './CoreContext/core'

export function useTranslate() {
  const { locale } = getCoreContext()
  const [, update] = useState({})
  useEffect(() => {
    locale.on('added', () => {
      update({})
    })
    locale.on('languageChanged', () => {
      update({})
    })
  }, [locale])

  return locale.t
}
