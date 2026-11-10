'use client';

import { useMemo } from 'react';
import { getSocket } from '../features/socket/socketManager';



export const useSocket = () => {
  const socket = useMemo(() => {
    return getSocket();
  }, []);

  return { socket };
};

export default useSocket;
