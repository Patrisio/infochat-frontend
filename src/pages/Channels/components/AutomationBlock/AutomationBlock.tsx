import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ButtonsGroup from '../ButtonsGroup/ButtonsGroup';
import Button from '../../../../components/Button/Button';
import Rule from './components/Rule/Rule';

import { generateRandomHash } from '../../../../utils/string';
import { cloneDeep } from 'lodash';
import { updateChannelSettings } from '../../../../actions';
import styles from './automationBlock.module.scss';


interface Props {
  setActiveTab?: () => void,
}

interface UpdatedProp {
  [key: string]: string
}

interface Channel {
  name: string
}

interface Operator {
  name: string,
  id: string,
}

interface BusinessDay {
  businessDayId: string,
  weekday: string,
  timeFrom: string,
  timeTo: string,
}

interface Condition {
  id: string,
  variant: string,
  operator: string,
  value: string,
}

interface RuleInterface {
  id: string,
  name: string,
  isActivate: boolean,
  conditions: Condition[],
  result: string,
}

interface Settings {
  chatName: string,
  greeting: string,
  backgroundImage: number,
  buttonLocation: string,
  buttonScale: string,
  buttonText: string,
  infochatLinkEnabled: number,
  customCss: string,
  operators: Operator[],
  businessDays: BusinessDay[],
  responseTimeText: string,
  requestText: string,
  rules: RuleInterface[],
}

interface State {
  channels: Channel[],
  settings: Settings,
  fetching: boolean,
}

interface RootState {
  channels: State,
  teammates: any,
}

export default function AutomationBlock({ setActiveTab }: Props) {
  const [hasChanges, toggleChanges] = useState(false);
  const defaultCondition: Condition = {
    id: generateRandomHash(),
    variant: 'currentPageAddress',
    operator: 'contain',
    value: '',
  };
  const defaultRule = {
    id: generateRandomHash(),
    name: 'Приветствие',
    isActivate: false,
    conditions: [defaultCondition],
    result: 'Есть проблемы с вашей картой? Наша служба поддержки здесь. Спрашивай! Мы рады помочь!',
  };

  const rules = useSelector((state: RootState) => state.channels.settings.rules);
  let dispatch = useDispatch();

  const addRule = () => {
    rules.push(defaultRule);
    dispatch(updateChannelSettings({ rules }));
    toggleChanges(true);
  };

  const deleteRule = (ruleId: string) => {
    console.log(ruleId);
    dispatch(updateChannelSettings({ rules: rules.filter((rule) => rule.id !== ruleId) }));
    toggleChanges(true);
  };

  const updateRule = (ruleId: string, property: UpdatedProp) => {
    const copy = cloneDeep(rules);
    let foundRule = copy.find((rule) => rule.id === ruleId);

    if (foundRule) {
      const foundRuleIndex: number = copy.findIndex((rule) => rule.id === ruleId);

      foundRule = { ...foundRule, ...property };
      copy.splice(foundRuleIndex, 1, foundRule);
    }

    dispatch(updateChannelSettings({ rules: copy }));
  };

  const addCondition = (ruleId: string) => {
    const copy = cloneDeep(rules);
    const foundRule = copy.find((rule) => rule.id === ruleId);

    if (foundRule) {
      foundRule.conditions.push(defaultCondition);
    }

    dispatch(updateChannelSettings({ rules: copy }));
  };

  const deleteCondition = (ruleId: string, conditionId: string) => {
    const copy = cloneDeep(rules);
    const foundRule = copy.find((rule) => rule.id === ruleId);

    if (foundRule) {
      const filteredConditions = foundRule.conditions.filter((condition) => condition.id !== conditionId);
      foundRule.conditions = filteredConditions;
    }

    dispatch(updateChannelSettings({ rules: copy }));
  };

  const updateCondition = (ruleId: string, conditionId: string, property: UpdatedProp) => {
    const copy = cloneDeep(rules);
    const foundRule = copy.find((rule) => rule.id === ruleId);

    if (foundRule) {
      let foundCondition: Condition | undefined = foundRule.conditions.find((condition) => condition.id === conditionId);
      let foundConditionIndex: number = foundRule.conditions.findIndex((condition) => condition.id === conditionId);

      if (foundCondition) {
        foundCondition = { ...foundCondition, ...property };
        foundRule.conditions.splice(foundConditionIndex, 1, foundCondition);
      }
    }

    dispatch(updateChannelSettings({ rules: copy }));
  };

  return (
    <div>
      <p>Здесь вы можете создавать и редактировать действия, которые будут производиться при выполнении заданных вами условий.</p>

      {
        rules.map((rule, idx) => {
          return (
            <Rule
              key={idx}
              name={rule.name}
              result={rule.result}
              isActivate={rule.isActivate}
              conditions={rule.conditions}
              ruleId={rule.id}
              toggleChangesForAutomationBlock={toggleChanges}
              addCondition={addCondition}
              deleteCondition={deleteCondition}
              updateCondition={updateCondition}
              deleteRule={deleteRule}
              updateRule={updateRule}
            />
          )
        })
      }

      <Button
        type='button'
        onClick={addRule}
        background='transparent'
        classNames={styles.addNewActionBtn}
      >
        + Добавить новое действие
      </Button>

      <ButtonsGroup
        hasChanges={hasChanges}
        toggleChanges={toggleChanges}
        setActiveTab={setActiveTab}
        resetBlockSettings={() => {
          // updateAssignedOperators([]);
        }}
      />
    </div>
  );
}