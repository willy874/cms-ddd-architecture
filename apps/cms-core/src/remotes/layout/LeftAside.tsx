import cn from 'classnames'
import { useRightBar, setRightBarState } from './rightBar'
import { Button } from '@/libs/components'
import { MenuIcon } from './assets'

function LeftAside() {
  const [rightBarState] = useRightBar()
  const onMenuBtnClick = () => {
    setRightBarState({ show: !rightBarState.show })
  }
  return (
    <div
      className={cn('relative will-change-auto transition-all shrink-0', {
        'w-0': !rightBarState.show,
        'w-[var(--right-bar-width)]': rightBarState.show,
      })}
      style={{
        '--right-bar-width': typeof rightBarState.width === 'number' ? `${rightBarState.width}px` : rightBarState.width,
      } as any}
    >
      <aside
        className={cn('absolute inset-0 flex flex-col shrink-0 w-[var(--right-bar-width)] transition-transform border-r border-[--color-border]  bg-[--color-bg-layout]', {
          'translate-x-[-100%] shadow-none': !rightBarState.show,
          'translate-x-0 shadow-[--box-shadow-drawer-left]': rightBarState.show,
        })}
      >
        <div>
          <Button icon outline onClick={onMenuBtnClick}>
            <MenuIcon className="text-2xl" />
          </Button>
          <rightBarState.component />
        </div>
      </aside>
    </div>
  )
}

export default LeftAside
