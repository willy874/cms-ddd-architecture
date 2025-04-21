import { useEffect, useState } from 'react'
import { useCoreContext } from './useCoreContext'

export function useTranslate() {
  const { locale } = useCoreContext()
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
