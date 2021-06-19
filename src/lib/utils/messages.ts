import { State } from "../../reducers/inbox";

interface IMessagesHistory {
  message: string,
  clientId: string,
  username: string
}

type MessagesStatus = 'unread' | 'assigned' | 'opened' | 'closed';

interface IIncomingMessage {
  id: string,
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  assignedTo: string | null,
  avatarName: string,
  avatarColor: string,
  email: string,
  phone: string,
  messagesStatus: MessagesStatus,
}

export function getAllInboxMessages(incomingMessages: State['incomingMessages'], currentUser: any): any {
  const unreadClientIds: any = [];
  const unreadCount = incomingMessages.filter((msg) => {
    if (msg.messagesStatus === 'unread') {
      unreadClientIds.push(msg);
      return true;
    }
  }).length;

  const openedClientIds: any = [];
  const openedCount = incomingMessages.filter((msg) => {
    if (msg.messagesStatus === 'opened') {
      openedClientIds.push(msg);
      return true;
    }
  }).length;

  const closedClientIds: any = [];
  const closedCount = incomingMessages.filter((msg) => {
    if (msg.messagesStatus === 'closed') {
      closedClientIds.push(msg);
      return true;
    }
  }).length;

  const assignedClientIds: any = [];
  const assignedCount = incomingMessages.filter((msg) => {
    if (msg.assignedTo === currentUser.email) {
      assignedClientIds.push(msg);
      return true;
    }
  }).length;

  return {
    unread: {
      count: unreadCount,
      clientIds: unreadClientIds,
    },
    opened: {
      count: openedCount,
      clientIds: openedClientIds,
    },
    closed: {
      count: closedCount,
      clientIds: closedClientIds,
    },
    assigned: {
      count: assignedCount,
      clientIds: assignedClientIds,
    },
  };
};