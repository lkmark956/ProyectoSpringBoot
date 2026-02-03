import { Link } from 'react-router-dom'

/**
 * Página de inicio - Dashboard
 */
function Home() {
  const features = [
    {
      title: 'Gestión de Planes',
      description: 'Administra los planes Basic, Premium y Enterprise',
      icon: '📋',
      link: '/planes',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Usuarios',
      description: 'Gestiona los usuarios de la plataforma',
      icon: '👥',
      link: '/usuarios',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Suscripciones',
      description: 'Controla las suscripciones activas, canceladas y morosas',
      icon: '📝',
      link: '/suscripciones',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Facturas',
      description: 'Visualiza y gestiona las facturas generadas',
      icon: '🧾',
      link: '/facturas',
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenido a SaaS Platform
        </h1>
        <p className="text-xl text-gray-200 mb-6">
          Plataforma de gestión de suscripciones con Spring Boot y React
        </p>
        <div className="flex gap-4">
          <Link
            to="/planes"
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Ver Planes
          </Link>
          <a
            href="http://localhost:8080/h2-console"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all"
          >
            H2 Console
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.title}
            to={feature.link}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all"
          >
            <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📚 Tecnologías Utilizadas
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-primary-500 mb-2">Backend</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Spring Boot 3.2.2</li>
              <li>• Spring Data JPA + Hibernate</li>
              <li>• Hibernate Envers (Auditoría)</li>
              <li>• H2 Database</li>
              <li>• Lombok</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-primary-500 mb-2">Frontend</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• React 18 + Vite</li>
              <li>• TailwindCSS</li>
              <li>• React Router DOM</li>
              <li>• Fetch API</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
