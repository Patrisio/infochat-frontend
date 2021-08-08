import { colors, animals } from './constants';
import { IIncomingMessage } from '../reducers/inbox';

export const getClientName = (color: string, name: string) => {
  const colorTranslate = colors.find(animalColor => animalColor.color === color)?.translate;
  const animalNameTranslate = animals.find(animalName => animalName.animal === name)?.translate;
  const colorAndName = `${colorTranslate} ${animalNameTranslate}`;
  const clientName = colorAndName.includes('undefined') ? name : colorAndName;

  return clientName;
};

export const getLastUnreadMessagesCount = (incomingMessage: IIncomingMessage) => {
  let count = 0;

  for (let i = incomingMessage.messagesHistory.length - 1; i >= 0; i--) {
    const message = incomingMessage.messagesHistory[i];

    if (message.username === 'client') {
      count++;
    } else {
      break;
    }
  }

  return count;
};

export function getChangeInFieldValue(fieldName: string) {
  switch (fieldName) {
    case 'avatarName':
      return 'имя';
    case 'phone':
      return 'телефон';
    case 'email':
      return 'email';
    default:
      return 'неизвестное значение';
  }
}