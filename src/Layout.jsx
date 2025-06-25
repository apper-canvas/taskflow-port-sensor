import React, { useState, useContext } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';
import { AuthContext } from './App';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <button
      onClick={logout}
      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 mt-4 border-t border-surface-200 pt-4"
    >
      <ApperIcon name="LogOut" className="w-5 h-5 mr-3" />
      Logout
    </button>
  );
};
const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 lg:w-64 bg-surface-50 border-r border-surface-200 z-40">
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-surface-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-heading font-semibold text-surface-900">TaskFlow</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                {route.label}
</NavLink>
            ))}
            
            {/* Logout Button */}
            <LogoutButton />
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-surface-200 z-50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-heading font-semibold text-surface-900">TaskFlow</h1>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={toggleMobileMenu}
              />
              <motion.nav
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 w-64 h-full bg-surface-50 border-r border-surface-200 z-50 lg:hidden"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center px-6 py-4 border-b border-surface-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
                      </div>
                      <h1 className="ml-3 text-xl font-heading font-semibold text-surface-900">TaskFlow</h1>
                    </div>
                  </div>

                  <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={toggleMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                        {route.label}
</NavLink>
                    ))}
                    
                    {/* Mobile Logout Button */}
                    <LogoutButton />
                  </div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;