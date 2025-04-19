import cn from 'classnames'
import { getRightBarState, setRightBarState } from './rightBar'
import { useComputed } from '@/libs/hooks/useComputed'

function LeftAside() {
  const { show, width, component: RightBarComponent } = useComputed(() => getRightBarState())
  const onMenuBtnClick = () => {
    setRightBarState({ show: !show })
  }
  return (
    <div
      className={cn('relative will-change-auto transition-all', {
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
        <div>
          <button onClick={onMenuBtnClick}>Menu</button>
          <RightBarComponent />
        </div>
      </aside>
    </div>
  )
}

export default LeftAside
