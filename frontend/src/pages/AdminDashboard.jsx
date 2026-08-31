import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import SimpleLayout from '../components/layout/SimpleLayout';
import { Loading, Empty, ErrorBox } from '../components/Status';
import api from '../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.message || 'Impossible de charger les données administrateur.'))
      .finally(() => setLoading(false));
  }, []);

  const validate = async (id, accepted) => {
    try {
      await api.patch(`/admin/inscriptions/${id}`, { statut: accepted ? 'valide' : 'refuse' });
      const r = await api.get('/admin/dashboard');
      setData(r.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Action impossible.');
    }
  };

  return (
    <SimpleLayout roleLabel="Superadmin" homePath="/superadmin">
      <div className="content-wrap admin-wrap">
        <div className="page-kicker">PANNEAU DE CONTRÔLE</div>
        <h1>Gestion globale de la plateforme</h1>
        <p className="page-subtitle">Vue superadmin — inscriptions, établissements et rôles, phase de lancement gratuite.</p>

        {loading ? <Loading /> : (
          <>
            <ErrorBox message={error} />
            {!data ? (
              <Empty title="Aucune donnée administrateur" text="Le tableau de bord sera alimenté uniquement par le backend." />
            ) : (
              <>
                <div className="stats-grid admin-stats">
                  {[
                    ['Comptes inscrits', data.comptesInscrits],
                    ['En attente de validation', data.enAttente],
                    ['Établissements actifs', data.etablissementsActifs],
                    ['Exercices guidés ce mois', data.reflexionsGuidees],
                  ].map(([l, v]) => (
                    <div className="stat-card" key={l}><span>{l}</span><strong>{v ?? '—'}</strong></div>
                  ))}
                </div>

                <section className="panel table-panel">
                  <h2>Inscriptions en attente</h2>
                  {Array.isArray(data.inscriptions) && data.inscriptions.length ? (
                    <div className="table-scroll">
                      <table>
                        <thead><tr><th>Nom</th><th>Rôle</th><th>Établissement</th><th>Date</th><th>Action</th></tr></thead>
                        <tbody>
                          {data.inscriptions.map((row) => (
                            <tr key={row.id || row._id}>
                              <td>{row.nom}</td>
                              <td><span className="pill">{row.role}</span></td>
                              <td>{row.etablissement || '—'}</td>
                              <td>{row.date || '—'}</td>
                              <td>
                                <button className="table-btn ok" onClick={() => validate(row.id || row._id, true)}><Check size={14} />Valider</button>
                                <button className="table-btn no" onClick={() => validate(row.id || row._id, false)}><X size={14} />Refuser</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <Empty title="Aucune inscription en attente" text="Les nouvelles demandes seront affichées ici." />
                  )}
                </section>

                <section className="panel">
                  <h2>Établissements sous licence</h2>
                  {Array.isArray(data.etablissements) && data.etablissements.length ? (
                    <div className="table-scroll">
                      <table>
                        <thead><tr><th>Établissement</th><th>Élèves actifs</th><th>Statut</th><th>Renouvellement</th></tr></thead>
                        <tbody>
                          {data.etablissements.map((r, i) => (
                            <tr key={r.id || r._id || i}>
                              <td>{r.nom}</td>
                              <td>{r.elevesActifs ?? '—'}</td>
                              <td><span className="status-pill">{r.statut || '—'}</span></td>
                              <td>{r.renouvellement || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <Empty title="Aucun établissement" text="Les établissements seront chargés depuis le backend." />
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
