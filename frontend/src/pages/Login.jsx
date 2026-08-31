import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/layout/PublicHeader';
import FormField from '../components/FormField';
import { ErrorBox } from '../components/Status';
import { useAuth } from '../context/AuthContext';

export default function Login(){const [form,setForm]=useState({email:'',password:''});const [error,setError]=useState('');const [loading,setLoading]=useState(false);const {login}=useAuth();const navigate=useNavigate();
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 const submit=async e=>{e.preventDefault();setError('');setLoading(true);try{const u=await login(form);navigate(`/${u?.role||'eleve'}`)}catch(err){setError(err.response?.data?.message||'Impossible de se connecter. Vérifiez le serveur et vos identifiants.')}finally{setLoading(false)}};
 return <><PublicHeader/><div className="auth-page"><section className="auth-card"><div className="auth-logo">X</div><h1>Xaam-Xaam+</h1><p className="tagline">Apprendre à réfléchir, pas à copier</p><div className="tabs"><span className="tab active">Se connecter</span><Link to="/inscription" className="tab">Créer un compte</Link></div><form onSubmit={submit}><FormField label="Adresse e-mail" name="email" type="email" value={form.email} onChange={change} placeholder="nom@exemple.com"/><FormField label="Mot de passe" name="password" type="password" value={form.password} onChange={change} placeholder="••••••••"/><ErrorBox message={error}/><button className="primary-btn" disabled={loading}>{loading?'Connexion…':'Se connecter'}</button></form><div className="form-footer"><span>Première fois ?</span><Link to="/inscription">Créer un compte</Link></div></section></div></>}
