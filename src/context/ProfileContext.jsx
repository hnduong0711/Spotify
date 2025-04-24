import { createContext, useState } from 'react'

// Tạo UserContext
const UserContext = createContext()

// Provider để quản lý currentUser
function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    image_url: 'https://via.placeholder.com/150',
    role_id: 2, // 1: "User", 2: "Artist"
  })

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }