import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface PoliticoItem {
  id: string;
  label: string;
}

interface ComparacionPolitico {
  id: string;
  nombre: string;
  organizacion: string | null;
  fotoUrl: string | null;
  totalVotos: number;
  votosFavor: number;
  votosContra: number;
  votosAbstencion: number;
  asistencias: number;
  inasistencias: number;
  porcentajeAsistencia: number;
  porcentajeCoherencia: number;
}

interface ComparacionLey {
  leyId: string;
  leyTitulo: string;
  votos: Record<string, string>;
  coinciden: boolean;
}

interface ComparacionVotos {
  politicos: ComparacionPolitico[];
  leyesComparadas: ComparacionLey[];
  leyesEnComun: number;
  coincidencias: number;
  indiceCoincidencia: number;
}

const votoColor = (voto: string) => {
  switch ((voto || '').toUpperCase()) {
    case 'FAVOR': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'CONTRA': return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'ABSTENCION': return 'bg-slate-200 text-slate-700 border-slate-300';
    default: return 'bg-slate-50 text-slate-400 border-slate-200';
  }
};

const DistribucionBar: React.FC<{ favor: number; contra: number; abstencion: number }> = ({ favor, contra, abstencion }) => {
  const total = favor + contra + abstencion || 1;
  return (
    <div className="w-full h-3 rounded-full overflow-hidden border border-slate-200 flex">
      <div className="bg-emerald-500 h-full" style={{ width: `${(favor / total) * 100}%` }} title={`A favor: ${favor}`}></div>
      <div className="bg-rose-500 h-full" style={{ width: `${(contra / total) * 100}%` }} title={`En contra: ${contra}`}></div>
      <div className="bg-slate-400 h-full" style={{ width: `${(abstencion / total) * 100}%` }} title={`Abstención: ${abstencion}`}></div>
    </div>
  );
};

const ComparacionPage: React.FC = () => {
  const [politicos, setPoliticos] = useState<PoliticoItem[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultado, setResultado] = useState<ComparacionVotos | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/politicos/importables')
      .then((res) => res.json())
      .then((data: PoliticoItem[]) => setPoliticos(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error al cargar políticos:', err));
  }, []);

  const nombrePorId = useMemo(() => {
    const mapa: Record<string, string> = {};
    politicos.forEach((p) => { mapa[p.id] = p.label; });
    return mapa;
  }, [politicos]);

  const filtrados = politicos.filter((p) => p.label.toLowerCase().includes(busqueda.toLowerCase()));

  const toggle = (id: string) => {
    setResultado(null);
    setSeleccionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const comparar = async () => {
    if (seleccionados.length < 2) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      seleccionados.forEach((id) => params.append('ids', id));
      const res = await fetch(`/api/politicos/comparar?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResultado(data);
    } catch (err) {
      console.error('Error al comparar patrones de voto:', err);
      setError('No se pudo generar la comparación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-black text-primary-navy uppercase tracking-tighter">Comparación de Patrones de Voto</h2>
        <p className="text-slate-500">Selecciona dos o más políticos para comparar cómo votan y en qué leyes coinciden.</p>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Buscar políticos</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Escribe un nombre..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-accent-blue focus:outline-none"
            />
            <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-slate-100 divide-y divide-slate-100">
              {filtrados.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-400 italic">Sin resultados</p>
              ) : (
                filtrados.slice(0, 50).map((p) => {
                  const activo = seleccionados.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggle(p.id)}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${activo ? 'bg-accent-blue/10 text-accent-blue font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span>{p.label}</span>
                      {activo && <span className="text-xs">✓</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Seleccionados ({seleccionados.length})</label>
            <div className="mt-2 min-h-[3rem] flex flex-wrap gap-2">
              {seleccionados.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Aún no has seleccionado políticos.</p>
              ) : (
                seleccionados.map((id) => (
                  <span key={id} className="inline-flex items-center gap-2 rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1 text-xs font-bold text-accent-blue">
                    {nombrePorId[id] ?? id}
                    <button type="button" onClick={() => toggle(id)} className="text-slate-500 hover:text-rose-600">×</button>
                  </span>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={comparar}
              disabled={seleccionados.length < 2 || isLoading}
              className="mt-4 w-full rounded-xl bg-primary-navy px-4 py-3 text-sm font-black text-white hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Comparando...' : 'Comparar patrones de voto'}
            </button>
            {seleccionados.length < 2 && <p className="mt-2 text-xs text-slate-400">Selecciona al menos dos políticos.</p>}
            {error && <p className="mt-2 text-sm text-danger-red">{error}</p>}
          </div>
        </div>
      </div>

      {resultado && (
        <>
          {/* Índice de coincidencia */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Índice de coincidencia</p>
              <p className="mt-2 text-3xl font-black text-primary-navy">{resultado.indiceCoincidencia}%</p>
              <p className="text-xs text-slate-500 mt-1">de acuerdo en leyes votadas en común</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Leyes en común</p>
              <p className="mt-2 text-3xl font-black text-primary-navy">{resultado.leyesEnComun}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Votaciones coincidentes</p>
              <p className="mt-2 text-3xl font-black text-primary-navy">{resultado.coincidencias}</p>
            </div>
          </div>

          {/* Tarjetas por político */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resultado.politicos.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                    {p.fotoUrl && <img src={p.fotoUrl} alt={p.nombre} className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <Link to={`/politico/${p.id}`} className="font-black text-primary-navy text-sm hover:text-accent-blue block truncate">{p.nombre}</Link>
                    <p className="text-xs text-slate-500 truncate">{p.organizacion || 'Sin organización'}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase mb-1">
                      <span>Distribución de votos</span>
                      <span>{p.totalVotos} votos</span>
                    </div>
                    <DistribucionBar favor={p.votosFavor} contra={p.votosContra} abstencion={p.votosAbstencion} />
                    <div className="flex justify-between mt-1 text-[10px] font-bold">
                      <span className="text-emerald-600">A favor {p.votosFavor}</span>
                      <span className="text-rose-600">Contra {p.votosContra}</span>
                      <span className="text-slate-500">Abst. {p.votosAbstencion}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Asistencia</p>
                      <p className="text-lg font-black text-primary-navy">{p.porcentajeAsistencia}%</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Coherencia</p>
                      <p className="text-lg font-black text-primary-navy">{p.porcentajeCoherencia}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla de leyes en común */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-black text-primary-navy uppercase tracking-wide">Leyes votadas en común</h3>
            </div>
            {resultado.leyesComparadas.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">No hay leyes votadas por dos o más de los políticos seleccionados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="px-6 py-3">Ley</th>
                      {resultado.politicos.map((p) => (
                        <th key={p.id} className="px-4 py-3 text-center">{p.nombre.split(' ')[0]}</th>
                      ))}
                      <th className="px-4 py-3 text-center">Coinciden</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.leyesComparadas.map((ley) => (
                      <tr key={ley.leyId} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-6 py-3">
                          <Link to={`/ley/${ley.leyId}`} className="font-semibold text-primary-navy hover:text-accent-blue line-clamp-1">{ley.leyTitulo}</Link>
                        </td>
                        {resultado.politicos.map((p) => (
                          <td key={p.id} className="px-4 py-3 text-center">
                            <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-black border ${votoColor(ley.votos[p.id] || '—')}`}>
                              {ley.votos[p.id] || '—'}
                            </span>
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          {ley.coinciden
                            ? <span className="text-success-green font-black">Sí</span>
                            : <span className="text-slate-400 font-bold">No</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ComparacionPage;
