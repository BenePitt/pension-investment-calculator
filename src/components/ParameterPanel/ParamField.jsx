import { useState } from 'react'

export default function ParamField({
  label,
  fieldId,
  value,
  onChange,
  type = 'number',
  options = [],   // für type='radio': [{ value, label }]
  min,
  max,
  step = 1,
  unit = '',
  helpText = '',
  disabled = false,
}) {
  const [showHelp, setShowHelp] = useState(false)

  function handleChange(e) {
    if (type === 'checkbox') {
      onChange(e.target.checked)
    } else if (type === 'radio') {
      onChange(e.target.value)
    } else {
      const parsed = parseFloat(e.target.value)
      if (!isNaN(parsed)) onChange(parsed)
    }
  }

  return (
    <div className="param-field">
      <div className="param-field-header">
        <span id={`${fieldId}-label`} className="param-label">
          {label}
          {unit && <span className="param-unit">{unit}</span>}
        </span>
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
      ) : type === 'range' ? (
        <div className="range-field">
          <input
            id={fieldId}
            type="range"
            value={value}
            min={min ?? 0}
            max={max ?? 100}
            step={step}
            onChange={handleChange}
            disabled={disabled}
            className="range-input"
          />
          <div className="range-display">
            <span className="range-display-left">{min ?? 0} %</span>
            <span className="range-display-value">{Number(value).toFixed(0)} %</span>
            <span className="range-display-right">{max ?? 100} %</span>
          </div>
        </div>
      ) : type === 'radio' ? (
        <div
          className="radio-group"
          role="radiogroup"
          aria-labelledby={`${fieldId}-label`}
        >
          {options.map((opt) => (
            <label key={opt.value} className="radio-option">
              <input
                type="radio"
                name={fieldId}
                value={opt.value}
                checked={value === opt.value}
                onChange={handleChange}
                disabled={disabled}
              />
              <span className="radio-label">{opt.label}</span>
            </label>
          ))}
        </div>
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
