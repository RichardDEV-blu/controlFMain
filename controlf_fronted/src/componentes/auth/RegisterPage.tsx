import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });
    if (!response.ok) {
      setError('No se pudo crear la cuenta');
      return;
    }
    const data = await response.json();
    login(data.token, {
      id: data.user?.id ?? 0,
      email: data.user?.email ?? email,
      nombre: data.user?.nombre ?? nombre,
      rol: data.user?.rol ?? 'CIUDADANO',
    });
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-black text-primary-navy">Crear cuenta</h2>
      <p className="mt-2 text-sm text-slate-500">Regístrate como ciudadano para participar en el debate público.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" placeholder="Nombre completo" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="correo@dominio.com" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña (mín. 8 caracteres)" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        <button type="submit" className="w-full rounded-xl bg-accent-blue px-4 py-3 font-bold text-white">Registrarme</button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        ¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-accent-blue">Iniciar sesión</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
