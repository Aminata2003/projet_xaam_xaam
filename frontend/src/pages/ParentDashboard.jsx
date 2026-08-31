import { useEffect, useState } from 'react';
import SimpleLayout from '../components/layout/SimpleLayout';
import { Loading, Empty, ErrorBox } from '../components/Status';
import api from '../services/api';

export default function ParentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/parent/dashboard')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.message || 'Impossible de charger le tableau de bord.'))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    ['Temps moyen de réflexion avant 1er indice', data?.tempsReflexion],
    ["Tentatives avant de débloquer un indice", data?.tentatives],
    ['Reformulations jugées solides', data?.reformulations != null ? `${data.reformulations}%` : null],
  ];

  return (
    <SimpleLayout roleLabel="Parent" homePath="/parent">
      <div className="content-wrap parent-wrap">
        <div className="page-kicker">SUIVI HEBDOMADAIRE</div>
        <h1>Le parcours de réflexion de votre enfant</h1>
        <p className="page-subtitle">Ce que votre enfant a réellement travaillé cette semaine — pas seulement les notes obtenues.</p>

        {loading ? <Loading /> : (
          <>
            <ErrorBox message={error} />
            {!data ? (
              <Empty title="Aucune donnée de suivi" text="Les statistiques apparaîtront après connexion du backend et activité de l'élève." />
            ) : (
              <>
                <div className="stats-grid">
                  {stats.map(([l, v]) => (
                    <div className="stat-card" key={l}><span>{l}</span><strong>{v ?? '—'}</strong></div>
                  ))}
                </div>
                <section className="panel">
                  <h2>Répartition de l'effort par matière</h2>
                  {Array.isArray(data.repartition) && data.repartition.length ? (
                    data.repartition.map((x, i) => (
                      <div className="progress-line" key={i}>
                        <span>{x.matiere}</span>
                        <div><i style={{ width: `${Math.min(100, Math.max(0, x.pourcentage || 0))}%` }} /></div>
                        <b>{x.pourcentage}%</b>
                      </div>
                    ))
                  ) : (
                    <Empty title="Aucune répartition" text="Les matières seront affichées lorsque les données seront disponibles." />
                  )}

                  <h2 className="panel-subtitle">Badges obtenus cette semaine</h2>
                  {Array.isArray(data.badges) && data.badges.length ? (
                    <div className="badges">{data.badges.map((b, i) => <span key={i}>{b.nom || b}</span>)}</div>
                  ) : (
                    <Empty title="Aucun badge" text="Les badges apparaîtront ici selon l'activité réelle." />
                  )}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </SimpleLayout>
  );
}
