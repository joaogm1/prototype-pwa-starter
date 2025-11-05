/**
 * THEME SELECTOR COMPONENT
 * 
 * Seletor de tema com dropdown mostrando as cores disponíveis
 */

import { useTheme, themeColors, themeLabels, ThemeOption } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span 
            className="w-4 h-4 rounded-full border border-gray-300" 
            style={{ backgroundColor: themeColors[theme] }}
          />
          <span>Tema</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {(Object.keys(themeColors) as ThemeOption[]).map((themeOption) => (
          <DropdownMenuItem
            key={themeOption}
            onClick={() => setTheme(themeOption)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span 
              className="w-6 h-6 rounded-full border border-gray-300" 
              style={{ backgroundColor: themeColors[themeOption] }}
            />
            <span className={theme === themeOption ? 'font-semibold' : ''}>
              {themeLabels[themeOption]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
