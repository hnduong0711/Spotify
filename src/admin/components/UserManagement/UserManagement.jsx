import React, { useState } from 'react';
import Pagination from '../Pagination/Pagination';

// Component quản lý người dùng
const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Người Dùng 1', role: 'User', isLocked: false },
    { id: 2, name: 'Người Dùng 2', role: 'Artist', isLocked: true },
  ]);
  const [searchUser, setSearchUser] = useState('');
  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 5;

  const toggleUserLock = (id, isLocked) => {
    const action = isLocked ? 'mở khóa' : 'khóa';
    if (window.confirm(`Bạn có chắc muốn ${action} người dùng này?`)) {
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, isLocked: !isLocked } : user
        )
      );
    }
  };

  const updateUserRole = (id, role) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, role } : user))
    );
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * usersPerPage,
    userPage * usersPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full overflow-y-auto">
      <h2 className="text-4xl mb-4 text-spotify-base text-center font-semibold">Quản Lý Người Dùng</h2>
      <input
        type="text"
        placeholder="Tìm kiếm người dùng..."
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
        className="border rounded px-3 py-2 w-1/3 mb-4"
      />
      <table className="w-full border-collapse text-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Vai Trò</th>
            <th className="border p-2">Trạng Thái</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="User">Người Dùng</option>
                  <option value="Artist">Nghệ Sĩ</option>
                </select>
              </td>
              <td className="border p-2">
                {user.isLocked ? 'Khóa' : 'Hoạt Động'}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => toggleUserLock(user.id, user.isLocked)}
                  className={`px-2 py-1 rounded text-white ${
                    user.isLocked
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {user.isLocked ? 'Mở Khóa' : 'Khóa'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={userPage}
        totalPages={totalUserPages}
        onPageChange={setUserPage}
      />
    </div>
  );
};

export default UserManagement;