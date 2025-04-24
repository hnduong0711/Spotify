import { Outlet } from 'react-router-dom'
import ProfileSidebar from '../ProfileManagement/ProfileSidebar'
import { motion } from 'framer-motion'

function ProfileLayout() {
  return (
    <div className="min-h-screen bg-[#121212] flex">
      {/* Sidebar quản lý */}
      <motion.div
        className="w-64 bg-[#1a1a1a] p-4 flex flex-col border-r border-gray-700"
        initial={{ width: 64 }}
        animate={{ width: 256 }}
      >
        <ProfileSidebar />
      </motion.div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default ProfileLayout