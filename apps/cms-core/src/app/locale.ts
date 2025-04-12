import { Language, LocaleNs } from '@/constants/locale'
import { CoreContextPlugin } from '@/libs/CoreContext'
import i18next from 'i18next'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    context.locale = i18next
    return {
      name: 'cms_core/locale',
      onInit() {
        i18next.init({
          lng: Language.EN_US,
          ns: [LocaleNs.DEFAULT],
          resources: {
            [Language.EN_US]: {
              [LocaleNs.DEFAULT]: {
                key: 'hello world',
              },
            },
          },
        })
      },
    }
  }
}

declare module '@/libs/CoreContext' {
  export interface CoreContext {
    locale: typeof i18next
  }
}
