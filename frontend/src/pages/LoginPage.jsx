import { useState } from 'react';
import { authApi } from '../services/api';

const PAISES = [
  { codigo: 'ES', nombre: 'España' },
  { codigo: 'MX', nombre: 'México' },
  { codigo: 'CO', nombre: 'Colombia' },
  { codigo: 'AR', nombre: 'Argentina' },
  { codigo: 'CL', nombre: 'Chile' },
  { codigo: 'PE', nombre: 'Perú' },
  { codigo: 'US', nombre: 'USA' },
  { codigo: 'DE', nombre: 'Alemania' },
  { codigo: 'FR', nombre: 'Francia' },
  { codigo: 'IT', nombre: 'Italia' },
  { codigo: 'PT', nombre: 'Portugal' },
  { codigo: 'GB', nombre: 'Reino Unido' },
];

const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    pais: 'ES',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    empresa: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const user = await authApi.login(form.email, form.password);
        onLogin(user);
      } else {
        const user = await authApi.register({
          email: form.email,
          password: form.password,
          perfil: {
            nombre: form.nombre,
            apellidos: form.apellidos,
            telefono: form.telefono,
            pais: PAISES.find(p => p.codigo === form.pais)?.nombre || form.pais,
            direccion: form.direccion,
            ciudad: form.ciudad,
            codigoPostal: form.codigoPostal,
            empresa: form.empresa
          }
        });
        onLogin(user);
      }
    } catch {
      setError(isLogin ? 'Email o contraseña incorrectos' : 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin ? 'Accede a tu cuenta' : 'Regístrate para empezar'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          {!isLogin && (
            <>
              {/* Nombre y Apellidos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Juan"
                    value={form.nombre}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    placeholder="García López"
                    value={form.apellidos}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Teléfono y País */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="+34 612 345 678"
                    value={form.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">País *</label>
                  <select
                    name="pais"
                    value={form.pais}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  >
                    {PAISES.map(p => (
                      <option key={p.codigo} value={p.codigo}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Calle Principal 123"
                  value={form.direccion}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Ciudad y Código Postal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ciudad</label>
                  <input
                    type="text"
                    name="ciudad"
                    placeholder="Madrid"
                    value={form.ciudad}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Código Postal</label>
                  <input
                    type="text"
                    name="codigoPostal"
                    placeholder="28001"
                    value={form.codigoPostal}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Empresa (opcional) */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Empresa (opcional)</label>
                <input
                  type="text"
                  name="empresa"
                  placeholder="Mi Empresa S.L."
                  value={form.empresa}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <hr className="my-2 border-gray-100" />
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña *</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm disabled:opacity-50 transition shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cargando...
              </span>
            ) : isLogin ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            <strong>Demo Usuario:</strong> carlos@ejemplo.es / password123<br />
            <strong>Demo Admin:</strong> admin@admin.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
