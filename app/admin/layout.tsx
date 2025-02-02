import React, { ReactNode } from 'react';
import PrivateRoute from '../components/PrivateRoute';
import Adnav from '../components/Adnav';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <PrivateRoute>
      <div>
        <Adnav />
        {children}
      </div>
    </PrivateRoute>
  );
};

export default Layout;
