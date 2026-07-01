import { useState, useCallback, useEffect } from 'react';
import type { Poem, ControlSettings, TabId } from './types';
import { convertCodeToPoetry } from './utils/poetryConverter';
import Layout from './components/Layout';
import CodeInput from './components/CodeInput';
import PoetryOutput from './components/PoetryOutput';
import SteganographyPanel from './components/SteganographyPanel';
import VisualizationCanvas from './components/VisualizationCanvas';
import ControlPanel from './components/ControlPanel';
import './App.css';

const DEFAULT_CODE = `function greet(name) {
  if (!name) {
    return "Hello, World!";
  }
  const message = "Hello, " + name;
  return message;
}`;

const DEFAULT_SETTINGS: ControlSettings = {
  poemStyle: 'freeverse',
  steganographyEnabled: false,
  steganographyStrength: 5,
  animationSpeed: 1,
  colorTheme: 'dark',
  showParticles: true,
};

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [poem, setPoem] = useState<Poem | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('converter');
  const [settings, setSettings] = useState<ControlSettings>(DEFAULT_SETTINGS);
  const [encodedContent, setEncodedContent] = useState<string>('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.colorTheme);
  }, [settings.colorTheme]);

  const handleGenerate = useCallback(() => {
    if (!code.trim()) return;
    const result = convertCodeToPoetry(code, settings.poemStyle);
    setPoem(result);
    setActiveTab('converter');
  }, [code, settings.poemStyle]);

  const handleExport = useCallback(() => {
    if (!poem) return;

    const exportData = {
      title: poem.title,
      style: poem.style,
      lines: poem.lines.map(l => ({ poetic: l.poetic, lineNumber: l.lineNumber })),
      metadata: poem.metadata,
      encodedContent: encodedContent || undefined,
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codepoetica-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [poem, encodedContent]);

  const handleLoadExample = useCallback((exampleCode: string) => {
    setCode(exampleCode);
  }, []);

  const handleEncodedPoem = useCallback((encoded: string) => {
    setEncodedContent(encoded);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'converter':
        return (
          <div className="converter-layout">
            <div className="converter-left">
              <CodeInput
                value={code}
                onChange={setCode}
                onLoadExample={handleLoadExample}
              />
            </div>
            <div className="converter-right">
              <PoetryOutput poem={poem} />
            </div>
          </div>
        );

      case 'steganography':
        return (
          <div className="steganography-layout">
            <div className="steg-left">
              <SteganographyPanel
                poem={poem}
                code={code}
                onEncodedPoem={handleEncodedPoem}
              />
            </div>
            <div className="steg-right">
              {encodedContent && (
                <div className="encoded-preview">
                  <h3>Encoded Content Preview</h3>
                  <pre className="encoded-text">{encodedContent}</pre>
                </div>
              )}
              {!encodedContent && (
                <div className="encoded-preview empty">
                  <p>Encoded content will appear here</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'visualization':
        return (
          <div className="visualization-layout">
            <VisualizationCanvas code={code} settings={settings} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="app-content">
        <aside className="app-sidebar">
          <ControlPanel
            settings={settings}
            onSettingsChange={setSettings}
            onGenerate={handleGenerate}
            onExport={handleExport}
            hasCode={code.trim().length > 0}
          />
        </aside>
        <section className="app-workspace">
          {renderTabContent()}
        </section>
      </div>
    </Layout>
  );
}
