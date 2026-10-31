import React, { useState, useEffect } from 'react';
import { 
  Grid3X3, 
  Search, 
  Menu, 
  X, 
  ArrowUpRight,
  User,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onSearchClick: () => void;
  onListResourceClick: () => void;
  onSignInClick: () => void;
  activeSection: string;
  currentView?: 'home' | 'directory' | 'resource-detail' | 'dashboard';
  onNavigateHome?: () => void;
  onNavigateDirectory?: () => void;
  onNavigateDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchClick,
  onListResourceClick,
  onSignInClick,
  activeSection,
  currentView = 'home',
  onNavigateHome,
  onNavigateDirectory,
  onNavigateDashboard
}) => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateHome) onNavigateHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateDirectory) onNavigateDirectory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateDashboard) onNavigateDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (currentView !== 'home' && onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-1.5 py-0.2 bg-purple-100 text-purple-900 font-mono text-[9px] font-bold rounded">ADMIN</span>;
      case 'owner':
        return <span className="px-1.5 py-0.2 bg-forest-100 text-forest-900 font-mono text-[9px] font-bold rounded">OWNER</span>;
      default:
        return <span className="px-1.5 py-0.2 bg-blue-100 text-blue-900 font-mono text-[9px] font-bold rounded">BORROWER</span>;
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-ivory-100/95 backdrop-blur-md border-b border-ivory-300 shadow-sm py-3' 
            : 'bg-ivory-100/80 backdrop-blur-sm border-b border-ivory-300/60 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <button 
              onClick={handleHomeClick}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none text-left"
            >
              <div className="w-8 h-8 rounded bg-forest-900 text-accent-lime flex items-center justify-center font-bold transition-transform duration-200 group-hover:scale-105 shadow-sm">
                <Grid3X3 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-wider text-base text-forest-950 uppercase font-sans">
                  SHARE<span className="text-forest-700 font-semibold">GRID</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-charcoal-500 font-medium -mt-1 hidden sm:block">
                  Institutional Resource Exchange
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                onClick={handleHomeClick}
                className={`px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors rounded ${
                  currentView === 'home' && activeSection !== 'directory'
                    ? 'text-forest-900 font-bold bg-forest-50' 
                    : 'text-charcoal-700 hover:text-forest-900 hover:bg-ivory-200/70'
                }`}
              >
                Home
              </button>

              <button
                onClick={handleDirectoryClick}
                className={`px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors rounded flex items-center gap-1.5 ${
                  currentView === 'directory' || currentView === 'resource-detail'
                    ? 'text-forest-900 font-bold bg-forest-50 border border-forest-200' 
                    : 'text-charcoal-700 hover:text-forest-900 hover:bg-ivory-200/70'
                }`}
              >
                <span>Directory</span>
                <span className="px-1.5 py-0.2 bg-accent-lime text-forest-950 font-bold text-[10px] rounded">
                  Live
                </span>
              </button>

              <a
                href="#how-it-works"
                onClick={(e) => handleAnchorClick(e, '#how-it-works')}
                className="px-3 py-1.5 text-xs lg:text-sm font-medium text-charcoal-700 hover:text-forest-900 hover:bg-ivory-200/70 rounded transition-colors"
              >
                Protocol & Workflow
              </a>

              <a
                href="#benefits"
                onClick={(e) => handleAnchorClick(e, '#benefits')}
                className="px-3 py-1.5 text-xs lg:text-sm font-medium text-charcoal-700 hover:text-forest-900 hover:bg-ivory-200/70 rounded transition-colors"
              >
                Institutional Benefits
              </a>

              {user && (
                <button
                  onClick={handleDashboardClick}
                  className={`px-3 py-1.5 text-xs lg:text-sm font-semibold transition-colors rounded flex items-center gap-1.5 ${
                    currentView === 'dashboard'
                      ? 'text-forest-900 font-bold bg-forest-100 border border-forest-300'
                      : 'text-forest-900 hover:bg-forest-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-forest-700" />
                  <span>Dashboard</span>
                  {getRoleBadge(user.role)}
                </button>
              )}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={onSearchClick}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-charcoal-700 hover:text-forest-900 bg-ivory-200/80 hover:bg-ivory-200 rounded border border-ivory-300 transition-colors"
                title="Quick search (press /)"
              >
                <Search className="w-3.5 h-3.5 text-charcoal-500" />
                <span>Search</span>
                <kbd className="ml-1 px-1.5 py-0.5 text-[10px] bg-ivory-100 border border-ivory-400/60 rounded text-charcoal-500 font-mono">
                  /
                </kbd>
              </button>

              <button
                onClick={onListResourceClick}
                className="px-3.5 py-1.5 text-xs font-semibold text-forest-900 bg-transparent hover:bg-forest-50 border border-forest-800/30 rounded transition-colors"
              >
                List Facility or Tool
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-forest-950 bg-white hover:bg-ivory-50 border border-ivory-300 rounded shadow-xs transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-forest-900 text-ivory-50 flex items-center justify-center text-[10px]">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="truncate max-w-[120px]">{user.fullName.split(' ')[0]}</span>
                    {getRoleBadge(user.role)}
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-1.5 w-56 bg-white border border-ivory-300 rounded shadow-lg py-1.5 z-50 text-xs"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-ivory-200">
                        <span className="font-bold text-forest-950 block truncate">{user.fullName}</span>
                        <span className="text-[11px] text-charcoal-500 block truncate">{user.email}</span>
                        <span className="text-[10px] text-forest-800 font-mono block mt-0.5 uppercase font-semibold">
                          Role: {user.role} ({user.institution})
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          setUserDropdownOpen(false);
                          handleDashboardClick(e);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-forest-50 text-forest-950 flex items-center gap-2 font-medium"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-forest-700" />
                        <span>Open Role Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-800 flex items-center gap-2 font-medium border-t border-ivory-200"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onSignInClick}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-ivory-50 bg-forest-900 hover:bg-forest-800 rounded shadow-sm transition-all"
                >
                  <span>Institutional Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-accent-lime" />
                </button>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={onSearchClick}
                aria-label="Search"
                className="p-2 text-charcoal-700 hover:text-forest-900 hover:bg-ivory-200 rounded border border-ivory-300"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="p-2 text-charcoal-800 hover:text-forest-900 hover:bg-ivory-200 rounded border border-ivory-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-ivory-100 border-b border-ivory-300 px-4 pt-3 pb-6 shadow-lg">
            <div className="flex flex-col gap-1.5 mb-4">
              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleHomeClick(e);
                }}
                className={`text-left px-3 py-2 text-sm font-medium rounded ${
                  currentView === 'home' ? 'bg-forest-50 text-forest-900 font-bold' : 'text-charcoal-800 hover:bg-ivory-200'
                }`}
              >
                Home
              </button>

              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleDirectoryClick(e);
                }}
                className={`text-left px-3 py-2 text-sm font-medium rounded flex items-center justify-between ${
                  currentView === 'directory' ? 'bg-forest-50 text-forest-900 font-bold' : 'text-charcoal-800 hover:bg-ivory-200'
                }`}
              >
                <span>Resource Directory</span>
                <span className="px-1.5 py-0.2 bg-accent-lime text-forest-950 font-bold text-[10px] rounded">
                  Live
                </span>
              </button>

              {user && (
                <button
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleDashboardClick(e);
                  }}
                  className={`text-left px-3 py-2 text-sm font-semibold rounded flex items-center justify-between ${
                    currentView === 'dashboard' ? 'bg-forest-100 text-forest-900 font-bold' : 'text-forest-900 hover:bg-ivory-200'
                  }`}
                >
                  <span>My Role Dashboard</span>
                  {getRoleBadge(user.role)}
                </button>
              )}

              <a
                href="#how-it-works"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleAnchorClick(e, '#how-it-works');
                }}
                className="px-3 py-2 text-sm font-medium text-charcoal-800 hover:bg-ivory-200 rounded"
              >
                Protocol & Workflow
              </a>

              <a
                href="#benefits"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleAnchorClick(e, '#benefits');
                }}
                className="px-3 py-2 text-sm font-medium text-charcoal-800 hover:bg-ivory-200 rounded"
              >
                Institutional Benefits
              </a>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-ivory-300">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-1.5 bg-ivory-200/60 rounded text-xs">
                    <span className="font-bold text-forest-950 block">{user.fullName}</span>
                    <span className="text-charcoal-600 block text-[11px]">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2 px-4 text-xs font-semibold text-rose-700 border border-rose-300 rounded text-center"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onListResourceClick();
                    }}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-forest-900 border border-forest-800/40 rounded text-center bg-ivory-50"
                  >
                    List Facility or Tool
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignInClick();
                    }}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-ivory-50 bg-forest-900 hover:bg-forest-800 rounded text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Institutional Portal</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-accent-lime" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
