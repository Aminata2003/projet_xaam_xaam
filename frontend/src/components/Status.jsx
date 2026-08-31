export function Loading({text='Chargement…'}){return <div className="status-box"><div className="spinner"/><span>{text}</span></div>}
export function Empty({title='Aucune donnée disponible',text='Les informations apparaîtront dès que le backend sera connecté.'}){return <div className="empty-box"><strong>{title}</strong><span>{text}</span></div>}
export function ErrorBox({message}){return message?<div className="error-box">{message}</div>:null}
