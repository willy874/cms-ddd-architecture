import cn from 'classnames'
import { Button } from '@/libs/components'
import { MenuIcon } from '@/remotes/layout/assets'
import { useLeftBar } from '@/remotes/layout/contexts/sideBar'
import MainBrand from './MainBrand'
import { useEffect, useState } from 'react'

function LeftAside() {
  const [isHidden, setIsHidden] = useState(true)
  const leftBarState = useLeftBar()
  const onMenuBtnClick = () => {
    leftBarState.show = !leftBarState.show
  }
  const {
    show,
    width,
    component: SideBarComponent,
  } = leftBarState

  useEffect(() => {
    Promise.resolve().then(() => {
      setIsHidden(false)
    })
  }, [])

  return (
    <div
      className={cn('relative will-change-auto transition-all shrink-0', {
        'hidden': isHidden,
        'w-0': !show,
        'w-[var(--right-bar-width)]': show,
      })}
      style={{
        '--right-bar-width': typeof width === 'number' ? `${width}px` : width,
      } as any}
    >
      <aside
        className={cn('absolute inset-0 flex flex-col shrink-0 w-[var(--right-bar-width)] transition-transform border-r border-[--color-border]  bg-[--color-bg-layout]', {
          'translate-x-[-100%] shadow-none': !show,
          'translate-x-0 shadow-[--box-shadow-drawer-left]': show,
        })}
      >
        <div className="shrink-0 p-2 flex gap-4">
          <div className="shrink-0">
            <Button variant="text" onClick={onMenuBtnClick}>
              <MenuIcon className="text-2xl" />
            </Button>
          </div>
          <div className="grow-1 overflow-hidden">
            <MainBrand />
          </div>
        </div>
        <div className="grow-1 relative">
          <div className="absolute inset-0 p-2">
            <SideBarComponent />
          </div>
        </div>
        <div className="shrink-0"></div>
      </aside>
    </div>
  )
}

export default LeftAside
