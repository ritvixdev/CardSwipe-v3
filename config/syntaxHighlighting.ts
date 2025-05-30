// Centralized Syntax Highlighting Configuration
// All syntax highlighting styles and rules are managed from this single file

export type SyntaxThemeType = 'dark' | 'light' | 'vs2015' | 'dracula' | 'monokai';

export interface CodeBlockConfig {
  // Default theme selection
  defaultTheme: SyntaxThemeType;

  // Font settings
  fontSizes: {
    small: number;
    medium: number;
    large: number;
  };

  // Background settings
  backgroundColor: string;

  // Line number settings
  lineNumbers: {
    enabled: boolean;
    color: string;
  };

  // Border and spacing
  borderRadius: number;
  padding: number;

  // Shadow settings
  shadow: {
    enabled: boolean;
    elevation: number;
    shadowOpacity: number;
  };
}

// ===== SYNTAX HIGHLIGHTING CONFIGURATION =====
// Change these settings to customize the code block appearance globally

export const syntaxConfig: CodeBlockConfig = {
  // 🎨 THEME SELECTION - Change this to switch themes globally
  defaultTheme: 'dark', // Options: 'dark', 'light', 'vs2015', 'dracula', 'monokai'

  // 📏 FONT SIZES - Adjust these to change code text sizes
  fontSizes: {
    small: 11,   // For code previews in cards
    medium: 13,  // For detail pages
    large: 15,   // For emphasis
  },

  // 🖤 BACKGROUND - Always black for professional look
  backgroundColor: '#1e1e1e', // Dark VS Code background

  // 🔢 LINE NUMBERS
  lineNumbers: {
    enabled: true,        // Show line numbers by default
    color: '#858585',     // Gray color for line numbers
  },

  // 🎨 STYLING
  borderRadius: 12,       // Rounded corners
  padding: 16,           // Internal padding

  // ✨ SHADOW EFFECTS
  shadow: {
    enabled: true,        // Enable shadow for depth
    elevation: 3,         // Android elevation
    shadowOpacity: 0.25,  // iOS shadow opacity
  },
};

// ===== THEME DESCRIPTIONS =====
// 'dark'     - VS Code Dark+ (blue keywords, orange strings)
// 'light'    - VS Code Light+ (blue keywords, red strings)
// 'vs2015'   - Visual Studio 2015 Dark (purple keywords)
// 'dracula'  - Dracula theme (pink keywords, green strings)
// 'monokai'  - Monokai theme (pink keywords, yellow strings)

// ===== HOW TO CUSTOMIZE =====
// 1. Change defaultTheme above to switch color schemes
// 2. Adjust fontSizes for different text sizes
// 3. Modify backgroundColor for different backgrounds
// 4. Toggle lineNumbers.enabled to show/hide line numbers
// 5. Adjust shadow settings for visual effects

// ===== UTILITY FUNCTIONS =====
// Helper functions to get configuration values

export const getDefaultTheme = (): SyntaxThemeType => {
  return syntaxConfig.defaultTheme;
};

export const getFontSize = (size: 'small' | 'medium' | 'large'): number => {
  return syntaxConfig.fontSizes[size];
};

export const getBackgroundColor = (): string => {
  return syntaxConfig.backgroundColor;
};

export const shouldShowLineNumbers = (): boolean => {
  return syntaxConfig.lineNumbers.enabled;
};

export const getLineNumberColor = (): string => {
  return syntaxConfig.lineNumbers.color;
};
