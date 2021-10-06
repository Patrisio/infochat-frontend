import React, { useState } from 'react';

import ButtonsGroup from '../ButtonsGroup/ButtonsGroup';
import Button from 'ui/Button/Button';
import Rule from './components/Rule/Rule';

import { generateRandomHash } from 'lib/utils/string';
import { cloneDeep } from 'lodash';
import { useActions } from 'hooks/useActions';
import { useTypedSelector } from 'hooks/useTypedSelector';
import styles from './automationBlock.module.scss';
import { Rule as RuleInerface, Condition } from 'types/channels';


interface AutomationBlockProps {
  setActiveTab?: () => void,
}

interface UpdatedProp {
  [key: string]: string
}

export default function AutomationBlock({ setActiveTab }: AutomationBlockProps) {
  const [hasChanges, toggleChanges] = useState(false);
  const defaultCondition: Condition = {
    id: generateRandomHash(),
    variant: 'currentPageAddress',
    operator: 'contain',
    value: '',
  };
  const defaultRule: RuleInerface = {
    id: generateRandomHash(),
    name: 'Приветствие',
    isActivate: false,
    conditions: [defaultCondition],
    result: 'Есть проблемы с вашей картой? Наша служба поддержки здесь. Спрашивай! Мы рады помочь!',
  };

  const { rules } = useTypedSelector(state => state.channels.settings);
  const { updateChannelSettings } = useActions();

  const addRule = () => {
    rules.push(defaultRule);
    updateChannelSettings({ rules });
    toggleChanges(true);
  };

  const deleteRule = (ruleId: string) => {
    updateChannelSettings({ rules: rules.filter((rule) => rule.id !== ruleId) });
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

    updateChannelSettings({ rules: copy });
  };

  const addCondition = (ruleId: string) => {
    const copy = cloneDeep(rules);
    const foundRule = copy.find((rule) => rule.id === ruleId);

    if (foundRule) {
      foundRule.conditions.push(defaultCondition);
    }

    updateChannelSettings({ rules: copy });
  };

  const deleteCondition = (ruleId: string, conditionId: string) => {
    const copy = cloneDeep(rules);
    const foundRule = copy.find((rule) => rule.id === ruleId);

    if (foundRule) {
      const filteredConditions = foundRule.conditions.filter((condition) => condition.id !== conditionId);
      foundRule.conditions = filteredConditions;
    }

    updateChannelSettings({ rules: copy });
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

    updateChannelSettings({ rules: copy });
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