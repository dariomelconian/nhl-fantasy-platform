// NHL Fantasy Platform Design System
export const theme = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe', 
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main blue
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    ice: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0', 
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    nhl: {
      red: '#c8102e',
      blue: '#003087', 
      gold: '#ffb81c',
      silver: '#a2aaad',
      black: '#000000',
      white: '#ffffff',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    }
  },
  
  gradients: {
    ice: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    rink: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    dark: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    nhlRed: 'linear-gradient(135deg, #c8102e 0%, #991b1b 100%)',
    gold: 'linear-gradient(135deg, #ffb81c 0%, #f59e0b 100%)',
  },
  
  shadows: {
    ice: '0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06)',
    puck: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    rink: '0 20px 25px -5px rgba(14, 165, 233, 0.1), 0 10px 10px -5px rgba(14, 165, 233, 0.04)',
    goal: '0 0 0 1px rgba(14, 165, 233, 0.05), 0 1px 0 0 rgba(14, 165, 233, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  },
  
  animations: {
    puckSlide: 'puckSlide 0.3s ease-out',
    iceShimmer: 'iceShimmer 2s ease-in-out infinite',
    goalCelebration: 'goalCelebration 0.6s ease-out',
    skateGlide: 'skateGlide 0.4s ease-in-out',
  },
  
  spacing: {
    rink: {
      padding: '2rem',
      margin: '1.5rem',
      gap: '1rem',
    },
    zone: {
      padding: '1.5rem',
      margin: '1rem', 
      gap: '0.75rem',
    }
  },
  
  typography: {
    fonts: {
      heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    },
    sizes: {
      hero: '3.5rem',      // 56px
      title: '2.25rem',    // 36px  
      heading: '1.875rem', // 30px
      subheading: '1.5rem', // 24px
      body: '1rem',        // 16px
      small: '0.875rem',   // 14px
      tiny: '0.75rem',     // 12px
    }
  },

  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

// CSS Custom Properties for dynamic theming
export const cssVariables = `
  :root {
    --color-primary-50: ${theme.colors.primary[50]};
    --color-primary-500: ${theme.colors.primary[500]};
    --color-primary-600: ${theme.colors.primary[600]};
    --color-primary-700: ${theme.colors.primary[700]};
    
    --color-ice-100: ${theme.colors.ice[100]};
    --color-ice-200: ${theme.colors.ice[200]};
    --color-ice-800: ${theme.colors.ice[800]};
    --color-ice-900: ${theme.colors.ice[900]};
    
    --gradient-ice: ${theme.gradients.ice};
    --gradient-rink: ${theme.gradients.rink};
    --gradient-primary: ${theme.gradients.primary};
    
    --shadow-ice: ${theme.shadows.ice};
    --shadow-puck: ${theme.shadows.puck};
    --shadow-rink: ${theme.shadows.rink};
  }
  
  @keyframes puckSlide {
    0% { transform: translateX(-10px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes iceShimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  @keyframes goalCelebration {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes skateGlide {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-2px); }
    100% { transform: translateY(0px); }
  }
`;

export default theme;