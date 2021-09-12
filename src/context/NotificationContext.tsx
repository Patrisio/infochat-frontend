import { createContext, Dispatch, SetStateAction } from 'react';

export interface NotificationInterface {
  isShow: boolean,
  text: string | null,
}

export interface NotificationContextProps {
  notification: NotificationInterface,
  updateNotification: Dispatch<SetStateAction<NotificationInterface>>,
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