import { createContext } from 'react';

interface Notification {
  isShow: boolean,
  text: string | null,
}

interface NotificationContextProps {
  notification: Notification
  updateNotification: (prev: any) => void,
};

export const NotificationContext = createContext<NotificationContextProps>({
  notification: {
    isShow: false,
    text: null,
  },
  updateNotification: () => {},
});