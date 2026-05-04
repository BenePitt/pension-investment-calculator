import Accordion from './Accordion.jsx'
import ParamField from './ParamField.jsx'
import { DEFAULTS } from '../../calculations/defaults.js'

const HELP = {
  alterAktuell: 'Dein aktuelles Lebensalter in Jahren. Bestimmt die Ansparphase (= Renteneintrittsalter minus aktuelles Alter). Default: 28 Jahre.',
  renteneintrittsalter: 'Das geplante Renteneintrittsalter. Muss größer als das aktuelle Alter sein. Default: 67 Jahre.',
  zielalterEntnahme: 'Das Alter, bis zu dem der Depot-Entnahmeplan rechnerisch reichen soll. Default: 90 Jahre. Achtung: keine lebenslange Garantie.',
  startkapital: 'Vorhandenes Kapital, das bereits zu Beginn investiert wird. Default: 0 €.',
  monatlicheSparrate: 'Monatliche Einzahlung im ersten Jahr. Steigt jährlich um die Sparratendynamik an. Default: 600 €/Monat.',
  sparratendynamik: 'Jährliche Steigerung der Sparrate (z. B. 3 % = Inflationsausgleich oder Gehaltserhöhung). Default: 3 % p. a.',
  bruttofondrendite: 'Erwartete jährliche Rendite des Aktienindex vor Kosten. Beispiel: MSCI World langfristig ca. 7–8 % p. a. nominal. Default: 7 % p. a.',
  depotFondskosten: 'Jährliche Fondskosten (TER) des ETF oder Aktienfonds im Depot. Günstige ETFs: 0,10–0,20 % p. a. Default: 0,20 % p. a.',
  depotPlattformkosten: 'Jährliche Depot- oder Plattformkosten beim Broker. Viele Neobroker: 0 %. Default: 0 % p. a.',
  policeFondskosten: 'Jährliche Fondskosten innerhalb der Police. Ähnlich wie ETF-Kosten, ggf. etwas höher durch begrenzte Fondsauswahl. Default: 0,20 % p. a.',
  policeVerwaltungskosten: 'Jährliche Verwaltungskosten der Versicherungsgesellschaft (Effektivkostenquote). Zentrale Kostengröße der Police. Default: 1,50 % p. a.',
  policeEroeffnungskosten: 'Einmalige Abschluss- oder Eröffnungskosten. Diese werden zu Beginn aus den Beiträgen beglichen; bis zur vollständigen Bezahlung wird kein Kapital investiert. Default: 4.000 €.',
  sparerPauschbetrag: 'Jährlicher steuerlicher Freibetrag für Kapitalerträge. Default: 1.000 € (Einzelperson seit 2023). Wird jährlich für die Vorabpauschale und am Ende für die Abgeltungsteuer genutzt.',
  pauschbetragVerfuegbar: 'Prozentualer Anteil des Sparer-Pauschbetrags, der diesem Depot/Investmentplan zur Verfügung steht. 100 % = kein anderes Kapitalvermögen verbraucht den Freibetrag. Default: 100 %.',
  abgeltungsteuer: 'Abgeltungsteuersatz auf Kapitalerträge. Gesetzlich 25 %, zzgl. Soli und ggf. Kirchensteuer. Default: 25 %.',
  solidaritaetszuschlag: 'Solidaritätszuschlag auf die Abgeltungsteuer. Aktuell 5,5 %, aber für viele Steuerpflichtige bereits nicht mehr fällig. Default: 5,5 %.',
  kirchensteuer: 'Kirchensteuer auf Kapitalerträge (8 oder 9 % der Abgeltungsteuer, je nach Bundesland). Default: 0 % (konfessionslos).',
  teilfreistellung: 'Steuerliche Teilfreistellung für Aktienfonds: 30 % der Erträge sind steuerfrei (§ 20 InvStG). Default: 30 % (Aktienfonds).',
  basiszins: 'Basiszins für die Vorabpauschale (jährlich vom BZSt veröffentlicht). Basisertrag = Depotwert Jahresbeginn × Basiszins × 70 %. Default: 3,20 % p. a.',
  vorabpauschaleMode: 'Wie die Vorabpauschale modelliert wird. „Aus Depot": VP-Steuer wird jährlich direkt aus dem Fondsvermögen entnommen (Standard, einfach). „Aus Sparrate/Einkommen": VP-Steuer wird aus dem laufenden Einkommen bezahlt, das Depot bleibt unberührt — realistischer, da Anleger VP-Steuer i. d. R. überweisen statt Fondsanteile verkaufen.',
  grenzsteuersatz: 'Persönlicher Einkommensteuersatz im Rentenalter. Wird auf steuerpflichtige Kapitalerträge der Police angewendet. Default: 45 % (höchster Grenzsteuersatz; ggf. nach unten anpassen).',
  freistellung15Prozent: '15 %-Freistellung gemäß § 20 Abs. 1 Nr. 6 EStG für fondsgebundene Rentenversicherungen (Investmentanteile). 15 % des Unterschiedsbetrags sind steuerfrei. Default: aktiviert.',
  regel12_62: '12/62-Regel: Wenn der Vertrag mindestens 12 Jahre läuft UND die Auszahlung nach dem 62. Geburtstag erfolgt, ist nur die Hälfte des verbleibenden Unterschiedsbetrags steuerpflichtig. Default: automatisch anwenden wenn Bedingungen erfüllt.',
  ertragsanteil: 'Ertragsanteil für private Leibrenten bei Rentenbeginn mit 67 Jahren: 17 % der monatlichen Rente sind steuerpflichtig (§ 22 EStG). Default: 17 %.',
  rentenfaktor: 'Rentenfaktor in € je 10.000 € Vertragsguthaben bei Rentenbeginn. Typisch: 25–35 €. Default: 30 €.',
  zielalterEntnahmeHilfe: 'Alter, bis zu dem der Depot-Entnahmeplan reichen soll (Zielalter). Das Depot wird dann rechnerisch auf 0 € abgebaut. Kein garantierter Wert für die Lebenserwartung!',
}

export default function ParameterPanel({ params, onChange, onReset }) {
  function field(key, extra = {}) {
    return (
      <ParamField
        key={key}
        fieldId={key}
        value={params[key]}
        onChange={(v) => onChange(key, v)}
        helpText={HELP[key] || ''}
        {...extra}
      />
    )
  }

  return (
    <aside className="parameter-panel" aria-label="Parameter">
      <div className="panel-header">
        <h2>Parameter</h2>
        <button type="button" className="reset-btn" onClick={onReset}>
          Zurücksetzen
        </button>
      </div>

      <Accordion title="Person & Sparplan" defaultOpen={true}>
        {field('alterAktuell', { label: 'Aktuelles Alter', unit: 'Jahre', min: 18, max: 80, step: 1 })}
        {field('renteneintrittsalter', { label: 'Renteneintrittsalter', unit: 'Jahre', min: 19, max: 85, step: 1 })}
        {field('zielalterEntnahme', { label: 'Zielalter Entnahmeplan', unit: 'Jahre', min: 60, max: 110, step: 1 })}
        {field('startkapital', { label: 'Startkapital', unit: '€', min: 0, step: 1000 })}
        {field('monatlicheSparrate', { label: 'Monatliche Sparrate (Jahr 1)', unit: '€/Monat', min: 0, step: 50 })}
        {field('sparratendynamik', { label: 'Sparratendynamik', unit: '% p. a.', min: 0, max: 10, step: 0.1,
          value: params.sparratendynamik * 100,
          onChange: (v) => onChange('sparratendynamik', v / 100) })}
      </Accordion>

      <Accordion title="Rendite & Kosten">
        {field('bruttofondrendite', { label: 'Aktienrendite brutto', unit: '% p. a.', min: 0, max: 20, step: 0.1,
          value: params.bruttofondrendite * 100,
          onChange: (v) => onChange('bruttofondrendite', v / 100) })}
        {field('depotFondskosten', { label: 'Depot-Fondskosten (TER)', unit: '% p. a.', min: 0, max: 3, step: 0.01,
          value: params.depotFondskosten * 100,
          onChange: (v) => onChange('depotFondskosten', v / 100) })}
        {field('depotPlattformkosten', { label: 'Depot-/Plattformkosten', unit: '% p. a.', min: 0, max: 3, step: 0.01,
          value: params.depotPlattformkosten * 100,
          onChange: (v) => onChange('depotPlattformkosten', v / 100) })}
        {field('policeFondskosten', { label: 'Police-Fondskosten', unit: '% p. a.', min: 0, max: 3, step: 0.01,
          value: params.policeFondskosten * 100,
          onChange: (v) => onChange('policeFondskosten', v / 100) })}
        {field('policeVerwaltungskosten', { label: 'Police-Verwaltungskosten', unit: '% p. a.', min: -2, max: 10, step: 0.01,
          value: params.policeVerwaltungskosten * 100,
          onChange: (v) => onChange('policeVerwaltungskosten', v / 100) })}
        {field('policeEroeffnungskosten', { label: 'Police-Eröffnungskosten', unit: '€', min: 0, step: 100 })}
      </Accordion>

      <Accordion title="Steuern Depot">
        {field('sparerPauschbetrag', { label: 'Sparer-Pauschbetrag', unit: '€/Jahr', min: 0, max: 2000, step: 100 })}
        {field('pauschbetragVerfuegbar', { label: 'Verfügbarer Pauschbetrag', unit: '%', min: 0, max: 100, step: 10,
          value: params.pauschbetragVerfuegbar * 100,
          onChange: (v) => onChange('pauschbetragVerfuegbar', v / 100) })}
        {field('abgeltungsteuer', { label: 'Abgeltungsteuer', unit: '%', min: 0, max: 50, step: 0.1,
          value: params.abgeltungsteuer * 100,
          onChange: (v) => onChange('abgeltungsteuer', v / 100) })}
        {field('solidaritaetszuschlag', { label: 'Solidaritätszuschlag', unit: '%', min: 0, max: 10, step: 0.1,
          value: params.solidaritaetszuschlag * 100,
          onChange: (v) => onChange('solidaritaetszuschlag', v / 100) })}
        {field('kirchensteuer', { label: 'Kirchensteuer', unit: '%', min: 0, max: 10, step: 0.1,
          value: params.kirchensteuer * 100,
          onChange: (v) => onChange('kirchensteuer', v / 100) })}
        {field('teilfreistellung', { label: 'Teilfreistellung Aktienfonds', unit: '%', min: 0, max: 100, step: 1,
          value: params.teilfreistellung * 100,
          onChange: (v) => onChange('teilfreistellung', v / 100) })}
        {field('basiszins', { label: 'Basiszins Vorabpauschale', unit: '% p. a.', min: 0, max: 10, step: 0.01,
          value: params.basiszins * 100,
          onChange: (v) => onChange('basiszins', v / 100) })}
        {field('vorabpauschaleMode', {
          label: 'Vorabpauschale',
          type: 'radio',
          options: [
            { value: 'deaktiviert', label: 'Deaktiviert' },
            { value: 'depot', label: 'Aus Depot' },
            { value: 'sparrate', label: 'Aus Sparrate / Einkommen' },
          ],
        })}
      </Accordion>

      <Accordion title="Steuern Rentenpolice">
        {field('grenzsteuersatz', { label: 'Grenzsteuersatz im Alter', unit: '%', min: 0, max: 60, step: 1,
          value: params.grenzsteuersatz * 100,
          onChange: (v) => onChange('grenzsteuersatz', v / 100) })}
        {field('freistellung15Prozent', { label: '15 %-Freistellung (fondsgebunden)', type: 'checkbox' })}
        {field('regel12_62', { label: '12/62-Regel (Halbierungsregel)', type: 'checkbox' })}
        {field('ertragsanteil', { label: 'Ertragsanteil Leibrente', unit: '%', min: 0, max: 100, step: 1,
          value: params.ertragsanteil * 100,
          onChange: (v) => onChange('ertragsanteil', v / 100) })}
      </Accordion>

      <Accordion title="Auszahlung & Rente">
        {field('rentenfaktor', { label: 'Rentenfaktor', unit: '€ / 10.000 €', min: 10, max: 60, step: 0.5 })}
      </Accordion>

      <Accordion title="Erweiterte Annahmen">
        <div className="help-text">
          Die folgenden Annahmen gelten für das Modell:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
            <li>Beitragszeitpunkt: Monatsende</li>
            <li>KVdR im Rentenalter (keine zusätzliche KV/PV)</li>
            <li>Konstante Rendite (keine Simulation schwankender Märkte)</li>
            <li>Keine Inflation explizit modelliert</li>
          </ul>
        </div>
      </Accordion>
    </aside>
  )
}
