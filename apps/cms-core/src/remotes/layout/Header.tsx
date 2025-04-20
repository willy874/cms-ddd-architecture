import { Button } from '@/libs/components'
import { useLeftBar } from './leftBar'
import { MenuIcon } from './assets'
import MainBrand from './MainBrand'

function Header() {
  const [state, setLeftBarState] = useLeftBar()
  const onMenuBtnClick = () => {
    setLeftBarState({ show: !state.show })
  }
  return (
    <header className="flex shrink-0 gap-2 items-center px-2">
      {!state.show && (
        <div className="shrink-0 py-2 flex items-center gap-4">
          <div className="shrink-0">
            <Button icon outline onClick={onMenuBtnClick}>
              <MenuIcon className="text-2xl" />
            </Button>
          </div>
          <div className="grow-1 overflow-hidden">
            <MainBrand />
          </div>
        </div>
      )}
      <div className="grow-1">
      </div>
      <div className="flex flex-col shrink-0 py-2 text-2xl font-semibold">
        USER
      </div>
    </header>
  )
}

export default Header
