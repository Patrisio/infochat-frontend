import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../../../../../components/Input/Input';

import styles from './businessHours.module.scss';
import { weekdays, businessHours } from '../../../../../../lib/utils/date';
import { getEntityValueById } from '../../../../../../lib/utils/entity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { updateChannelSettings } from '../../../../../../actions';

interface BusinessHours {
  [key: string]: string,
}

interface Operator {
  icon?: string,
  value: string | '' |  null,
  id?: string,
}

interface BusinessDay {
  [key: string]: string | number
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
}

interface State {
  channels: [],
  settings: Settings,
}

interface RootState {
  channels: State,
  teammates: any,
}

interface Props {
  businessDayId: string,
  weekday: string,
  from: string,
  to: string,
  deleteBusinessHoursModule: (id: string) => void,
}

export default function BusinessHours({
  businessDayId, weekday, from, to,
  deleteBusinessHoursModule
}: Props) {
  const businessDays = useSelector((state: RootState) => state.channels.settings.businessDays);
  let dispatch = useDispatch();

  const selectOption = (id: string | number, key: string, entity: { id: string | number, value: string }[]) => {
    const foundBusinessDaysItem: BusinessDay | undefined = businessDays.find((item: BusinessDay ) => item.businessDayId === businessDayId);

    if (foundBusinessDaysItem) {
      const foundBusinessHoursItemIndex: number = businessDays.findIndex((item: BusinessDay ) => item.businessDayId === businessDayId);
      foundBusinessDaysItem[key] = getEntityValueById(entity, id);
      businessDays.splice(foundBusinessHoursItemIndex, 1, foundBusinessDaysItem);
    }

    dispatch(updateChannelSettings({ businessDays }));
  };

  const getEntityIdByValue = (entity: { id: string, value: string }[], value: string) => {
    return entity.find((entity) => entity.value === value)?.id;
  };

  return (
    <div className={styles.businessHoursContainer}>
      <Input
        type='text'
        classNames={styles.weekdays}
        onSelect={(id) => selectOption(id, 'weekday', weekdays)}
        value={weekday}
        fixedSelect
        readOnly
        data={weekdays}
      />

      <Input
        type='text'
        classNames={styles.businessHours}
        onSelect={(id) => selectOption(id, 'timeFrom', businessHours)}
        value={from}
        fixedSelect
        readOnly
        data={businessHours}
      />
      <span className={styles.devider}>до</span>
      <Input
        type='text'
        classNames={styles.businessHours}
        onSelect={(id) => selectOption(id, 'timeTo', businessHours)}
        value={to}
        fixedSelect
        readOnly
        data={businessHours}
      />

      <div
        className={styles.deleteBusinessHours}
        onClick={() => deleteBusinessHoursModule(businessDayId)}
      >
        <FontAwesomeIcon icon={faTimes} color='#ee6953' />
      </div>
    </div>
  );
}