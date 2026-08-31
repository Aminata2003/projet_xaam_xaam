import { useEffect, useMemo, useState } from 'react';
import { Send, Lightbulb, RotateCcw } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ErrorBox, Empty, Loading } from '../components/Status';
import api from '../services/api';

// Regroupe les conversations par "Aujourd'hui" / "Cette semaine" / "Plus ancien"
// à partir du champ `date` (ISO) renvoyé par le backend.
function groupByPeriod(list) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  const groups = { "AUJOURD'HUI": [], 'CETTE SEMAINE': [], 'PLUS ANCIEN': [] };
  list.forEach((c) => {
    const d = c.date ? new Date(c.date) : null;
    if (d && d >= today) groups["AUJOURD'HUI"].push(c);
    else if (d && d >= weekAgo) groups['CETTE SEMAINE'].push(c);
    else groups['PLUS ANCIEN'].push(c);
  });
  return Object.entries(groups).filter(([, items]) => items.length);
}

export default function StudentDashboard() {
  const [conversations, setConversations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [activeId, setActiveId] = useState(null);
  const [exercice, setExercice] = useState(null);
  const [messages, setMessages] = useState([]);
  const [indicesDebloques, setIndicesDebloques] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);
  const [comprehension, setComprehension] = useState('');

  const loadHistory = () => {
    setHistoryLoading(true);
    api.get('/eleve/conversations')
      .then((r) => setConversations(Array.isArray(r.data) ? r.data : []))
      .catch(() => setConversations([]))
      .finally(() => setHistoryLoading(false));
  };

  const loadConversation = (id) => {
    setLoading(true); setError('');
    api.get(id ? `/eleve/conversations/${id}` : '/eleve/conversations/courante')
      .then((r) => {
        setActiveId(r.data?.id ?? id ?? null);
        setExercice(r.data?.exercice ?? null);
        setMessages(Array.isArray(r.data?.messages) ? r.data.messages : []);
        setIndicesDebloques(r.data?.indicesDebloques ?? 0);
      })
      .catch((e) => setError(e.response?.data?.message || "Impossible de charger l'exercice."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadHistory(); loadConversation(null); }, []);

  const filteredGroups = useMemo(() => {
    const filtered = search.trim()
      ? conversations.filter((c) => (c.titre || '').toLowerCase().includes(search.toLowerCase()))
      : conversations;
    return groupByPeriod(filtered);
  }, [conversations, search]);

  const startNewConversation = async () => {
    setError('');
    try {
      const { data } = await api.post('/eleve/conversations', {});
      loadHistory();
      loadConversation(data?.id);
      setComprehension('');
    } catch (e) {
      setError(e.response?.data?.message || 'Impossible de démarrer une nouvelle conversation.');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !activeId) return;
    setSending(true); setError('');
    try {
      const { data } = await api.post(`/eleve/conversations/${activeId}/messages`, { message: question });
      setMessages(Array.isArray(data?.messages) ? data.messages : [...messages, { role: 'eleve', texte: question }]);
      setIndicesDebloques(data?.indicesDebloques ?? Math.min((indicesDebloques + 1), exercice?.indices?.length || 0));
      setQuestion('');
    } catch (err) {
      setError(err.response?.data?.message || "Le service de conversation n'est pas encore disponible.");
    } finally {
      setSending(false);
    }
  };

  const validerComprehension = async () => {
    if (!comprehension.trim() || !activeId) return;
    try {
      await api.post(`/eleve/conversations/${activeId}/comprehension`, { texte: comprehension });
      loadHistory();
    } catch (e) {
      setError(e.response?.data?.message || 'Impossible d\'enregistrer ta réponse.');
    }
  };

  const historySlot = historyLoading ? null : filteredGroups.length ? (
    filteredGroups.map(([label, items]) => (
      <div key={label}>
        <div className="side-group-label">{label}</div>
        {items.map((c) => (
          <button
            key={c.id}
            className={`side-item ${c.id === activeId ? 'selected' : ''}`}
            style={{ width: '100%', border: 'none', background: c.id === activeId ? undefined : 'transparent', textAlign: 'left' }}
            onClick={() => loadConversation(c.id)}
          >
            <span className="dot" />
            <span>{c.titre || 'Conversation'}</span>
          </button>
        ))}
      </div>
    ))
  ) : (
    <div className="side-group-label" style={{ opacity: 0.7 }}>Aucune conversation pour l'instant</div>
  );

  const indices = exercice?.indices || [];

  return (
    <DashboardLayout
      onNewConversation={startNewConversation}
      search={search}
      onSearchChange={setSearch}
      historySlot={historySlot}
    >
      <div className="content-wrap">
        <div className="page-kicker">PARCOURS GUIDÉ</div>
        <h1>Résous ton exercice, étape par étape</h1>
        <p className="page-subtitle">Xaam-Xaam+ ne donne jamais la réponse directement. Il te pose des questions pour t'aider à réfléchir.</p>

        {loading ? <Loading /> : (
          <>
            <div className="exercise-card">
              <div className="card-label">
                TON EXERCICE{exercice ? ` (${[exercice.matiere, exercice.niveau].filter(Boolean).join(' — ')})` : ''}
              </div>
              {exercice?.enonce ? (
                <div className="no-data-line">{exercice.enonce}</div>
              ) : (
                <>
                  <div className="no-data-line">Aucun exercice chargé</div>
                  <small>L'exercice apparaîtra ici lorsque le backend fournira le parcours de l'élève.</small>
                </>
              )}
            </div>

            <div className="conversation-card">
              <div className="card-label">DISCUSSION</div>
              {messages.length ? (
                <div className="messages">
                  {messages.map((m, i) => (
                    <div className={`msg ${m.role === 'eleve' ? 'user' : 'ai'}`} key={i}>{m.texte}</div>
                  ))}
                </div>
              ) : (
                <Empty title="Pas encore de discussion" text="Envoie ton premier message pour démarrer une séance guidée." />
              )}
              <form className="message-form" onSubmit={submit}>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Écris ta réponse ou ta réflexion…"
                  disabled={!activeId}
                />
                <button aria-label="Envoyer" disabled={sending || !question.trim() || !activeId}><Send size={17} /></button>
              </form>
              <ErrorBox message={error} />
            </div>

            {indices.length > 0 && (
              <div className="hint-row">
                <div className="hint-icon"><Lightbulb size={18} /></div>
                <div>
                  <strong>Indice {Math.min(indicesDebloques + 1, indices.length)}</strong>
                  <span>
                    {indicesDebloques > 0 || indices[0]
                      ? (indices[Math.max(0, Math.min(indicesDebloques, indices.length - 1))]?.texte)
                      : 'Les indices se débloquent après chaque tentative.'}
                  </span>
                </div>
              </div>
            )}

            <div className="comprehension-card">
              <div className="card-label">ÉTAPE FINALE : RÉEXPLIQUER</div>
              <h3>Explique la démarche avec tes propres mots</h3>
              <textarea
                value={comprehension}
                onChange={(e) => setComprehension(e.target.value)}
                placeholder="Écris ton explication ici…"
                disabled={!messages.length}
              />
              <div className="action-row">
                <button className="primary-btn small" disabled={!messages.length || !comprehension.trim()} onClick={validerComprehension}>
                  Valider ma compréhension
                </button>
                <button className="secondary-btn small" onClick={startNewConversation}>
                  <RotateCcw size={15} /> Refaire l'exercice
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
