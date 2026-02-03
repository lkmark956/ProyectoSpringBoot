import { Outlet, NavLink } from 'react-router-dom'

/**
 * Layout principal con navegación
 * Usa fragmentos reutilizables (cumple criterio de Vista)
 */
function Layout() {
  const navLinks = [
    { to: '/', label: 'Inicio', icon: '🏠' },
    { to: '/planes', label: 'Planes', icon: '📋' },
    { to: '/usuarios', label: 'Usuarios', icon: '👥' },
    { to: '/suscripciones', label: 'Suscripciones', icon: '📝' },
    { to: '/facturas', label: 'Facturas', icon: '🧾' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary-500 to-secondary-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              🚀 SaaS Platform
            </h1>
            <nav className="flex space-x-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full font-medium transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-200 hover:bg-white/20'
                    }`
                  }
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2026 SaaS Platform - Proyecto Spring Boot + React
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Desarrollo de Interfaces - 2º Trimestre
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
