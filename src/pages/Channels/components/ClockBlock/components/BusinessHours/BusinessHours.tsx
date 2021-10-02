import React from 'react';

import Input from 'ui/Input/Input';

import styles from './businessHours.module.scss';
import { weekdays, businessHours } from '../../../../../../lib/utils/date';
import { getEntityValueById } from '../../../../../../lib/utils/entity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useActions } from 'hooks/useActions';
import { useTypedSelector } from 'hooks/useTypedSelector';

interface BusinessHours {
  [key: string]: string,
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
  const { businessDays } = useTypedSelector(state => state.channels.settings);
  const { updateChannelSettings } = useActions();

  const selectOption = (id: string | number, key: string, entity: { id: string | number, value: string }[]) => {
    const foundBusinessDaysItem: any = businessDays.find(item => item.businessDayId === businessDayId);

    if (foundBusinessDaysItem) {
      const foundBusinessHoursItemIndex: number = businessDays.findIndex(item => item.businessDayId === businessDayId);
      foundBusinessDaysItem[key] = getEntityValueById(entity, id);
      businessDays.splice(foundBusinessHoursItemIndex, 1, foundBusinessDaysItem);
    }

    updateChannelSettings({ businessDays });
  };

  return (
    <div className={styles.businessHoursContainer}>
      <div className={styles.weekdaysFieldContainer}>
        <Input
          type='text'
          classNames={styles.weekdays}
          onSelect={(id) => selectOption(id, 'weekday', weekdays)}
          value={weekday}
          fixedSelect
          readOnly
          data={weekdays}
        />
      </div>

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
        <FontAwesomeIcon icon={faTimes} color='$orange-1' />
      </div>
    </div>
  );
}