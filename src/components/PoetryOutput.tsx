import type { Poem } from '../types';

interface PoetryOutputProps {
  poem: Poem | null;
}

export default function PoetryOutput({ poem }: PoetryOutputProps) {
  if (!poem) {
    return (
      <div className="poetry-output-container empty">
        <div className="poetry-empty">
          <span className="poetry-empty-icon">📝</span>
          <p className="poetry-empty-title">Your Poem Will Appear Here</p>
          <p className="poetry-empty-subtitle">
            Enter some code and click "Generate Poetry" to transform your logic into lyrical art
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    const text = poem.lines
      .map(l => l.poetic)
      .filter(Boolean)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const handleDownload = () => {
    const text = [
      poem.title,
      '='.repeat(poem.title.length),
      '',
      ...poem.lines.map(l => l.poetic),
      '',
      `--- Metadata ---`,
      `Style: ${poem.style}`,
      `Original Lines: ${poem.metadata.originalLines}`,
      `Keywords Found: ${poem.metadata.keywordsFound}`,
      `Functions Found: ${poem.metadata.functionsFound}`,
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${poem.title.replace(/[^a-zA-Z0-9一-鿿]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const styleLabel = {
    freeverse: 'Free Verse',
    haiku: 'Haiku (俳句)',
    sonnet: 'Sonnet (十四行诗)',
  }[poem.style];

  return (
    <div className="poetry-output-container">
      <div className="poetry-header">
        <h2 className="poetry-title">{poem.title}</h2>
        <span className="poetry-style-badge">{styleLabel}</span>
      </div>

      <div className="poetry-lines">
        {poem.lines.map((line, index) => (
          <div
            key={index}
            className={`poetry-line ${line.poetic.startsWith('/*') ? 'poetry-comment' : ''}`}
            style={{ paddingLeft: `${line.indentLevel * 1.5}rem` }}
          >
            <span className="poetry-line-number">{line.lineNumber > 0 ? line.lineNumber : '·'}</span>
            <span className="poetry-line-text">
              {line.poetic || (line.original.trim() ? '　' : '')}
            </span>
          </div>
        ))}
      </div>

      <div className="poetry-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Keywords</span>
          <span className="metadata-value">{poem.metadata.keywordsFound}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Functions</span>
          <span className="metadata-value">{poem.metadata.functionsFound}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Lines</span>
          <span className="metadata-value">{poem.metadata.originalLines}</span>
        </div>
      </div>

      <div className="poetry-actions">
        <button className="poetry-btn" onClick={handleCopy}>
          📋 Copy to Clipboard
        </button>
        <button className="poetry-btn" onClick={handleDownload}>
          💾 Download as Text
        </button>
      </div>
    </div>
  );
}
