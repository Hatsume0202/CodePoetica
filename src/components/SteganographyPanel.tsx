import { useState, useCallback } from 'react';
import type { Poem } from '../types';
import { encodeMessage, decodeMessage, encodeInComments, getStegStats } from '../utils/steganography';

interface SteganographyPanelProps {
  poem: Poem | null;
  code: string;
  onEncodedPoem: (encoded: string) => void;
}

export default function SteganographyPanel({ poem, code, onEncodedPoem }: SteganographyPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'encode' | 'decode'>('encode');
  const [secretMessage, setSecretMessage] = useState('');
  const [encodedResult, setEncodedResult] = useState('');
  const [decodeInput, setDecodeInput] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [stats, setStats] = useState<{ capacity: number; used: number; visibleDiff: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEncode = useCallback(() => {
    if (!secretMessage.trim()) return;

    let text: string;
    if (poem) {
      const poemText = poem.lines.map(l => l.poetic).filter(Boolean).join('\n');
      text = encodeMessage(poemText, secretMessage);
      setEncodedResult(text);
      setStats(getStegStats(poemText, text));
    } else if (code.trim()) {
      text = encodeInComments(code, secretMessage);
      setEncodedResult(text);
      setStats({ capacity: code.length, used: secretMessage.length, visibleDiff: true });
    } else {
      text = encodeMessage('CodePoetica — Where Code Becomes Poetry', secretMessage);
      setEncodedResult(text);
      setStats(getStegStats('CodePoetica — Where Code Becomes Poetry', text));
    }

    onEncodedPoem(text);
  }, [secretMessage, poem, code, onEncodedPoem]);

  const handleDecode = useCallback(() => {
    const input = decodeInput.trim();
    if (!input) return;

    // Try zero-width decoding first
    let result = decodeMessage(input);

    // If no zero-width message found, try extracting from comments
    if (!result) {
      const commentLines = input.split('\n').filter(l => l.trim().startsWith('//'));
      if (commentLines.length > 0) {
        result = commentLines
          .map(l => l.replace(/^\/\/\s*/, '').trim())
          .join(' ');
      }
    }

    setDecodedMessage(result || '(No hidden message found)');
  }, [decodeInput]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(encodedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const renderHighlighted = (text: string) => {
    if (!text) return null;
    const zwChars = ['​', '‌', '‍', '﻿'];
    return text.split('').map((ch, i) => {
      if (zwChars.includes(ch)) {
        return (
          <span key={i} className="zw-char-highlight" title={`U+${ch.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`}>
            ⬤
          </span>
        );
      }
      return <span key={i}>{ch}</span>;
    });
  };

  return (
    <div className="steganography-container">
      <div className="steg-tabs">
        <button
          className={`steg-tab ${activeSubTab === 'encode' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('encode')}
        >
          Encode
        </button>
        <button
          className={`steg-tab ${activeSubTab === 'decode' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('decode')}
        >
          Decode
        </button>
      </div>

      {activeSubTab === 'encode' && (
        <div className="steg-panel">
          <label className="steg-label">Secret Message</label>
          <textarea
            className="steg-textarea"
            value={secretMessage}
            onChange={e => setSecretMessage(e.target.value)}
            placeholder="Enter the secret message to hide in your poetry..."
            rows={4}
          />
          <button className="steg-btn primary" onClick={handleEncode} disabled={!secretMessage.trim()}>
            🔒 Encode Message
          </button>

          {encodedResult && (
            <div className="steg-result">
              <div className="steg-result-header">
                <span>Encoded Result</span>
                <button className="steg-btn small" onClick={handleCopy}>
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="steg-result-content">
                {renderHighlighted(encodedResult)}
              </div>
              {stats && (
                <div className="steg-stats">
                  <div className="stat-item">
                    <span>Capacity</span>
                    <strong>{stats.capacity} bytes</strong>
                  </div>
                  <div className="stat-item">
                    <span>Used</span>
                    <strong>{stats.used} bytes</strong>
                  </div>
                  <div className="stat-item">
                    <span>Visible Diff</span>
                    <strong>{stats.visibleDiff ? 'Yes' : 'No'}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'decode' && (
        <div className="steg-panel">
          <label className="steg-label">Paste Encoded Text</label>
          <textarea
            className="steg-textarea"
            value={decodeInput}
            onChange={e => setDecodeInput(e.target.value)}
            placeholder="Paste poetry or code that may contain hidden messages..."
            rows={8}
          />
          <button className="steg-btn primary" onClick={handleDecode} disabled={!decodeInput.trim()}>
            🔓 Decode Message
          </button>

          {decodedMessage && (
            <div className="steg-result">
              <div className="steg-result-header">Decoded Message</div>
              <div className="steg-decoded-content">{decodedMessage}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
