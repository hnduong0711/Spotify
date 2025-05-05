import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

// Layout chính với sidebar và outlet
const AdminLayout = () => {
    const isAuthenticated = !!localStorage.getItem('user');

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;