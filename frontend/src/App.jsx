import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import PlanesPage from './pages/PlanesPage';
import FacturasPage from './pages/FacturasPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (data) => {
    setUserData(data);
    const admin = data.email?.toLowerCase() === 'admin@admin.com';
    setIsAdmin(admin);
    setCurrentPage(admin ? 'admin' : 'planes');
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentPage('login');
    setIsAdmin(false);
  };

  const handleNavigate = (page) => {
    setRefreshKey(k => k + 1);
    setCurrentPage(page);
  };

  const renderContent = () => {
    if (!userData && currentPage !== 'login') {
      return <PlaceholderPage title="Bienvenido" message="Inicia sesión para continuar" />;
    }

    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'planes':
        return <PlanesPage key={`planes-${refreshKey}`} userData={userData} />;
      case 'facturas':
        return <FacturasPage key={`facturas-${refreshKey}`} userData={userData} />;
      case 'admin':
        return <AdminPage key={`admin-${refreshKey}`} />;
      default:
        return <PlaceholderPage title="404" message="Página no encontrada" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={userData} 
        onLogout={handleLogout} 
        onNavigate={handleNavigate}
        currentPage={currentPage}
        isAdmin={isAdmin}
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
}

const PlaceholderPage = ({ title, message }) => (
  <div className="min-h-[60vh] flex items-center justify-center pt-16">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
      <p className="text-gray-500">{message}</p>
    </div>
  </div>
);

export default App;
