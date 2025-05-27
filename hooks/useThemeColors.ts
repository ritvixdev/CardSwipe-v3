import { useThemeStore } from '@/store/useThemeStore';
import { colors } from '@/constants/colors';

export function useThemeColors() {
  const mode = useThemeStore((state) => state.mode);
  return colors[mode];
}