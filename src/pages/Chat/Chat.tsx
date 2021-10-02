import React, { useState, useEffect, useRef, isValidElement, cloneElement } from 'react';
import { useParams } from 'react-router';
import moment from 'moment-timezone';
import { throttle } from 'lodash';

import ContactField from 'ui/ContactField/ContactField';
import Button from 'ui/Button/Button';
import Textarea from 'ui/Textarea/Textarea';
import Animal from 'ui/Animal/Animal';

import socket from '../../socket';
import styles from './chat.module.scss';
import { getLogicalSign, getScriptCondition } from './helpers';

import { useActions } from 'hooks/useActions';
import { useTypedSelector } from 'hooks/useTypedSelector';

import { numericSort } from 'lib/utils/sort';
import { getEntityIdByValue } from 'lib/utils/entity';
import { scrollToBottomOfWrapper } from 'lib/utils/scroll';
import { businessHours, weekdays, isDateBetween } from 'lib/utils/date';
import { replaceWhiteSpaceToBr } from 'lib/utils/string';

import { Settings, Rule, Condition, BusinessDay } from '../../types/channels';
import { BotMessage, Message } from '../../api/types';
import { request } from '../Channels/components/ClockBlock/constants';

import theme1 from 'assets/theme1-big.png';
import theme2 from 'assets/theme2-big.png';
import theme3 from 'assets/theme3-big.png';

interface RuleStep {
  ruleId: string,
  status: string
}

interface ClientData {
  clientId: string
  id: string | number | null,
  isBlocked: boolean,
  messagesHistory: Message[],
  projectId: string,
}

let parentWindowOrigin = '';
let savedClientChatSettings: Settings | null = null;
let savedRulesSteps: RuleStep[] | null = null;
let countdownWithoutAnswerFromOperator: NodeJS.Timeout;
let messagesSentCount = 0;

const animal = new Animal({ name: '' });
const avatarName = animal.validateName().animal;
const avatarColor = animal.validateColor().color;

export default function Chat() {
  const { messages } = useTypedSelector(state => state.inbox);
  const { settings } = useTypedSelector(state => state.channels);
  const {
    addMessage, fetchIncomingMessages, addToInboxIncomingMessage,
    fetchChatSettings, updateClientData
  } = useActions();

  const [textareaValue, setTextareaValue] = useState('');

  let messagesHistoryRef = useRef<HTMLDivElement>(null);
  let infochatLinkRef = useRef<HTMLParagraphElement>(null);
  let variantsMessageRef = useRef<HTMLDivElement>(null);

  interface ParamTypes {
    clientId: string,
    projectId: string
  }

  interface Background {
    id: number,
    path: string,
  }

  let { clientId, projectId } = useParams<ParamTypes>();

  const backgrounds: Background[] = [
    {
      id: 1,
      path: theme1,
    },
    {
      id: 2,
      path: theme2,
    },
    {
      id: 3,
      path: theme3,
    },
    {
      id: 4,
      path: '',
    },
  ];

  const getBackgroundImageSettings = () => {
    const imagePath = backgrounds.find((bg: Background) => bg.id === settings.backgroundImage)?.path;

    return imagePath ?
    {
      backgroundImage: `url(${imagePath})`,
      backgroundSize: 'cover',
    } : {};
  };

  // const postMessageChatEventHandler = (message: any) => {
  //   console.log(message, '__MESSAGE++');
  //   switch (message.event) {
  //     case 'acceptDataFromClientWebsite':
  //       savedClientChatSettings = message.localStorageClientChatSettings;
  //       parentWindowOrigin = message.origin;
  //       savedRulesSteps = message.localStorageRulesSteps;
  //       break;
  //   }
  // };

  const sendMessagesPullToGetClientData = () => {
    const username = 'bot';

    const sendBotMessageWithContacField = (field: string) => {
      const variantsMessageNode = variantsMessageRef.current;
      const changeClientData = (fieldValue: string) => {
        const thankyouMessage = {
          username,
          message: `Спасибо. Мы вам ${field === 'email' ? 'ответим по электронной почте' : 'перезвоним'} в рабочее время.`,
          timestamp: Date.now(),
        };

        updateClientData({
          updatedBy: 'client',
          projectId,
          clientId,
          [field]: fieldValue,
          successCallback: () => sendBotMessage(thankyouMessage),
        });
      };

      sendBotMessage({
        username,
        message: (
          <div className={styles.contactFieldContainer}>
            <ContactField
              field={field}
              onClick={changeClientData}
            />
          </div>
        ),
        timestamp: Date.now(),
      });

      if (variantsMessageNode) {
        variantsMessageNode.remove();
      }
    };

    const warningMessage = {
      username,
      message: 'На данный момент все операторы оффлайн.',
      timestamp: Date.now(),
    };
    const communicationMethodsMessage = {
      username,
      message: 'Выберите удобный для вас способ связи и мы ответим, как только будем онлайн.',
      timestamp: Date.now(),
    };
    const variantsMessage = {
      username,
      message: (
        <div ref={variantsMessageRef}>
          <Button
            type='button'
            onClick={() => sendBotMessageWithContacField('email')}
            classNames={styles.sendEmailBtn}
          >
            Отправить ответ на мой e-mail.
          </Button>

          <Button
            type='button'
            onClick={() => sendBotMessageWithContacField('phone')}
            classNames={styles.callbackBtn}
          >
            Перезвоните мне
          </Button>
        </div>
      ),
      timestamp: Date.now(),
    };

    const messagesPull = [warningMessage, communicationMethodsMessage, variantsMessage ];
    
    const sendBotMessage = (message: BotMessage) => {
      console.log(message, 'BOT_MESSAGE');
      addMessage(message);
    };

    for (let i = 0; i < messagesPull.length; i++) {
      const delay = (i + 1) * 800;
      const message = messagesPull[i];
      setTimeout(() => sendBotMessage(message), delay);
    }
  };

  const applyBusinessHoursRules = (chatSettings: Settings) => {
    const requestConditionId = getEntityIdByValue(request, chatSettings.requestText)
    if (messagesSentCount === 1 && requestConditionId === 'alwaysAfterFirstClientMessage') {
      sendMessagesPullToGetClientData();
      return;
    }

    const isClientMessageInNonBusinessHoursCondition: boolean = requestConditionId === 'clientMessageInNonWorkingHours';
    if (isClientMessageInNonBusinessHoursCondition) {
      const businessDays = chatSettings.businessDays;
      const makeMomentDate = (weekday: number, hour: number) => {
        const momentDate = moment();

        momentDate.weekday(weekday);
        momentDate.hour(hour);
        momentDate.minute(0);
        momentDate.second(0);

        return momentDate;
      };
      const checkClientSentMessageInNotBusinessHoursByWeekday = (weekday: number): boolean => {
        let isClientSentMessageInNonBusinessHours = false;

        const businessDaysFilteredByWeekday = businessDays.filter((businessDay: BusinessDay) => 
          getEntityIdByValue(weekdays, businessDay.weekday) === weekday
        );

        for (let i = 0; i < businessDaysFilteredByWeekday.length; i++) {
          const businessDay = businessDays[i];
          const { weekday, timeFrom, timeTo } = businessDay;
  
          const weekdayId = Number(getEntityIdByValue(weekdays, weekday));
          const hourIdFrom = Number(getEntityIdByValue(businessHours, timeFrom));
          const hourIdTo = Number(getEntityIdByValue(businessHours, timeTo));
          
          const momentDateFrom = makeMomentDate(weekdayId, hourIdFrom).tz(chatSettings.timezone);
          const momentDateTo = makeMomentDate(weekdayId, hourIdTo).tz(chatSettings.timezone);
          
          if (!isDateBetween(momentDateFrom, momentDateTo)) {
            isClientSentMessageInNonBusinessHours = true;
            break;
          }
        }

        return isClientSentMessageInNonBusinessHours;
      };

      const clientWeekdayWithChatSettingsTimezone: number = moment().tz(chatSettings.timezone).weekday();
      if (checkClientSentMessageInNotBusinessHoursByWeekday(clientWeekdayWithChatSettingsTimezone)) {
        console.log('NON_WORKING_HOURS');
        sendMessagesPullToGetClientData();
      }
    }

    if (messagesSentCount === 1 && requestConditionId === 'wasNotAnsweredWithin') {
      const delay = chatSettings.timeWithoutAnswer;
      const sendMessagesCallback = () => {
        sendMessagesPullToGetClientData();
      };

      countdownWithoutAnswerFromOperator = setTimeout(sendMessagesCallback, delay * 1000);
    }
  };

  const closeChatIframes = () => {
    window.parent.postMessage({
      event: 'closeChatWindowIframe',
    }, '*');
  };

  useEffect(() => {
    window.parent.postMessage({ event: 'getDataFromClientWebsite' }, '*');
    console.log('ttttttttttttt');
    // const messageHandler = (e: any) => {
    //   console.log('erdtfygvubhnjlmk');
    //   postMessageChatEventHandler(e.data);
    // }
    // window.addEventListener('message', messageHandler);

    socket.emit('joinRoom', clientId);

    getMessagesHistory();

    const sendMessage = (rule: Rule) => {
      const botMessage: BotMessage = {
        username: 'bot',
        message: rule.result,
        timestamp: Date.now(),
      };

      const successCallback = () => {
        addMessage(botMessage);
        socket.emit('chatMessage', {
          clientId,
          projectId,
          message: botMessage,
          avatarName,
          avatarColor,
        });
        window.parent.postMessage({
          event: 'updateRulesSteps',
          ruleId: rule.id,
          status: 'done'
        }, '*');
      };

      addToInboxIncomingMessage({
        clientId,
        projectId,
        message: botMessage,
        avatarName,
        avatarColor,
        successCallback,
      });
    };

    const runBotByRules = (rules: Rule[]) => {
      const sendFailedStatusForRulesStepsByRuleId = (ruleId: string) => {
        window.parent.postMessage({
          event: 'updateRulesSteps',
          ruleId: ruleId,
          status: 'failed'
        }, '*');
      };

      const timeConditionCallback = (isLastTimeValue: boolean, areAllSyncConditionsTrue: boolean, rule: Rule) => {
        if (isLastTimeValue) {
          if (areAllSyncConditionsTrue) {
            sendMessage(rule);
          } else {
            sendFailedStatusForRulesStepsByRuleId(rule.id);
          }
        }
      }

      const getTimeValuesAndSyncConditionsResults = (conditions: Condition[]): {
        timeValues: number[],
        syncConditionsResults: boolean[]
      } => {
        const allowedConditionOperatorsIds = ['not', 'contain', 'not contain', 'any'];
        const timeValues: number[] = [];
        const syncConditionsResults: boolean[] = [];
        let logicalOperator;

        conditions.forEach((condition: Condition) => {
          if (condition.operator === 'moreThan' || condition.operator === 'lessThan') {
            timeValues.push(parseInt(condition.value));
          } else {
            if (allowedConditionOperatorsIds.includes(condition.operator)) {
              logicalOperator = getLogicalSign(condition.operator);
              console.log(parentWindowOrigin, 'parentWindowOrigin');
              syncConditionsResults.push(getScriptCondition(logicalOperator, condition.value, parentWindowOrigin));
            }
          }
        });

        return {
          timeValues,
          syncConditionsResults,
        };
      };

      const executeAsyncConditionsOfRule = (sortedTimeValues: number[], areAllSyncConditionsTrue: boolean, rule: Rule) => {
        for (let k = 0; k < sortedTimeValues.length; k++) {
          const delay = sortedTimeValues[k];
          const isLastTimeValue = k === sortedTimeValues.length - 1;

          setTimeout(
            () => timeConditionCallback(isLastTimeValue, areAllSyncConditionsTrue, rule),
            delay * 1000
          );
        }
      };

      const executeRule = (rule: Rule) => {
        const { timeValues, syncConditionsResults } = getTimeValuesAndSyncConditionsResults(rule.conditions);

        const sortedTimeValues = timeValues.sort(numericSort);
        const areAllSyncConditionsTrue = syncConditionsResults.findIndex((syncAction: boolean) => !syncAction) === -1;

        if (sortedTimeValues.length > 0) {
          executeAsyncConditionsOfRule(sortedTimeValues, areAllSyncConditionsTrue, rule);
          return;
        }

        areAllSyncConditionsTrue ? sendMessage(rule) : sendFailedStatusForRulesStepsByRuleId(rule.id);
      };

      if (rules.length > 0) {
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];

          if (rule.isActivate) {
            executeRule(rule);
          }
        }
      }
    };

    const applyChatSettings = (chatSettings: Settings) => {
      applyBusinessHoursRules(chatSettings);
      applyRules(chatSettings);
    };

    const applyRules = (chatSettings: Settings) => {
      const getRulesInProgressStatus = (rules: Rule[]) => {
        const rulesInProgressStatus = [];

        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          const foundRuleStep = savedRulesSteps?.find((ruleStep) => ruleStep.ruleId === rule.id);

          if (foundRuleStep && foundRuleStep.status === 'inProgress') {
            rulesInProgressStatus.push(rule);
          }
        }

        return rulesInProgressStatus;
      };

      window.parent.postMessage({
        event: 'updateChatSettings',
        chatSettings
      }, '*');
      socket.emit('transferChatSettings', {
        room: clientId,
        chatSettings
      });

      let rules;
      if (savedClientChatSettings) {
        rules = getRulesInProgressStatus(savedClientChatSettings.rules);
      } else {
        rules = chatSettings.rules;
      }

      runBotByRules(rules);
    };

    fetchChatSettings({ projectId, successCallback: applyChatSettings });
    
    const scrollHandler = (messagesHistoryContainer: HTMLDivElement) => throttle(() => {
      const infochatLink = infochatLinkRef.current;

      if (infochatLink) {
        if (messagesHistoryContainer.scrollTop + 366 < messagesHistoryContainer.scrollHeight) {
          if (!infochatLink.className.includes(styles.hidden)) {
            infochatLink.className += ` ${styles.hidden}`;
          }
        } else {
          infochatLink.className = styles.infochatLink;
        }
      }
    }, 500)
    
    const messagesHistoryContainer = messagesHistoryRef.current;

    if (messagesHistoryContainer) {
      messagesHistoryContainer.addEventListener('scroll', scrollHandler(messagesHistoryContainer));
    }

    // return () => {
    //   window.removeEventListener('message', messageHandler);
    // };
  }, []);

  useEffect(() => {
    socket.on('addMessageToClientChat', (message: Message) => {
      addMessage(message.message);
      clearTimeout(countdownWithoutAnswerFromOperator);
    });

    socket.on('blockClient', () => {
      closeChatIframes();
    });

    return () => {
      socket.off('addMessageToClientChat');
    };
  }, [socket]);

  const getMessagesHistory = async () => {
    fetchIncomingMessages({
      projectId,
      clientId,
      successCallback: (clientData: ClientData) => {
        console.log(clientData, 'clientData');
        if (clientData.isBlocked) {
          closeChatIframes();
          return;
        }

        addMessage(clientData.messagesHistory);
      },
    });
  };

  const sendMessage = (inputArea: string) => {
    const timestamp = Date.now();

    const message = inputArea;
    const newMessage = {
      username: 'client',
      message,
      timestamp
    };

    messagesSentCount++;

    const successCallback = () => {
      addMessage(newMessage);
      setTextareaValue('');
      socket.emit('chatMessage', {
        clientId,
        projectId,
        message: newMessage,
        avatarName,
        avatarColor,
      });

      applyBusinessHoursRules(settings);
    };

    addToInboxIncomingMessage({
      clientId,
      projectId,
      message: newMessage,
      avatarName,
      avatarColor,
      successCallback,
    });
  };

  const handleKeyPress = (e: any) => {
    const message = e.target.value;
    if (e.shiftKey) return;
    if (message.indexOf('\n') === 0) {
      setTextareaValue('');
      return;
    }

    const formattedMessage = replaceWhiteSpaceToBr(message);
    if (formattedMessage && e.which === 13) {
      sendMessage(formattedMessage)
      scrollToBottomOfWrapper(messagesHistoryRef.current);
    }
  };

  return (
    <div>
      <div
        className={styles.chatWrapper}
        style={getBackgroundImageSettings()}
      >
        <div className={styles.chatHeader}>
          <div className={styles.chatName}>{ settings.chatName }</div>
          <div className={styles.responseTimeText}>{ settings.responseTimeText }</div>
          <div>{ settings.greeting }</div>
        </div>

        <div
          ref={messagesHistoryRef}
          className={styles.messagesHistoryWrapper}
        >
          <div className={styles.messagesWrapper}>
            {
              messages && messages.length > 0 &&
              messages.map((message, idx) => {
                return isValidElement(message.message) ?
                cloneElement(message.message, { key: idx }) :
                (
                  <div
                    className={`
                      ${message.username === 'client' ? styles.clientMessage : styles.teammateMessage}
                      ${styles.messageWrapper}
                    `}
                    key={idx}
                    dangerouslySetInnerHTML={{__html: message.message as string}}
                  />
                )
              })
            }
          </div>

          {
            Boolean(settings.infochatLinkEnabled) &&
            <p
              ref={infochatLinkRef}
              className={styles.infochatLink}
            >
              Работает на технологии <span className={styles.link}>InfoChat</span>
            </p>
          }
        </div>

        <Textarea
          value={textareaValue}
          classNames={styles.inputMessageArea}
          placeholder='Напишите нам...'
          onKeyPress={handleKeyPress}
          onChange={(e) => setTextareaValue(e.target.value)}
        />
      </div>
    </div>
  );
}