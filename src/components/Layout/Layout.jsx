import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Player from '../Player/Player'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

function Layout() {
  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      <Header />
      <div className="flex flex-1 overflow-hidden pb-20">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#1a1a1a] p-6 ml-[10px] rounded-lg">
          <Outlet />
          <Footer />
        </main>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Player />
      </div>
    </div>
  )
}

export default Layout