import { useEffect, useState } from 'react';
import SimpleLayout from '../components/layout/SimpleLayout';
import { Loading, Empty, ErrorBox } from '../components/Status';
import api from '../services/api';

// Pas de maquette fournie pour cet écran : structure alignée sur Parent/Superadmin
// (SimpleLayout, mêmes classes de cartes/tableaux) en attendant une validation visuelle.
export default function EtablissementDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/etablissement/dashboard')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.message || "Impossible de charger les données de l'établissement."))
      .finally(() => setLoading(false));
  }, []);

  const enAttente = data?.statut === 'en_attente';

  return (
    <SimpleLayout roleLabel="Établissement" homePath="/etablissement">
      <div className="content-wrap etablissement-wrap">
        <div className="page-kicker">ESPACE ÉTABLISSEMENT</div>
        <h1>{data?.nom || 'Votre établissement'}</h1>
        <p className="page-subtitle">Suivi des élèves rattachés à votre établissement sur Xaam-Xaam+.</p>

        {loading ? <Loading /> : (
          <>
            <ErrorBox message={error} />
            {enAttente ? (
              <Empty
                title="Compte en attente de validation"
                text="Votre inscription est en cours d'examen par le superadmin. L'accès complet s'ouvrira dès validation."
              />
            ) : !data ? (
              <Empty title="Aucune donnée disponible" text="Le tableau de bord sera alimenté dès que le backend sera connecté." />
            ) : (
              <>
                <div className="stats-grid admin-stats">
                  {[
                    ['Élèves inscrits', data.elevesInscrits],
                    ['Élèves actifs cette semaine', data.elevesActifs],
                    ['Exercices réalisés ce mois', data.exercicesRealises],
                    ['Progression moyenne', data.progressionMoyenne != null ? `${data.progressionMoyenne}%` : null],
                  ].map(([l, v]) => (
                    <div className="stat-card" key={l}><span>{l}</span><strong>{v ?? '—'}</strong></div>
                  ))}
                </div>

                <section className="panel table-panel">
                  <h2>Élèves rattachés</h2>
                  {Array.isArray(data.eleves) && data.eleves.length ? (
                    <div className="table-scroll">
                      <table>
                        <thead><tr><th>Nom</th><th>Classe</th><th>Dernière activité</th><th>Progression</th></tr></thead>
                        <tbody>
                          {data.eleves.map((el, i) => (
                            <tr key={el.id || i}>
                              <td>{el.nom}</td>
                              <td>{el.classe || '—'}</td>
                              <td>{el.derniereActivite || '—'}</td>
                              <td><span className="status-pill">{el.progression != null ? `${el.progression}%` : '—'}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <Empty title="Aucun élève rattaché" text="Les élèves apparaîtront ici une fois inscrits sous votre établissement." />
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
