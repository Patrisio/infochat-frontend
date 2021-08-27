import React, { useState, useEffect } from 'react';

import BusinessHours from './components/BusinessHours/BusinessHours';
import Button from '../../../../components/Button/Button';
import Input from '../../../../components/Input/Input';
import ButtonsGroup from '../ButtonsGroup/ButtonsGroup';

import styles from './clockBlock.module.scss';
import { generateRandomHash } from '../../../../utils/string';
import { responseTime, request } from './constants';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import moment from 'moment-timezone';
import { getTimezones, getTimezoneByCode } from '../../../../lib/utils/date';
import { getEntityIdByValue } from '../../../../lib/utils/entity';

interface Props {
  setActiveTab?: () => void,
}

interface Operator {
  icon?: string,
  value: string | '' |  null,
  id?: string,
}

interface BusinessDay {
  businessDayId: string,
  weekday: string,
  timeFrom: string,
  timeTo: string,
}

interface Settings {
  chatName: '',
  greeting: '',
  backgroundImage: 1,
  buttonLocation: '',
  buttonScale: '',
  buttonText: '',
  infochatLinkEnabled: 1,
  customCss: '',
  operators: Operator[],
  businessDays: BusinessDay[],
  responseTimeText: string,
  requestText: string,
  timezone: string,
  timeWithoutAnswer: number,
}

interface State {
  channels: [],
  settings: Settings,
}

interface RootState {
  channels: State,
  teammates: any,
}

interface BusinessHours {
  businessDayId: string,
  weekday: string,
  timeFrom: string,
  timeTo: string,
}

let defaultBusinessDays: BusinessHours | BusinessHours[] = {
  businessDayId: generateRandomHash(),
  weekday: 'Понедельник',
  timeFrom: '09:00',
  timeTo: '18:00',
};

export default function ClockBlock({ setActiveTab }: Props) {
  const { businessDays } = useTypedSelector(state => state.channels.settings);
  const { responseTimeText } = useTypedSelector(state => state.channels.settings);
  const { requestText } = useTypedSelector(state => state.channels.settings);
  const { timezone: chatSettingsTimezone } = useTypedSelector(state => state.channels.settings);
  const { settings: chatSettings } = useTypedSelector(state => state.channels);
  const { updateChannelSettings } = useActions();

  const [hasChanges, toggleChanges] = useState(false);

  const timezones = getTimezones();
  
  const deleteBusinessHoursModule = (id: string) => {
    updateChannelSettings({
      businessDays: businessDays.filter((item: BusinessHours) => item.businessDayId !== id).slice(),
    });
  };

  const addBusinessHoursModule = () => {
    toggleChanges(true);
    updateChannelSettings({
      businessDays: [
        ...businessDays,
        {
          ...defaultBusinessDays,
          businessDayId: generateRandomHash(),
        }],
    });
  };

  const addWeekend = () => {
    console.log(moment.tz.names());
  };

  const saveChangesCallback = () => {
    defaultBusinessDays = businessDays;
  };

  const changeInputRadioButtonHandler = (e: any, stateName: string) => {
    updateChannelSettings({ [stateName]: e.target.value });
    toggleChanges(true);
  };

  const updateTimezone = (timezone: string | number) => {
    updateChannelSettings({ timezone });
  };

  const changeNotAnswerOperatorValue = (e: any) => {
    const value = e.target.value;

    if (value < 0) {
      updateChannelSettings({ timeWithoutAnswer: 0 });
      return;
    }

    updateChannelSettings({ timeWithoutAnswer: parseInt(value) });
  };

  useEffect(() => {
    updateChannelSettings({ businessDays: [defaultBusinessDays] });
  }, []);

  return (
    <div>
      <div className={styles.subBlock}>
        <h4 className={styles.title}>Рабочие часы</h4>
        <p className={styles.description}>В нерабочие часы бот спросит у клиента телефон или email</p>

        <Input
          type='text'
          classNames={styles.timezones}
          fixedSelect
          data={timezones}
          fluid
          value={getTimezoneByCode(chatSettingsTimezone)}
          readOnly
          onSelect={updateTimezone}
        />

        {
          businessDays.map(({ businessDayId, weekday, timeFrom, timeTo }, idx) => {
            return (
              <BusinessHours
                key={idx}
                weekday={weekday}
                from={timeFrom}
                to={timeTo}
                businessDayId={businessDayId}
                deleteBusinessHoursModule={deleteBusinessHoursModule}
              />
            );
          })
        }

        <Button
          type='button'
          onClick={addBusinessHoursModule}
          background='transparent'
          classNames={styles.addOptionsBtn}
        >
          + Добавить рабочие часы
        </Button>
      </div>

      <div className={styles.subBlock}>
        <h4 className={styles.title}>Праздничные дни</h4>
        <p className={styles.description}>Добавить праздничные исключения</p>

        {/* <Tabs /> */}

        <Button
          type='button'
          onClick={addWeekend}
          background='transparent'
          classNames={styles.addOptionsBtn}
        >
          + Добавить выходной
        </Button>
      </div>

      <div className={styles.subBlock}>
        <h4 className={styles.title}>Время ответа</h4>
        <p className={styles.description}>Сообщите посетителям, как быстро они могут получить ответ</p>

        {
          responseTime.map((responseTimeEntity, idx) => {
            return (
              <div
                key={idx}
                className={styles.radio}
              >
                <Input
                  type='radio'
                  label={responseTimeEntity.value}
                  name='responseTime'
                  value={responseTimeEntity.value}
                  checked={getEntityIdByValue(responseTime, responseTimeText) === responseTimeEntity.id}
                  onChange={(e) => changeInputRadioButtonHandler(e, 'responseTimeText')}
                />
              </div>
            );
          })
        }
      </div>

      <div className={styles.subBlock}>
        <h4 className={styles.title}>Запрашивать телефон или email клиента</h4>
        <p className={styles.description}>Добавьте условия, когда бот автоматически запросит в чате телефон или email клиента</p>
      
        {
          request.map((requestEntity, idx) => {
            const isCountdownOperator = requestEntity.id === 'wasNotAnsweredWithin';

            return (
              <div
                key={idx}
                className={`
                  ${styles.radio}
                  ${isCountdownOperator && styles.flex}
                `}
              >
                <Input
                  type='radio'
                  label={requestEntity.value}
                  name='request'
                  value={requestEntity.value}
                  checked={getEntityIdByValue(request, requestText) === requestEntity.id}
                  onChange={(e) => changeInputRadioButtonHandler(e, 'requestText')}
                />
                {
                  isCountdownOperator &&
                  <Input
                    type='number'
                    min={0}
                    value={chatSettings.timeWithoutAnswer}
                    onChange={(e) => changeNotAnswerOperatorValue(e)}
                    classNames={styles.countdown}
                    addonAfter={<div className={styles.addonAfter}>сек</div>}
                  />
                }
              </div>
            );
          })
        }
      </div>

      <ButtonsGroup
        hasChanges={hasChanges}
        toggleChanges={toggleChanges}
        setActiveTab={setActiveTab}
        resetBlockSettings={() => {
          // updateAssignedOperators([]);
        }}
        saveChangesCallback={saveChangesCallback}
      />
    </div>
  );
}