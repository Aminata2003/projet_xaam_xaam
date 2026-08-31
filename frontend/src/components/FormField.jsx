export default function FormField({ label, name, type = 'text', value, onChange, placeholder, required = true, hint, ...rest }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} {...rest} />
      {hint && <small className="field-hint">{hint}</small>}
    </label>
  );
}
