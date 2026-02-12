import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MiPerfilPage from './pages/MiPerfilPage'
import MisFacturasPage from './pages/MisFacturasPage'
import AdminPanelPage from './pages/AdminPanelPage'

function App() {
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (data) => {
    setUserData(data);
    // Verificar si es admin (por email o rol)
    const adminEmails = ['admin@admin.com', 'admin@ejemplo.com'];
    setIsAdmin(adminEmails.includes(data.email?.toLowerCase()));
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentPage('dashboard');
    setIsAdmin(false);
  };

  // Si no hay usuario logueado, mostrar Login
  if (!userData) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Navegación para Usuario Normal
  const UserNavBar = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6">
            <span className="font-bold text-blue-600">Mi Cuenta</span>
            <button
              onClick={() => setCurrentPage('perfil')}
              className={`text-sm font-medium transition-colors ${currentPage === 'perfil' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Mi Perfil
            </button>
            <button
              onClick={() => setCurrentPage('mis-facturas')}
              className={`text-sm font-medium transition-colors ${currentPage === 'mis-facturas' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Mis Facturas
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{userData.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Navegación para Admin
  const AdminNavBar = () => (
    <nav className="bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6">
            <span className="font-bold text-white">Admin Panel</span>
            <button
              onClick={() => setCurrentPage('admin')}
              className={`text-sm font-medium transition-colors ${currentPage === 'admin' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            >
              Gestión
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`text-sm font-medium transition-colors ${currentPage === 'dashboard' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            >
              Dashboard
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">ADMIN</span>
            <span className="text-sm text-gray-300">{userData.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Renderizar según tipo de usuario
  if (isAdmin) {
    return (
      <>
        <AdminNavBar />
        {currentPage === 'admin' && <AdminPanelPage />}
        {currentPage === 'dashboard' && <DashboardPage userData={userData} />}
      </>
    );
  }

  // Usuario normal
  return (
    <>
      <UserNavBar />
      {currentPage === 'perfil' && <MiPerfilPage userData={userData} />}
      {currentPage === 'mis-facturas' && <MisFacturasPage userData={userData} />}
      {currentPage === 'dashboard' && <DashboardPage userData={userData} />}
    </>
  );
}

export default App
