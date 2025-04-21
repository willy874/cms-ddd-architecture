import { Button } from '@/libs/components'
import { MenuIcon } from '@/remotes/layout/assets'
import { useLeftBar } from '@/remotes/layout/contexts/sideBar'
import MainBrand from './MainBrand'

function Header() {
  const leftBarState = useLeftBar()
  const onMenuBtnClick = () => {
    leftBarState.show = !leftBarState.show
  }
  return (
    <header className="flex shrink-0 gap-2 items-center px-2">
      {!leftBarState.show && (
        <div className="shrink-0 py-2 flex items-center gap-4">
          <div className="shrink-0">
            <Button variant="text" onClick={onMenuBtnClick}>
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
