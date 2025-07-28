import React from 'react';
import { View, Text, Platform } from 'react-native';
import Markdown from 'react-native-markdown-display';
import CodeBlock from './CodeBlock';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useThemeStore } from '@/store/useThemeStore';

interface EnhancedMarkdownProps {
  children: string;
  style?: any;
  allowCodeWrapping?: boolean;
}

export default function EnhancedMarkdown({ children, style, allowCodeWrapping = true }: EnhancedMarkdownProps) {
  const themeColors = useThemeColors();
  const themeMode = useThemeStore((state) => state.mode);

  // Parse markdown content and extract code blocks
  const parseContent = (content: string) => {
    const parts = [];
    let currentIndex = 0;
    
    // Regex to match code blocks (both ``` and indented)
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```|^(    .+)$/gm;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > currentIndex) {
        const textBefore = content.substring(currentIndex, match.index);
        if (textBefore.trim()) {
          parts.push({
            type: 'markdown',
            content: textBefore,
            key: `text-${parts.length}`
          });
        }
      }
      
      // Add code block
      const language = match[1] || 'javascript';
      const code = match[2] || match[3] || '';
      
      parts.push({
        type: 'code',
        content: code.trim(),
        language: language,
        key: `code-${parts.length}`
      });
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < content.length) {
      const remainingText = content.substring(currentIndex);
      if (remainingText.trim()) {
        parts.push({
          type: 'markdown',
          content: remainingText,
          key: `text-${parts.length}`
        });
      }
    }
    
    // If no code blocks found, return original content as markdown
    if (parts.length === 0) {
      parts.push({
        type: 'markdown',
        content: content,
        key: 'text-0'
      });
    }
    
    return parts;
  };

  const defaultStyle = {
    body: { color: themeColors.textSecondary, fontSize: 16, lineHeight: 24 },
    heading1: { color: themeColors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    heading2: { color: themeColors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
    heading3: { color: themeColors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    strong: { color: themeColors.text, fontWeight: 'bold' },
    em: { color: themeColors.textSecondary, fontStyle: 'italic' },
    code_inline: {
      backgroundColor: themeMode === 'dark' ? '#2d2d30' : '#f0f0f0',
      color: themeMode === 'dark' ? '#d4d4d4' : '#333333',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
    },
    list_item: { color: themeColors.textSecondary, marginBottom: 4 },
    bullet_list: { marginBottom: 12 },
    ordered_list: { marginBottom: 12 },
    // Hide default code blocks since we'll render them custom
    code_block: { display: 'none' },
    fence: { display: 'none' }
  };

  const mergedStyle = { ...defaultStyle, ...style };
  const parts = parseContent(children);

  return (
    <View>
      {parts.map((part) => {
        if (part.type === 'code') {
          return (
            <CodeBlock
              key={part.key}
              code={part.content}
              language={part.language}
              size="medium"
              allowWrapping={allowCodeWrapping}
            />
          );
        } else {
          return (
            <Markdown
              key={part.key}
              style={mergedStyle}
            >
              {part.content}
            </Markdown>
          );
        }
      })}
    </View>
  );
}
