import React, { useEffect, useMemo, useState } from 'react';

interface MetricaItem {
  etiqueta: string;
  valor: number;
}

interface Metricas {
  categoriaFiltro: string | null;
  estadoFiltro: string | null;
  desde: string | null;
  hasta: string | null;
  totalLeyes: number;
  totalVotos: number;
  promedioCoherenciaGlobal: number;
  leyesPorEstado: MetricaItem[];
  leyesPorCategoria: MetricaItem[];
  votosPorTipo: MetricaItem[];
  coherenciaPorCategoria: MetricaItem[];
  serieVotosPorMes: MetricaItem[];
}

const PALETA = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d'];

const HorizontalBars: React.FC<{ datos: MetricaItem[]; sufijo?: string; max?: number }> = ({ datos, sufijo = '', max }) => {
  const maximo = max ?? Math.max(1, ...datos.map((d) => d.valor));
  if (datos.length === 0) {
    return <p className="text-sm text-slate-400 italic">Sin datos para los filtros actuales.</p>;
  }
  return (
    <div className="space-y-3">
      {datos.map((d, i) => (
        <div key={d.etiqueta}>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span className="truncate">{d.etiqueta}</span>
            <span>{d.valor}{sufijo}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(d.valor / maximo) * 100}%`, backgroundColor: PALETA[i % PALETA.length] }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ColumnChart: React.FC<{ datos: MetricaItem[] }> = ({ datos }) => {
  const maximo = Math.max(1, ...datos.map((d) => d.valor));
  if (datos.length === 0) {
    return <p className="text-sm text-slate-400 italic">Sin datos para los filtros actuales.</p>;
  }
  return (
    <div className="flex items-end gap-2 h-48 overflow-x-auto pb-2">
      {datos.map((d) => (
        <div key={d.etiqueta} className="flex flex-col items-center justify-end flex-1 min-w-[42px]">
          <span className="text-[10px] font-black text-slate-500 mb-1">{d.valor}</span>
          <div
            className="w-full rounded-t-lg bg-accent-blue transition-all duration-700"
            style={{ height: `${(d.valor / maximo) * 100}%`, minHeight: d.valor > 0 ? '4px' : '0' }}
          ></div>
          <span className="text-[9px] font-bold text-slate-400 mt-1 whitespace-nowrap">{d.etiqueta}</span>
        </div>
      ))}
    </div>
  );
};

const Card: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
    <h3 className="text-sm font-black text-primary-navy uppercase tracking-wide mb-4">{titulo}</h3>
    {children}
  </div>
);

const MetricasPage: React.FC = () => {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [estados, setEstados] = useState<string[]>([]);

  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  useEffect(() => {
    fetch('/api/leyes/filtros')
      .then((res) => res.json())
      .then((data) => {
        setCategorias(Array.isArray(data?.categorias) ? data.categorias : []);
        setEstados(Array.isArray(data?.estados) ? data.estados : []);
      })
      .catch((err) => console.error('Error al cargar filtros:', err));
  }, []);

  const cargarMetricas = useMemo(
    () => async (params: { categoria: string; estado: string; desde: string; hasta: string }) => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (params.categoria) query.set('categoria', params.categoria);
        if (params.estado) query.set('estado', params.estado);
        if (params.desde) query.set('desde', params.desde);
        if (params.hasta) query.set('hasta', params.hasta);
        const res = await fetch(`/api/dashboard/metricas?${query.toString()}`);
        const data = await res.json();
        setMetricas(data);
      } catch (err) {
        console.error('Error al cargar métricas:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    cargarMetricas({ categoria: '', estado: '', desde: '', hasta: '' });
  }, [cargarMetricas]);

  const aplicar = () => cargarMetricas({ categoria, estado, desde, hasta });
  const limpiar = () => {
    setCategoria('');
    setEstado('');
    setDesde('');
    setHasta('');
    cargarMetricas({ categoria: '', estado: '', desde: '', hasta: '' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-black text-primary-navy uppercase tracking-tighter">Métricas de Cumplimiento</h2>
        <p className="text-slate-500">Explora las métricas con filtros, rangos de tiempo y comparaciones por categoría.</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Categoría</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-accent-blue focus:outline-none">
              <option value="">Todas</option>
              {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-accent-blue focus:outline-none">
              <option value="">Todos</option>
              {estados.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Desde</label>
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-accent-blue focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hasta</label>
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-accent-blue focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={aplicar} className="flex-1 rounded-xl bg-primary-navy px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800 transition-all">Aplicar</button>
            <button onClick={limpiar} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Limpiar</button>
          </div>
        </div>
      </div>

      {isLoading || !metricas ? (
        <div className="animate-pulse grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-white h-64 rounded-2xl border border-slate-200"></div>)}
        </div>
      ) : (
        <>
          {/* Totales */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm border-b-4 border-b-accent-blue">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Leyes (filtradas)</p>
              <p className="mt-2 text-3xl font-black text-primary-navy">{metricas.totalLeyes}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm border-b-4 border-b-success-green">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Votos (filtrados)</p>
              <p className="mt-2 text-3xl font-black text-primary-navy">{metricas.totalVotos}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm border-b-4 border-b-warning-amber">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coherencia global</p>
              <p className="mt-2 text-3xl font-black text-primary-navy">{metricas.promedioCoherenciaGlobal}%</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card titulo="Leyes por estado">
              <HorizontalBars datos={metricas.leyesPorEstado} />
            </Card>
            <Card titulo="Leyes por categoría">
              <HorizontalBars datos={metricas.leyesPorCategoria} />
            </Card>
            <Card titulo="Votos por tipo">
              <HorizontalBars datos={metricas.votosPorTipo} />
            </Card>
            <Card titulo="Cumplimiento (coherencia) por categoría">
              <HorizontalBars datos={metricas.coherenciaPorCategoria} sufijo="%" max={100} />
            </Card>
          </div>

          <Card titulo="Votos registrados por mes">
            <ColumnChart datos={metricas.serieVotosPorMes} />
          </Card>
        </>
      )}
    </div>
  );
};

export default MetricasPage;
