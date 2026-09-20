import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Layers, 
  FolderLock, 
  CreditCard, 
  UserCircle, 
  Users,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const BottomNav = () => {
  const { user } = useAuth();

  const isGuardian = user?.role === 'guardian';
  const isAdmin = user?.role === 'mota_admin';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-lg px-2 py-1 sm:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg transition text-[11px] font-medium ${
              isActive ? 'text-gov-blue font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-gov-blue' : ''}`} />
              <span>Home</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/schemes"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg transition text-[11px] font-medium ${
              isActive ? 'text-gov-blue font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Layers className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-gov-blue' : ''}`} />
              <span>Schemes</span>
            </>
          )}
        </NavLink>

        {isGuardian ? (
          <NavLink
            to="/guardian"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 rounded-lg transition text-[11px] font-medium ${
                isActive ? 'text-gov-blue font-bold' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Users className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-gov-blue' : ''}`} />
                <span>Wards</span>
              </>
            )}
          </NavLink>
        ) : (
          <NavLink
            to="/wallet"
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 rounded-lg transition text-[11px] font-medium ${
                isActive ? 'text-gov-blue font-bold' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <FolderLock className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-gov-blue' : ''}`} />
                <span>Wallet</span>
              </>
            )}
          </NavLink>
        )}

        <NavLink
          to="/payments"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg transition text-[11px] font-medium ${
              isActive ? 'text-gov-blue font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <CreditCard className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-gov-blue' : ''}`} />
              <span>DBT</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg transition text-[11px] font-medium ${
              isActive ? 'text-gov-blue font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <UserCircle className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-gov-blue' : ''}`} />
              <span>Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
