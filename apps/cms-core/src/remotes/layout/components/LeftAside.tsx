import cn from 'classnames'
import { useLeftBar } from '../contexts/leftBar'
import { Button } from '@/libs/components'
import { MenuIcon } from '../assets'
import MainBrand from './MainBrand'

function LeftAside() {
  const [leftBarState, setLeftBarState] = useLeftBar()
  const onMenuBtnClick = () => {
    setLeftBarState({ show: !leftBarState.show })
  }
  const SideBarComponent = leftBarState.component
  return (
    <div
      className={cn('relative will-change-auto transition-all shrink-0', {
        'w-0': !leftBarState.show,
        'w-[var(--right-bar-width)]': leftBarState.show,
      })}
      style={{
        '--right-bar-width': typeof leftBarState.width === 'number' ? `${leftBarState.width}px` : leftBarState.width,
      } as any}
    >
      <aside
        className={cn('absolute inset-0 flex flex-col shrink-0 w-[var(--right-bar-width)] transition-transform border-r border-[--color-border]  bg-[--color-bg-layout]', {
          'translate-x-[-100%] shadow-none': !leftBarState.show,
          'translate-x-0 shadow-[--box-shadow-drawer-left]': leftBarState.show,
        })}
      >
        <div className="shrink-0 p-2 flex gap-4">
          <div className="shrink-0">
            <Button icon outline onClick={onMenuBtnClick}>
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
