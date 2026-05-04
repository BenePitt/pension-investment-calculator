import { useState } from 'react'

export default function ParamField({
  label,
  fieldId,
  value,
  onChange,
  type = 'number',
  min,
  max,
  step = 1,
  unit = '',
  helpText = '',
  disabled = false,
}) {
  const [showHelp, setShowHelp] = useState(false)

  function handleChange(e) {
    const raw = e.target.value
    if (type === 'checkbox') {
      onChange(e.target.checked)
    } else {
      const parsed = parseFloat(raw)
      if (!isNaN(parsed)) onChange(parsed)
    }
  }

  return (
    <div className="param-field">
      <div className="param-field-header">
        <label htmlFor={fieldId} className="param-label">
          {label}
          {unit && <span className="param-unit">{unit}</span>}
        </label>
        {helpText && (
          <button
            type="button"
            className="help-btn"
            aria-label={`Hilfe zu ${label}`}
            aria-expanded={showHelp}
            onClick={() => setShowHelp((v) => !v)}
          >
            ?
          </button>
        )}
      </div>
      {showHelp && helpText && (
        <div className="help-text" role="region" aria-label={`Erklärung ${label}`}>
          {helpText}
        </div>
      )}
      {type === 'checkbox' ? (
        <label className="toggle-label">
          <input
            id={fieldId}
            type="checkbox"
            checked={!!value}
            onChange={handleChange}
            disabled={disabled}
            className="toggle-input"
          />
          <span className="toggle-slider" aria-hidden="true" />
          <span className="toggle-text">{value ? 'Aktiv' : 'Inaktiv'}</span>
        </label>
      ) : (
        <input
          id={fieldId}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          disabled={disabled}
          className="param-input"
          aria-describedby={showHelp ? `${fieldId}-help` : undefined}
        />
      )}
    </div>
  )
}
