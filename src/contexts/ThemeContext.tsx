/**
 * THEME CONTEXT
 * 
 * Contexto global para gerenciar temas de cores do aplicativo.
 * 6 opções de temas: Rosa, Lilás, Salmão, Azul, Amarelo, Verde
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeOption = 'rosa' | 'lilas' | 'salmao' | 'azul' | 'amarelo' | 'verde';

export const themeColors = {
  rosa: '#EEC1D8',
  lilas: '#C6B3FA',
  salmao: '#F1C6A4',
  azul: '#B2D5DE',
  amarelo: '#FFF4AC',
  verde: '#B2DECD',
};

export const themeLabels = {
  rosa: 'Rosa',
  lilas: 'Lilás',
  salmao: 'Salmão',
  azul: 'Azul',
  amarelo: 'Amarelo',
  verde: 'Verde',
};

interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeOption>(() => {
    // Carrega tema salvo no localStorage
    const savedTheme = localStorage.getItem('app-theme') as ThemeOption;
    return savedTheme || 'rosa'; // Tema padrão: rosa
  });

  const setTheme = (newTheme: ThemeOption) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    
    // Aplica a classe do tema no elemento HTML
    const htmlElement = document.documentElement;
    // Remove todas as classes de tema anteriores
    htmlElement.classList.remove('theme-rosa', 'theme-lilas', 'theme-salmao', 'theme-azul', 'theme-amarelo', 'theme-verde');
    // Adiciona a nova classe de tema
    htmlElement.classList.add(`theme-${newTheme}`);
  };

  useEffect(() => {
    // Aplica o tema inicial
    const htmlElement = document.documentElement;
    htmlElement.classList.add(`theme-${theme}`);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
