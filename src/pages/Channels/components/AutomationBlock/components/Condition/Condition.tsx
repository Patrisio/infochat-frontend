import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import Input from 'ui/Input/Input';
import ConditionOptionsLine from '../ConditionOptionsLine/ConditionOptionsLine';

import styles from './condition.module.scss';


interface Props {
  variant: string,
  operator: string,
  value: string,
  id: string | number | null,
  ruleId: string,
  deleteCondition: (ruleId: string, conditionId: string) => void,
  updateCondition: (ruleId: string, conditionId: string, property: any) => void,
  toggleChanges: (bool: boolean) => void,
}

export default function Condition({
  variant, operator, value, id, ruleId,
  deleteCondition, updateCondition, toggleChanges
}: Props) {
  const [conditionVariantId, setConditionVariantId] = useState(variant);
  useEffect(() => setConditionVariantId(variant), [variant]);

  const conditionsVariants = [
    {
      id: 'currentPageAddress',
      value: 'адрес текущей страницы',
    },
    {
      id: 'timeOnCurrentPage',
      value: 'время на текущей странице',
    },
    {
      id: 'allOperatorsAreOffline',
      value: 'все операторы оффлайн',
    },
    {
      id: 'referralLink',
      value: 'ссылка реферала',
    },
  ];

  const selectOption = (property: {[key: string]: string | number}) => {
    updateCondition(ruleId, id as string, property);
    toggleChanges(true);
  };

  const getConditionVariant = (variantId: string) => {
    const foundVariant = conditionsVariants.find((variant) => variant.id === variantId);

    if (foundVariant) {
      return foundVariant.value;
    }
  };

  return (
    <div className={styles.conditionContainer}>
      <div className={styles.conditionLine}>
        <span>Если</span>
        <Input
          type='text'
          onSelect={(id) => {
            if (id === 'timeOnCurrentPage' || id === 'allOperatorsAreOffline') {
              selectOption({
                variant: id,
                operator: 'moreThan',
                value: '40',
              });
              return;
            }

            selectOption({
              variant: id,
              operator: 'contain',
              value: '',
            });
          }}
          classNames={styles.conditionVariant}
          value={getConditionVariant(variant)}
          fixedSelect
          readOnly
          data={conditionsVariants}
        />
        <div
          className={styles.deleteConditionIcon}
          onClick={() => deleteCondition(ruleId, id as string)}
        >
          <FontAwesomeIcon  icon={faTimes} color='$orange-1' />
        </div>
      </div>

      <ConditionOptionsLine
        operator={operator}
        selectOption={selectOption}
        conditionVariantId={conditionVariantId}
        value={value}
      />
    </div>
  );
}