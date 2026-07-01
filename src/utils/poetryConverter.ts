import type { Poem, PoemLine, PoemStyle, Token } from '../types';
import { tokenize } from './codeParser';

const KEYWORD_MAP: Record<string, string> = {
  'function': '如是我闻',
  'return': '归来',
  'if': '倘若',
  'else': '若非',
  'const': '恒久',
  'let': '暂寄',
  'var': '无常',
  'for': '轮回',
  'while': '守望',
  'class': '万类',
  'import': '借取',
  'export': '馈赠',
  'await': '静候',
  'async': '远行',
  'try': '涉险',
  'catch': '逢难',
  'throw': '掷出',
  'break': '断弦',
  'continue': '续章',
  'switch': '择途',
  'case': '若此',
  'default': '常道',
  'new': '新生',
  'this': '此身',
  'true': '真言',
  'false': '虚妄',
  'null': '空寂',
  'undefined': '未名',
  'extends': '承袭',
  'super': '先灵',
  'static': '静立',
  'get': '取之',
  'set': '置之',
  'yield': '成就',
  'typeof': '辨形',
  'instanceof': '溯本',
};

const POETIC_COMMENTS = [
  '/* 思绪如代码般流淌 */',
  '/* 在逻辑的星空下 */',
  '/* 代码即诗篇 */',
  '/* 二进制中藏着永恒 */',
  '/* 每一次循环都是轮回 */',
  '/* 函数即是禅意 */',
  '/* 在递归中寻找自我 */',
  '/* 语法树开出智慧之花 */',
];

function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? Math.floor(match[1].length / 2) : 0;
}

function replaceKeywords(line: string): string {
  return line.replace(/\b(function|return|if|else|const|let|var|for|while|class|import|export|await|async|try|catch|throw|break|continue|switch|case|default|new|this|true|false|null|undefined|extends|super|static|get|set|yield|typeof|instanceof)\b/g, (match) => {
    return KEYWORD_MAP[match] || match;
  });
}

function countSyllables(text: string): number {
  // Chinese characters each count as one syllable
  let count = 0;
  for (const ch of text) {
    if (/[一-鿿]/.test(ch)) {
      count++;
    } else if (/[a-zA-Z]/.test(ch)) {
      count++;
    }
  }
  return count;
}

function convertFreeverse(lines: string[], _tokens: Token[]): PoemLine[] {
  const poemLines: PoemLine[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const indentLevel = getIndentLevel(line);
    const poetic = replaceKeywords(line.trim());
    const hasContent = line.trim().length > 0;

    poemLines.push({
      original: line,
      poetic: hasContent ? poetic : '',
      lineNumber: i + 1,
      indentLevel,
    });

    // Add poetic commentary every few lines
    if (hasContent && (i + 1) % 5 === 0) {
      const commentIndex = Math.floor(i / 5) % POETIC_COMMENTS.length;
      poemLines.push({
        original: '',
        poetic: `  ${POETIC_COMMENTS[commentIndex]}`,
        lineNumber: i + 1,
        indentLevel: indentLevel + 1,
      });
    }
  }

  return poemLines;
}

function generateHaikuLines(_lines: string[], tokens: Token[]): PoemLine[] {
  const keywords = tokens.filter(t => t.type === 'keyword');

  const keywordTerms = keywords.map(k => KEYWORD_MAP[k.value] || k.value);
  const uniqueTerms = [...new Set(keywordTerms)];

  // Chinese characters are one syllable each
  function chunkWords(words: string[], targetSyllables: number): string {
    const result: string[] = [];
    let currentSyllables = 0;
    for (const w of words) {
      const s = countSyllables(w);
      if (currentSyllables + s <= targetSyllables) {
        result.push(w);
        currentSyllables += s;
      } else {
        break;
      }
    }
    return result.join(' ');
  }

  const line1Words = uniqueTerms.slice(0, Math.ceil(uniqueTerms.length / 3));
  const line2Words = uniqueTerms.slice(Math.ceil(uniqueTerms.length / 3), Math.ceil(2 * uniqueTerms.length / 3));
  const line3Words = uniqueTerms.slice(Math.ceil(2 * uniqueTerms.length / 3));

  // 5-7-5 syllable pattern
  const line1 = chunkWords(line1Words, 5) || '代码无声息';
  const line2 = chunkWords(line2Words, 7) || '逻辑在暗中流转成诗';
  const line3 = chunkWords(line3Words, 5) || '永恒一瞬间';

  return [
    { original: '', poetic: line1, lineNumber: 1, indentLevel: 0 },
    { original: '', poetic: line2, lineNumber: 2, indentLevel: 0 },
    { original: '', poetic: line3, lineNumber: 3, indentLevel: 0 },
  ];
}

function generateSonnetLines(_lines: string[], tokens: Token[]): PoemLine[] {
  const keywords = tokens.filter(t => t.type === 'keyword');
  const uniqueKeywords = new Map<string, number>();
  for (const k of keywords) {
    if (k.type === 'keyword') {
      uniqueKeywords.set(k.value, (uniqueKeywords.get(k.value) || 0) + 1);
    }
  }

  const sonnetLines: PoemLine[] = [];
  const keywordEntries = Array.from(uniqueKeywords.entries());
  const totalLines = 14;

  for (let i = 0; i < totalLines; i++) {
    if (i < keywordEntries.length) {
      const [kw, count] = keywordEntries[i];
      const poetic = KEYWORD_MAP[kw] || kw;
      const embellishments = [
        '于无声处',
        '在光影间',
        '似水流年',
        '如梦幻影',
        '若星辰落',
        '随风云起',
        '承天地气',
        '化万物形',
        '照千年路',
        '渡彼岸花',
        '见真如境',
        '得大自在',
        '归本源处',
        '证涅槃心',
      ];
      sonnetLines.push({
        original: '',
        poetic: `${poetic} ${embellishments[i % embellishments.length]}    // ${kw}: 出现${count}次`,
        lineNumber: i + 1,
        indentLevel: 0,
      });
    } else {
      const fillers = [
        '空行亦是代码之禅意',
        '空白处藏着无尽玄机',
        '静默之中逻辑在流转',
      ];
      sonnetLines.push({
        original: '',
        poetic: fillers[(i - keywordEntries.length) % fillers.length],
        lineNumber: i + 1,
        indentLevel: 0,
      });
    }
  }

  return sonnetLines;
}

export function convertCodeToPoetry(code: string, style: PoemStyle): Poem {
  const tokens = tokenize(code);
  const lines = code.split('\n');

  const keywordsFound = tokens.filter(t => t.type === 'keyword').length;
  const functionsFound = tokens.filter(
    t => t.type === 'keyword' && (t.value === 'function' || t.value === '=>' || t.value === 'async')
  ).length;

  let poemLines: PoemLine[];

  switch (style) {
    case 'haiku':
      poemLines = generateHaikuLines(lines, tokens);
      break;
    case 'sonnet':
      poemLines = generateSonnetLines(lines, tokens);
      break;
    case 'freeverse':
    default:
      poemLines = convertFreeverse(lines, tokens);
      break;
  }

  const title = generatePoemTitle(code);

  return {
    title,
    lines: poemLines,
    style,
    metadata: {
      originalLines: lines.length,
      keywordsFound,
      functionsFound,
    },
  };
}

export function generatePoemTitle(code: string): string {
  const tokens = tokenize(code);
  const keywords = tokens.filter(t => t.type === 'keyword').slice(0, 5);
  const identifiers = tokens.filter(t => t.type === 'identifier' && t.value.length > 1).slice(0, 3);

  const titlePrefixes = [
    '代码颂',
    '算法吟',
    '逻辑赋',
    '函数诗',
    '程序诔',
    '变量歌',
    '循环辞',
    '递归曲',
  ];

  const prefix = titlePrefixes[Math.floor(keywords.length) % titlePrefixes.length];

  if (identifiers.length > 0) {
    return `${prefix}·${identifiers.map(i => i.value).join('')}`;
  }

  if (keywords.length > 0) {
    const kwNames = keywords.map(k => KEYWORD_MAP[k.value] || k.value);
    return `${prefix}·${kwNames.slice(0, 3).join('')}`;
  }

  return `${prefix}·无名`;
}
