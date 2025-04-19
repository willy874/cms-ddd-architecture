import { useComputed } from '@/libs/hooks/useComputed'
import { setRightBarState, getRightBarState } from './rightBar'

function Header() {
  const state = useComputed(() => getRightBarState())
  const onMenuBtnClick = () => {
    setRightBarState({ show: !state.show })
  }
  return (
    <header className="flex shrink-0">
      {!state.show && <button onClick={onMenuBtnClick}>Menu</button>}
      <div className="flex flex-col shrink-0 py-1 px-4 text-2xl font-semibold">
        LOGO
      </div>
      <div className="grow-1">
      </div>
      <div className="flex flex-col shrink-0 py-1 px-4 text-2xl font-semibold">
        USER
      </div>
    </header>
  )
}

export default Header
