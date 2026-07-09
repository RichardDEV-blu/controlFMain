import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setError('Credenciales inválidas');
      return;
    }
    const data = await response.json();
    login(data.token, {
      id: data.user?.id ?? 0,
      email: data.user?.email ?? email,
      nombre: data.user?.nombre ?? email,
      rol: data.user?.rol ?? 'CIUDADANO',
    });
    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-black text-primary-navy">Iniciar sesión</h2>
      <p className="mt-2 text-sm text-slate-500">Accede con tu cuenta para comentar, calificar y administrar el sistema.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="correo@dominio.com" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        <button type="submit" className="w-full rounded-xl bg-primary-navy px-4 py-3 font-bold text-white">Entrar</button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        ¿No tienes cuenta? <Link to="/registro" className="font-semibold text-accent-blue">Registrarse</Link>
      </p>
    </div>
  );
};

export default LoginPage;
