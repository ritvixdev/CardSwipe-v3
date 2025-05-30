// Advanced Syntax Highlighting Engine
import { SyntaxTheme, TokenPattern, getJavaScriptTokens } from '@/config/syntaxHighlighting';

export interface Token {
  type: string;
  value: string;
  start: number;
  end: number;
}

export interface HighlightedLine {
  tokens: Token[];
  lineNumber: number;
  content: string;
}

class SyntaxHighlighter {
  private theme: SyntaxTheme;
  private tokens: TokenPattern[];

  constructor(theme: SyntaxTheme, language: string = 'javascript') {
    this.theme = theme;
    this.tokens = this.getTokensForLanguage(language);
  }

  private getTokensForLanguage(language: string): TokenPattern[] {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
      case 'jsx':
      case 'typescript':
      case 'ts':
      case 'tsx':
        return getJavaScriptTokens();
      default:
        return getJavaScriptTokens(); // Default to JavaScript
    }
  }

  public highlightCode(code: string): HighlightedLine[] {
    const lines = code.split('\n');
    return lines.map((line, index) => ({
      tokens: this.tokenizeLine(line),
      lineNumber: index + 1,
      content: line,
    }));
  }

  private tokenizeLine(line: string): Token[] {
    if (!line.trim()) {
      return [{ type: 'text', value: line, start: 0, end: line.length }];
    }

    const tokens: Token[] = [];
    const matches: Array<{ type: string; match: RegExpMatchArray; priority: number }> = [];

    // Find all matches for all token types
    this.tokens.forEach(tokenPattern => {
      let match;
      const regex = new RegExp(tokenPattern.pattern.source, tokenPattern.pattern.flags);
      
      while ((match = regex.exec(line)) !== null) {
        matches.push({
          type: tokenPattern.type,
          match,
          priority: tokenPattern.priority,
        });
        
        // Prevent infinite loop for zero-length matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    });

    // Sort matches by position, then by priority (lower number = higher priority)
    matches.sort((a, b) => {
      if (a.match.index !== b.match.index) {
        return a.match.index - b.match.index;
      }
      return a.priority - b.priority;
    });

    // Resolve overlapping matches (higher priority wins)
    const resolvedMatches: Array<{ type: string; start: number; end: number; value: string }> = [];
    
    for (const match of matches) {
      const start = match.match.index!;
      const end = start + match.match[0].length;
      
      // Check if this match overlaps with any existing match
      const overlaps = resolvedMatches.some(existing => 
        (start < existing.end && end > existing.start)
      );
      
      if (!overlaps) {
        resolvedMatches.push({
          type: match.type,
          start,
          end,
          value: match.match[0],
        });
      }
    }

    // Sort resolved matches by position
    resolvedMatches.sort((a, b) => a.start - b.start);

    // Build final token list with text tokens for gaps
    let currentPos = 0;
    
    for (const match of resolvedMatches) {
      // Add text token for gap before this match
      if (currentPos < match.start) {
        tokens.push({
          type: 'text',
          value: line.substring(currentPos, match.start),
          start: currentPos,
          end: match.start,
        });
      }
      
      // Add the matched token
      tokens.push({
        type: match.type,
        value: match.value,
        start: match.start,
        end: match.end,
      });
      
      currentPos = match.end;
    }
    
    // Add remaining text as text token
    if (currentPos < line.length) {
      tokens.push({
        type: 'text',
        value: line.substring(currentPos),
        start: currentPos,
        end: line.length,
      });
    }

    return tokens;
  }

  public getColorForTokenType(tokenType: string): string {
    switch (tokenType) {
      case 'comment':
        return this.theme.comment;
      case 'keyword':
        return this.theme.keyword;
      case 'string':
        return this.theme.string;
      case 'number':
        return this.theme.number;
      case 'boolean':
        return this.theme.boolean;
      case 'null':
        return this.theme.null;
      case 'operator':
        return this.theme.operator;
      case 'punctuation':
        return this.theme.punctuation;
      case 'function':
        return this.theme.function;
      case 'variable':
        return this.theme.variable;
      case 'property':
        return this.theme.property;
      case 'className':
        return this.theme.className;
      case 'constant':
        return this.theme.constant;
      case 'regex':
        return this.theme.regex;
      case 'escape':
        return this.theme.escape;
      case 'text':
      default:
        return this.theme.foreground;
    }
  }

  public getStyleForTokenType(tokenType: string): { color: string; fontWeight?: string; fontStyle?: string } {
    const color = this.getColorForTokenType(tokenType);
    const style: { color: string; fontWeight?: string; fontStyle?: string } = { color };

    switch (tokenType) {
      case 'keyword':
      case 'boolean':
      case 'null':
        style.fontWeight = 'bold';
        break;
      case 'comment':
        style.fontStyle = 'italic';
        break;
      case 'function':
        style.fontWeight = '600';
        break;
      case 'className':
      case 'constant':
        style.fontWeight = '500';
        break;
    }

    return style;
  }
}

// Factory function to create highlighter
export const createSyntaxHighlighter = (theme: SyntaxTheme, language: string = 'javascript'): SyntaxHighlighter => {
  return new SyntaxHighlighter(theme, language);
};

// Utility function to highlight code quickly
export const highlightCode = (code: string, theme: SyntaxTheme, language: string = 'javascript'): HighlightedLine[] => {
  const highlighter = createSyntaxHighlighter(theme, language);
  return highlighter.highlightCode(code);
};

// Utility function to get token style
export const getTokenStyle = (tokenType: string, theme: SyntaxTheme): { color: string; fontWeight?: string; fontStyle?: string } => {
  const highlighter = createSyntaxHighlighter(theme);
  return highlighter.getStyleForTokenType(tokenType);
};
