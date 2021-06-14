import React from 'react';

import Input from '../../../../../../components/Input/Input';

import styles from './conditionOptionsLine.module.scss';

interface InputSelector {
  id: string,
  value: string,
}

interface ConditionOptionsLineProps {
  operator: string,
  selectOption: (property: {[key: string]: string | number}) => void,
  conditionVariantId: string,
  value: string,
}

export default function ConditionOptionsLine({ 
  operator,
  selectOption,
  conditionVariantId,
  value
}: ConditionOptionsLineProps) {
  const conditionsSelectorReferralAndCurrentAddress: InputSelector[] = [
    {
      id: 'not',
      value: 'не',
    },
    {
      id: 'contain',
      value: 'содержит',
    },
    {
      id: 'not contain',
      value: 'не содержит',
    },
    {
      id: 'any',
      value: 'любое',
    },
  ];

  const conditionsSelectorTimeAndOffline: InputSelector[] = [
    {
      id: 'moreThan',
      value: 'больше чем',
    },
    {
      id: 'lessThan',
      value: 'меньше чем',
    },
  ];

  const getInputOperator = () => {
    const foundOperator = [
      ...conditionsSelectorReferralAndCurrentAddress,
      ...conditionsSelectorTimeAndOffline
    ].find((operatorGroup) => operatorGroup.id === operator)

    if (foundOperator) {
      return foundOperator.value;
    }
  };

  const getInputProps = (id: string): any => {
    return id === 'currentPageAddress' || id === 'referralLink' ?
      {
        selectorProps: {
          data: conditionsSelectorReferralAndCurrentAddress,
          value: getInputOperator() || conditionsSelectorReferralAndCurrentAddress[0].value,
        },
        inputProps: {
          placeholder: 'site.ru/index.html',
          value: value || '',
          type: 'text',
        }
      } :
      {
        selectorProps: {
          data: conditionsSelectorTimeAndOffline,
          value: getInputOperator() || conditionsSelectorTimeAndOffline[0].value,
        },
        inputProps: {
          placeholder: '',
          value: value || 40,
          type: 'number',
          addonAfter: <div className={styles.addonAfter}>сек</div>,
        }
      };
  };

  const { selectorProps, inputProps } = getInputProps(conditionVariantId);

  return (
    <div className={styles.conditionBuilderLine}>
        <Input
          onSelect={(id) => selectOption({ operator: id })}
          classNames={styles.condition}
          fixedSelect
          readOnly
          {...selectorProps}
        />
        {
          operator !== 'any' &&
          <Input
            onChange={(e) => selectOption({ value: e.target.value })}
            classNames={styles.condition}
            {...inputProps}
          />
        }
      </div>
  );
}