import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PlanesPage from './pages/PlanesPage'
import UsuariosPage from './pages/UsuariosPage'
import SuscripcionesPage from './pages/SuscripcionesPage'
import FacturasPage from './pages/FacturasPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="planes" element={<PlanesPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="suscripciones" element={<SuscripcionesPage />} />
        <Route path="facturas" element={<FacturasPage />} />
      </Route>
    </Routes>
  )
}

export default App
