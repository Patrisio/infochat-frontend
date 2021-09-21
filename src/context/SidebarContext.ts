import { createContext, Dispatch, SetStateAction } from 'react';

export interface SidebarInterface {
  [key: string]: string | null,

  dialogs: string | null,
  channel: string | null,
  assigned: string | null,
}

export interface SidebarContextProps {
  sidebar: SidebarInterface,
  updateSidebar: Dispatch<SetStateAction<SidebarInterface>>,
};

export const SidebarContext = createContext<SidebarContextProps>({
  sidebar: {
    dialogs: null,
    channel: null,
    assigned: null,
  },
  updateSidebar: () => ({
    dialogs: null,
    channels: null,
    assigned: null,
  }),
});