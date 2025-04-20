import { useRightBar } from './rightBar'
import { MenuIcon } from './assets'
import { Button } from '@/libs/components'

function Header() {
  const [state, setRightBarState] = useRightBar()
  const onMenuBtnClick = () => {
    setRightBarState({ show: !state.show })
  }
  return (
    <header className="flex shrink-0">
      {!state.show && (
        <Button icon outline onClick={onMenuBtnClick}>
          <MenuIcon className="text-2xl" />
        </Button>
      )}
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
