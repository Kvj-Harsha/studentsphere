import React, { ReactNode } from 'react';
import PrivateRoute from '../components/PrivateRoute';
import Stnav from '../components/Stnav';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <PrivateRoute>
      <div>
        <Stnav />
        {children}
      </div>
    </PrivateRoute>
  );
};

export default Layout;
