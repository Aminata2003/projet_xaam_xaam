import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/layout/PublicHeader';
import FormField from '../components/FormField';
import { ErrorBox } from '../components/Status';
import { useAuth } from '../context/AuthContext';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_HINT = `Au moins ${PASSWORD_MIN_LENGTH} caractères, avec un chiffre.`;

function validatePassword(password) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`;
  }
  if (!/\d/.test(password)) {
    return 'Le mot de passe doit contenir au moins un chiffre.';
  }
  return '';
}

export default function Register(){const [form,setForm]=useState({nom:'',email:'',password:'',role:'eleve'});const [error,setError]=useState('');const [loading,setLoading]=useState(false);const {register}=useAuth();const navigate=useNavigate();const change=e=>setForm({...form,[e.target.name]:e.target.value});
 const submit=async e=>{
  e.preventDefault();
  setError('');
  const passwordError = validatePassword(form.password);
  if (passwordError) { setError(passwordError); return; }
  setLoading(true);
  try{await register(form);navigate('/connexion')}catch(err){setError(err.response?.data?.message||'Impossible de créer le compte. Vérifiez le serveur.')}finally{setLoading(false)}};
 return <><PublicHeader/><div className="auth-page"><section className="auth-card register-card"><div className="auth-logo">X</div><h1>Xaam-Xaam+</h1><p className="tagline">Apprendre à réfléchir, pas à copier</p><div className="tabs"><Link to="/connexion" className="tab">Se connecter</Link><span className="tab active">Créer un compte</span></div><form onSubmit={submit}><div className="field"><span>Nom complet</span><input name="nom" value={form.nom} onChange={change} placeholder="Votre nom" required/></div><div className="role-grid">{[['eleve','Élève'],['parent','Parent'],['etablissement','Établissement']].map(([v,l])=><label key={v} className={`role-choice ${form.role===v?'chosen':''}`}><input type="radio" name="role" value={v} checked={form.role===v} onChange={change}/><span>{l}</span></label>)}</div><FormField label="Adresse e-mail" name="email" type="email" value={form.email} onChange={change} placeholder="nom@exemple.com"/><FormField label="Mot de passe" name="password" type="password" value={form.password} onChange={change} placeholder="••••••••" minLength={PASSWORD_MIN_LENGTH} hint={PASSWORD_HINT}/><ErrorBox message={error}/><button className="primary-btn" disabled={loading}>{loading?'Création…':'Créer mon compte'}</button></form><div className="form-footer"><span>Déjà inscrit ?</span><Link to="/connexion">Se connecter</Link></div></section></div></>}
