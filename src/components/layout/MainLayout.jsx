import React from 'react';
import { Outlet } from 'react-router-dom';
import UnicornBackground from '../common/UnicornBackground';

const MainLayout = () => {
    return (
        <>
            <UnicornBackground />
            <Outlet />
        </>
    );
};

export default MainLayout;
