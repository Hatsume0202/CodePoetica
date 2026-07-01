import type { Token, TokenType, ASTNode } from '../types';

const KEYWORDS = new Set([
  'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return',
  'class', 'import', 'export', 'await', 'async', 'try', 'catch', 'throw',
  'break', 'continue', 'switch', 'case', 'default', 'new', 'this', 'true',
  'false', 'null', 'undefined', 'typeof', 'instanceof', 'extends', 'super',
  'yield', 'static', 'get', 'set', 'from', 'of', 'as', 'in', 'do',
]);

const OPERATORS = new Set([
  '+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==', '>', '<', '>=', '<=',
  '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '>>>', '+=', '-=', '*=',
  '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>>=', '++', '--', '=>', '...',
  '?.', '??', '?', ':',
]);

const PUNCTUATION = new Set([
  '(', ')', '{', '}', '[', ']', ',', ';', '.', '...', '?', ':',
]);

function isLetter(ch: string): boolean {
  return /[a-zA-Z_$]/.test(ch);
}

function isDigit(ch: string): boolean {
  return /[0-9]/.test(ch);
}

function isAlphanumeric(ch: string): boolean {
  return isLetter(ch) || isDigit(ch);
}

function tokenTypeForKeyword(value: string): TokenType | null {
  if (KEYWORDS.has(value)) return 'keyword';
  if (value === 'true' || value === 'false' || value === 'null' || value === 'undefined') return 'keyword';
  return null;
}

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let column = 1;

  function advance(): string {
    const ch = code[i];
    if (ch === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
    i++;
    return ch;
  }

  function peek(): string {
    return code[i] ?? '';
  }

  function peekAhead(n: number): string {
    return code[i + n] ?? '';
  }

  function addToken(type: TokenType, value: string, startLine: number, startColumn: number): void {
    tokens.push({ type, value, line: startLine, column: startColumn });
  }

  while (i < code.length) {
    const ch = code[i];
    const startLine = line;
    const startColumn = column;

    // Whitespace (spaces/tabs only, newline handled separately)
    if (ch === ' ' || ch === '\t') {
      let ws = '';
      while (i < code.length && (code[i] === ' ' || code[i] === '\t')) {
        ws += advance();
      }
      addToken('whitespace', ws, startLine, startColumn);
      continue;
    }

    // Newline
    if (ch === '\n') {
      advance();
      addToken('whitespace', '\n', startLine, startColumn);
      continue;
    }

    // Single-line comment
    if (ch === '/' && peekAhead(0) === '/') {
      let comment = '';
      while (i < code.length && code[i] !== '\n') {
        comment += advance();
      }
      addToken('comment', comment, startLine, startColumn);
      continue;
    }

    // Multi-line comment
    if (ch === '/' && peekAhead(0) === '*') {
      let comment = '';
      comment += advance(); // /
      comment += advance(); // *
      while (i < code.length) {
        if (code[i] === '*' && peekAhead(0) === '/') {
          comment += advance(); // *
          comment += advance(); // /
          break;
        }
        comment += advance();
      }
      addToken('comment', comment, startLine, startColumn);
      continue;
    }

    // Template string
    if (ch === '`') {
      let str = advance(); // opening `
      while (i < code.length && code[i] !== '`') {
        if (code[i] === '\\') {
          str += advance();
        }
        str += advance();
      }
      if (i < code.length) str += advance(); // closing `
      addToken('string', str, startLine, startColumn);
      continue;
    }

    // String literals
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let str = advance(); // opening quote
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') {
          str += advance();
        }
        str += advance();
      }
      if (i < code.length) str += advance(); // closing quote
      addToken('string', str, startLine, startColumn);
      continue;
    }

    // Numbers
    if (isDigit(ch) || (ch === '.' && isDigit(peek()))) {
      let num = '';
      while (i < code.length && (isAlphanumeric(code[i]) || code[i] === '.')) {
        num += advance();
      }
      addToken('number', num, startLine, startColumn);
      continue;
    }

    // Operators (check multi-char first)
    const threeChar = code.slice(i, i + 3);
    if (OPERATORS.has(threeChar)) {
      addToken('operator', threeChar, startLine, startColumn);
      advance(); advance(); advance();
      continue;
    }
    const twoChar = code.slice(i, i + 2);
    if (OPERATORS.has(twoChar)) {
      addToken('operator', twoChar, startLine, startColumn);
      advance(); advance();
      continue;
    }
    if (OPERATORS.has(ch)) {
      addToken('operator', ch, startLine, startColumn);
      advance();
      continue;
    }

    // Punctuation
    if (PUNCTUATION.has(ch)) {
      advance();
      addToken('punctuation', ch, startLine, startColumn);
      continue;
    }

    // Identifiers and keywords
    if (isLetter(ch)) {
      let ident = '';
      while (i < code.length && isAlphanumeric(code[i])) {
        ident += advance();
      }
      const kwType = tokenTypeForKeyword(ident);
      addToken(kwType ?? 'identifier', ident, startLine, startColumn);
      continue;
    }

    // Unknown character — treat as punctuation
    advance();
    addToken('punctuation', ch, startLine, startColumn);
  }

  return tokens;
}

export function buildAST(tokens: Token[]): ASTNode {
  const root: ASTNode = {
    name: 'program',
    type: 'keyword',
    children: [],
  };

  let current: ASTNode = root;
  const stack: ASTNode[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type === 'whitespace' || token.type === 'comment') {
      i++;
      continue;
    }

    if (token.type === 'keyword') {
      const node: ASTNode = {
        name: token.value,
        type: token.type,
        children: [],
      };

      if (token.value === 'function') {
        // Look ahead for function name
        let j = i + 1;
        while (j < tokens.length && (tokens[j].type === 'whitespace' || tokens[j].type === 'comment')) {
          j++;
        }
        if (j < tokens.length && tokens[j].type === 'identifier') {
          node.name = tokens[j].value;
        }
        current.children.push(node);
      } else if (token.value === 'class') {
        let j = i + 1;
        while (j < tokens.length && (tokens[j].type === 'whitespace' || tokens[j].type === 'comment')) {
          j++;
        }
        if (j < tokens.length && tokens[j].type === 'identifier') {
          node.name = tokens[j].value;
        }
        current.children.push(node);
      } else if (token.value === 'const' || token.value === 'let' || token.value === 'var') {
        let j = i + 1;
        while (j < tokens.length && (tokens[j].type === 'whitespace' || tokens[j].type === 'comment')) {
          j++;
        }
        if (j < tokens.length && tokens[j].type === 'identifier') {
          node.name = tokens[j].value;
        }
        current.children.push(node);
      } else if (token.value === 'if' || token.value === 'while' || token.value === 'for' ||
                 token.value === 'try' || token.value === 'switch') {
        current.children.push(node);
      } else if (token.value === 'return') {
        current.children.push(node);
      } else if (token.value === 'import' || token.value === 'export') {
        current.children.push(node);
      } else {
        current.children.push(node);
      }

      if (token.value === '{') {
        // Not a keyword but push context — handle in punctuation
      }
    } else if (token.type === 'punctuation') {
      if (token.value === '{') {
        if (current.children.length > 0) {
          stack.push(current);
          current = current.children[current.children.length - 1];
        }
      } else if (token.value === '}') {
        if (stack.length > 0) {
          current = stack.pop()!;
        }
      }
    }

    i++;
  }

  return root;
}
