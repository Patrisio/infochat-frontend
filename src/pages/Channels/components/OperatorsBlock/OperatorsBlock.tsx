import React, { useState, useEffect } from 'react';

import Input from '../../../../components/Input/Input';
import Tabs from '../../../../components/Tabs/Tabs';
import ButtonsGroup from '../ButtonsGroup/ButtonsGroup';

import styles from './operatorsBlock.module.scss';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { Operator } from '../../../../types/channels';

interface Props {
  setActiveTab?: () => void,
}

let defaultOperators: Operator[];

export default function OperatorsBlock({ setActiveTab }: Props) {
  const { operators: assignedOperators } = useTypedSelector(state => state.channels.settings);
  const { teammates: existingTeammates } = useTypedSelector(state => state.teammates);
  const [hasChanges, toggleChanges] = useState(false);
  const { updateChannelSettings } = useActions();

  const getTeammates = () => {
    return existingTeammates.map((operator: any) => ({
      value: operator.username,
      id: operator.email,
    }));
  };

  const removeAssignedTeammate = (teammate: Operator) => {
    updateChannelSettings({
      operators: assignedOperators.filter((operator: any) => operator.id !== teammate.id),
    });
    toggleChanges(true);
  };

  const assignOperator = (operator: any) => {
    toggleChanges(true);
    
    const isOperatorAlreadyAssigned = assignedOperators.find(assignedOperator => assignedOperator.id === operator.id);

    if (!isOperatorAlreadyAssigned) {
      updateChannelSettings({
        operators: [...assignedOperators, operator],
      });
    }
  };

  const saveChangesCallback = () => {
    defaultOperators = assignedOperators;
  };

  useEffect(() => {
    defaultOperators = assignedOperators;
  }, []);

  return (
    <div>
      <Input
        type='text'
        placeholder='+ Добавить оператора'
        classNames={styles.checkTeammateInput}
        fluid
        onClick={assignOperator}
        data={getTeammates()}
      />

      <Tabs
        data={assignedOperators}
        removeTab={removeAssignedTeammate}
      />

      <ButtonsGroup
        hasChanges={hasChanges}
        toggleChanges={toggleChanges}
        setActiveTab={setActiveTab}
        resetBlockSettings={() => {
          updateChannelSettings({ operators: defaultOperators });
        }}
        saveChangesCallback={saveChangesCallback}
      />
    </div>
  );
}