import { InboxState } from "../../types/inbox";

export function getAllInboxMessages(incomingMessages: InboxState['incomingMessages'], currentUser: any): any {
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