import React from 'react';
import { ScrollView, StyleSheet, View, Platform, Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { syntaxConfig, getDefaultTheme, getFontSize, getBackgroundColor, shouldShowLineNumbers, getLineNumberColor } from '@/config/syntaxHighlighting';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  style?: any;
  theme?: 'dark' | 'light' | 'vs2015' | 'dracula' | 'monokai';
  size?: 'small' | 'medium' | 'large';
}

// Simple but effective JavaScript syntax highlighting
const highlightJavaScript = (code: string) => {
  const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'super', 'extends', 'static'];

  let highlightedCode = code;

  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    highlightedCode = highlightedCode.replace(regex, `<keyword>${keyword}</keyword>`);
  });

  // Highlight strings
  highlightedCode = highlightedCode.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<string>$1$2$1</string>');

  // Highlight numbers
  highlightedCode = highlightedCode.replace(/\b\d+\.?\d*\b/g, '<number>$&</number>');

  // Highlight comments
  highlightedCode = highlightedCode.replace(/\/\/.*$/gm, '<comment>$&</comment>');
  highlightedCode = highlightedCode.replace(/\/\*[\s\S]*?\*\//g, '<comment>$&</comment>');

  return highlightedCode;
};

const renderHighlightedText = (text: string, themeColors: any) => {
  const colors = {
    keyword: '#569cd6',    // VS Code blue
    string: '#ce9178',     // VS Code orange
    number: '#b5cea8',     // VS Code light green
    comment: '#6a9955',    // VS Code green
    default: '#d4d4d4',    // VS Code light gray
  };

  const parts = text.split(/(<\w+>.*?<\/\w+>)/g);

  return parts.map((part, index) => {
    if (part.startsWith('<keyword>')) {
      const content = part.replace(/<\/?keyword>/g, '');
      return <Text key={index} style={{ color: colors.keyword, fontWeight: 'bold' }}>{content}</Text>;
    } else if (part.startsWith('<string>')) {
      const content = part.replace(/<\/?string>/g, '');
      return <Text key={index} style={{ color: colors.string }}>{content}</Text>;
    } else if (part.startsWith('<number>')) {
      const content = part.replace(/<\/?number>/g, '');
      return <Text key={index} style={{ color: colors.number }}>{content}</Text>;
    } else if (part.startsWith('<comment>')) {
      const content = part.replace(/<\/?comment>/g, '');
      return <Text key={index} style={{ color: colors.comment, fontStyle: 'italic' }}>{content}</Text>;
    } else {
      return <Text key={index} style={{ color: colors.default }}>{part}</Text>;
    }
  });
};

export default function CodeBlock({
  code,
  language = 'javascript',
  showLineNumbers = shouldShowLineNumbers(),
  style,
  theme = getDefaultTheme(),
  size = 'medium'
}: CodeBlockProps) {
  // Get font family for current platform
  const getFontFamily = () => {
    if (Platform.OS === 'ios') return 'Menlo';
    if (Platform.OS === 'android') return 'monospace';
    return 'Consolas, Monaco, "Courier New", monospace';
  };

  const fontSize = getFontSize(size);
  const backgroundColor = getBackgroundColor();
  const lineNumberColor = getLineNumberColor();
  const themeColors = useThemeColors();

  const lines = code.split('\n');
  const highlightedCode = language === 'javascript' ? highlightJavaScript(code) : code;
  const highlightedLines = highlightedCode.split('\n');

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: backgroundColor,
        borderRadius: syntaxConfig.borderRadius,
        elevation: syntaxConfig.shadow.enabled ? syntaxConfig.shadow.elevation : 0,
        shadowOpacity: syntaxConfig.shadow.enabled ? syntaxConfig.shadow.shadowOpacity : 0,
      }
    ]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[
          styles.codeContent,
          {
            padding: syntaxConfig.padding,
          }
        ]}>
          {showLineNumbers && (
            <View style={styles.lineNumbers}>
              {lines.map((_, index) => (
                <Text
                  key={index}
                  style={[
                    styles.lineNumber,
                    {
                      color: lineNumberColor,
                      fontFamily: getFontFamily(),
                      fontSize: fontSize - 1,
                      lineHeight: fontSize * 1.5,
                    }
                  ]}
                >
                  {index + 1}
                </Text>
              ))}
            </View>
          )}
          <View style={styles.codeLines}>
            {highlightedLines.map((line, index) => (
              <Text
                key={index}
                style={[
                  styles.codeLine,
                  {
                    fontFamily: getFontFamily(),
                    fontSize: fontSize,
                    lineHeight: fontSize * 1.5,
                  },
                  style
                ]}
              >
                {renderHighlightedText(line, themeColors)}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    minWidth: '100%',
  },
  codeContent: {
    flexDirection: 'row',
    minHeight: 40,
  },
  lineNumbers: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(128, 128, 128, 0.2)',
    marginRight: 12,
  },
  lineNumber: {
    textAlign: 'right',
    minWidth: 24,
  },
  codeLines: {
    flex: 1,
  },
  codeLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
