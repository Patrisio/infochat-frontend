import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../../../components/Input/Input';
import Tabs from '../../../../components/Tabs/Tabs';
import ButtonsGroup from '../ButtonsGroup/ButtonsGroup';

import styles from './operatorsBlock.module.scss';
import { useActions } from '../../../../hooks/useActions';

interface Operator {
  icon?: string,
  value: string | '' |  null,
  id?: string,
}

interface Props {
  setActiveTab?: () => void,
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
}

interface State {
  channels: [],
  settings: Settings,
}

interface RootState {
  channels: State,
  teammates: any,
}

let defaultOperators: Operator[];

export default function OperatorsBlock({ setActiveTab }: Props) {
  const assignedOperators = useSelector((state: RootState) => state.channels.settings.operators);
  const existingTeammates = useSelector((state: RootState) => state.teammates.teammates);
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

  const assignOperator = (operator: Operator) => {
    toggleChanges(true);
    
    const isOperatorAlreadyAssigned = assignedOperators.find((assignedOperator) => assignedOperator.id === operator.id);

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