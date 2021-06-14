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

export function getAllInboxMessages(incomingMessages: IIncomingMessage[], currentUser: any): any {
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
    assigned: {
      count: assignedCount,
      clientIds: assignedClientIds,
    },
  };
};