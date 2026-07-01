import { useState, useRef, useCallback } from 'react';

interface CodeInputProps {
  value: string;
  onChange: (code: string) => void;
  onLoadExample: (code: string) => void;
}

const EXAMPLES: { name: string; code: string }[] = [
  {
    name: 'Bubble Sort',
    code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
  },
  {
    name: 'Recursive Fibonacci',
    code: `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
const result = fibonacci(10);
console.log(result);`,
  },
  {
    name: 'React Component',
    code: `import React, { useState } from 'react';

class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
  }

  get value() {
    return this.count;
  }
}

function App() {
  const [counter] = useState(new Counter());

  const handleClick = async () => {
    try {
      counter.increment();
    } catch (error) {
      throw new Error('Failed to increment');
    }
  };

  return counter.value;
}

export default App;`,
  },
];

export default function CodeInput({ value, onChange, onLoadExample }: CodeInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState(value.split('\n').length || 1);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const code = e.target.value;
      onChange(code);
      setLineCount(code.split('\n').length);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newCode = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newCode);
        // Set cursor position after the inserted tab
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
    },
    [value, onChange]
  );

  return (
    <div className="code-input-container">
      <div className="code-input-header">
        <span className="code-input-title">Code Input</span>
        <div className="example-buttons">
          {EXAMPLES.map((example) => (
            <button
              key={example.name}
              className="example-btn"
              onClick={() => {
                onLoadExample(example.code);
                setLineCount(example.code.split('\n').length);
              }}
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>
      <div className="code-editor">
        <div className="line-numbers">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="line-number">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="// Paste or type your code here..."
          rows={Math.max(10, lineCount)}
        />
      </div>
    </div>
  );
}
