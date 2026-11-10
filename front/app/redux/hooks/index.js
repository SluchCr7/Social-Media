/**
 * Central Redux Hooks - Direct application state and mutation hooks
 * All components and pages import directly from here, decoupling completely from Context.
 */

import { useDispatch, useSelector, useStore } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export const useAppStore = () => useStore();

export * from './useAuth';
export * from './useFeedback';
export * from './usePost';
export * from './useComment';
export * from './useMessage';
export * from './useNotification';
export * from './useStory';
export * from './useCommunity';
export * from './useEvent';
export * from './useHighlight';
export * from './useReel';
export * from './useMusic';
export * from '../features/musicPlayer/useMusicPlayer';
export * from './useNews';
export * from './useReport';
export * from './useSearch';
export * from './useExplore';
export * from './useTheme';
export * from './useTranslate';
export * from './useAside';
export * from './useAdmin';
export * from './useUserAdmin';
export * from './useUser';
export * from './useVerify';
export * from './useSocket';
