import { createContext } from 'react';
import { Noop } from '../types/inbox';

export interface NotificationInterface {
  isShow: boolean,
  text: string | null,
}

export interface NotificationContextProps {
  notification: NotificationInterface,
  updateNotification: (prev: Noop<NotificationInterface>) => void,
};

export const NotificationContext = createContext<NotificationContextProps>({
  notification: {
    isShow: false,
    text: null,
  },
  updateNotification: () => ({
    isShow: false,
    text: null,
  }),
});