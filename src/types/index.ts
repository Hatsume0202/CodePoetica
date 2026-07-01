export type PoemStyle = 'freeverse' | 'haiku' | 'sonnet';
export type ColorTheme = 'dark' | 'light' | 'cyberpunk' | 'nature';
export type TabId = 'converter' | 'steganography' | 'visualization';
export type TokenType = 'keyword' | 'identifier' | 'string' | 'number' | 'operator' | 'punctuation' | 'comment' | 'whitespace';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface PoemLine {
  original: string;
  poetic: string;
  lineNumber: number;
  indentLevel: number;
}

export interface Poem {
  title: string;
  lines: PoemLine[];
  style: PoemStyle;
  metadata: {
    originalLines: number;
    keywordsFound: number;
    functionsFound: number;
  };
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export interface ASTNode {
  name: string;
  type: TokenType;
  children: ASTNode[];
  x?: number;
  y?: number;
  targetX?: number;
  targetY?: number;
}

export interface ControlSettings {
  poemStyle: PoemStyle;
  steganographyEnabled: boolean;
  steganographyStrength: number;
  animationSpeed: number;
  colorTheme: ColorTheme;
  showParticles: boolean;
}
