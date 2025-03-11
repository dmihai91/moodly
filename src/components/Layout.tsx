import React from 'react';
import { Layout as LayoutIcon, Home, User, BarChart2, BookOpen, LogOut, Menu, X, Settings, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationsPanel } from '@/components/NotificationsPanel';
import { supabase } from '@/utils/supabase';
import { MoodlyIcon } from '@/utils/constants';
import type { Notification } from '@/types';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

type LayoutProps = {
  children: React.ReactNode;
  onSignOut: () => void;
};

function NavItem({ to, icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-primary-50/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 backdrop-blur-sm'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 hover:backdrop-blur-sm'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-light">{label}</span>
    </Link>
  );
}

export function Layout({ children, onSignOut }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [fullName, setFullName] = React.useState<string>('');

  const fetchNotifications = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setNotifications(data);
    }
  };

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profile?.full_name) {
          setFullName(profile.full_name);
        }
      }
    };
    getUser();
    fetchNotifications();
  }, [user]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const markNotificationAsRead = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleProfileClick = () => {
    navigate('/profile');
    closeMobileMenu();
  };

  const getDisplayName = () => {
    if (fullName) return fullName;
    if (user?.email) return user.email.split('@')[0];
    return 'Loading...';
  };

  const getDisplayInitial = () => {
    if (fullName) return fullName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return '?';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <div
        className={`
          fixed inset-y-0 left-0 z-40
          w-[280px] sm:w-[320px] lg:w-72 xl:w-80
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-md
          border-r border-gray-200/50 dark:border-gray-700/50
          transition-all duration-300 ease-in-out transform
          lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <MoodlyIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Moodly
                </span>
              </div>
              <ThemeToggle />
            </div>

            <nav className="space-y-1">
              <NavItem
                to="/"
                icon={Home}
                label="Dashboard"
                active={location.pathname === '/'}
                onClick={closeMobileMenu}
              />
              <NavItem
                to="/profile"
                icon={User}
                label="Profile"
                active={location.pathname === '/profile'}
                onClick={closeMobileMenu}
              />
              <NavItem
                to="/stats"
                icon={BarChart2}
                label="Statistics"
                active={location.pathname === '/stats'}
                onClick={closeMobileMenu}
              />
              <NavItem
                to="/resources"
                icon={BookOpen}
                label="Resources"
                active={location.pathname === '/resources'}
                onClick={closeMobileMenu}
              />
            </nav>
          </div>

          {showNotifications && (
            <NotificationsPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkAsRead={markNotificationAsRead}
              onNotificationsUpdate={fetchNotifications}
            />
          )}

          <div className="mt-auto p-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div 
              className="flex items-center gap-4 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full animate-pulse group-hover:animate-none"></div>
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg transform transition-transform group-hover:scale-105">
                  {getDisplayInitial()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {getDisplayName()}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="relative p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                  }}
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 text-white text-xs flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/profile');
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                onSignOut();
                closeMobileMenu();
              }}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg
                text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200
                hover:bg-gray-50/50 dark:hover:bg-gray-700/50 backdrop-blur-sm
                transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-light">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 lg:ml-72 xl:ml-80">
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-600/20 dark:bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
}