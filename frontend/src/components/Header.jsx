const Header = ({ user, onLogout, onNavigate, currentPage, isAdmin }) => {
  const NavLink = ({ page, children }) => (
    <button
      onClick={() => onNavigate(page)}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        currentPage === page
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button 
            onClick={() => onNavigate(user ? 'planes' : 'login')} 
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-gray-900">TechSaas</span>
          </button>

          {/* Nav */}
          {user && (
            <div className="flex items-center gap-1">
              {isAdmin ? (
                <NavLink page="admin">Admin</NavLink>
              ) : (
                <>
                  <NavLink page="planes">Planes</NavLink>
                  <NavLink page="facturas">Facturas</NavLink>
                </>
              )}
            </div>
          )}

          {/* Right */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
                <button
                  onClick={onLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
