import type { ControlSettings, PoemStyle, ColorTheme } from '../types';

interface ControlPanelProps {
  settings: ControlSettings;
  onSettingsChange: (settings: ControlSettings) => void;
  onGenerate: () => void;
  onExport: () => void;
  hasCode: boolean;
}

const POEM_STYLES: { value: PoemStyle; label: string }[] = [
  { value: 'freeverse', label: 'Free Verse' },
  { value: 'haiku', label: 'Haiku (俳句)' },
  { value: 'sonnet', label: 'Sonnet (十四行诗)' },
];

const COLOR_THEMES: { value: ColorTheme; label: string; icon: string }[] = [
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'cyberpunk', label: 'Cyberpunk', icon: '🤖' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
];

export default function ControlPanel({
  settings,
  onSettingsChange,
  onGenerate,
  onExport,
  hasCode,
}: ControlPanelProps) {
  const update = (partial: Partial<ControlSettings>) => {
    onSettingsChange({ ...settings, ...partial });
  };

  return (
    <div className="control-panel">
      <h3 className="control-title">Settings</h3>

      {/* Poem Style */}
      <div className="control-group">
        <label className="control-label">Poem Style</label>
        <select
          className="control-select"
          value={settings.poemStyle}
          onChange={e => update({ poemStyle: e.target.value as PoemStyle })}
        >
          {POEM_STYLES.map(s => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Color Theme */}
      <div className="control-group">
        <label className="control-label">Color Theme</label>
        <div className="theme-buttons">
          {COLOR_THEMES.map(t => (
            <button
              key={t.value}
              className={`theme-btn ${settings.colorTheme === t.value ? 'active' : ''}`}
              onClick={() => update({ colorTheme: t.value })}
              title={t.label}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Steganography Toggle */}
      <div className="control-group">
        <label className="control-label">Steganography</label>
        <div className="toggle-row">
          <button
            className={`toggle-btn ${settings.steganographyEnabled ? 'active' : ''}`}
            onClick={() => update({ steganographyEnabled: !settings.steganographyEnabled })}
          >
            {settings.steganographyEnabled ? 'ON' : 'OFF'}
          </button>
          {settings.steganographyEnabled && (
            <div className="slider-group">
              <label className="slider-label">Strength: {settings.steganographyStrength}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.steganographyStrength}
                onChange={e => update({ steganographyStrength: parseInt(e.target.value) })}
                className="control-slider"
              />
            </div>
          )}
        </div>
      </div>

      {/* Animation Speed */}
      <div className="control-group">
        <label className="control-label">
          Animation Speed: {settings.animationSpeed.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={settings.animationSpeed}
          onChange={e => update({ animationSpeed: parseFloat(e.target.value) })}
          className="control-slider"
        />
      </div>

      {/* Show Particles */}
      <div className="control-group">
        <label className="control-label checkbox-label">
          <input
            type="checkbox"
            checked={settings.showParticles}
            onChange={e => update({ showParticles: e.target.checked })}
            className="control-checkbox"
          />
          Show Particles
        </label>
      </div>

      {/* Action Buttons */}
      <div className="control-actions">
        <button
          className="generate-btn"
          onClick={onGenerate}
          disabled={!hasCode}
        >
          ✨ Generate Poetry
        </button>
        <button
          className="export-btn"
          onClick={onExport}
          disabled={!hasCode}
        >
          📦 Export
        </button>
      </div>
    </div>
  );
}
