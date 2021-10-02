import React, { useState } from 'react';

import Button from 'ui/Button/Button';
import Switcher from 'ui/Switcher/Switcher';
import Input from 'ui/Input/Input';
import Textarea from 'ui/Textarea/Textarea';
import Condition from '../../components/Condition/Condition';
import ButtonsGroup from '../../../ButtonsGroup/ButtonsGroup';

import styles from './rule.module.scss';
import { Condition as ConditionInterface } from 'types/channels';

interface Condition {
  variant: string,
  operator: string,
  value: string,
  id: string,
}

interface Props {
  name: string,
  result: string,
  isActivate: boolean,
  conditions: ConditionInterface[],
  ruleId: string,
  toggleChangesForAutomationBlock: (bool: boolean) => void,
  addCondition: (ruleId: string) => void,
  deleteCondition: (ruleId: string, conditionId: string) => void,
  updateCondition: (ruleId: string, conditionId: string, property: any) => void,
  deleteRule: (ruleId: string) => void,
  updateRule: (ruleId: string, property: any) => void,
}

export default function Rule({
  name,
  result,
  isActivate,
  conditions,
  ruleId,
  toggleChangesForAutomationBlock,
  addCondition,
  deleteCondition,
  updateCondition,
  deleteRule,
  updateRule,
}: Props) {
  const [editMode, toggleMode] = useState(false);
  const [hasChanges, toggleChanges] = useState(false);

  const editRule = () => {
    toggleMode(prev => !prev);
  };

  return (
    <div className={styles.ruleContainer}>
      <div className={styles.rulePreview}>
        {
          editMode ?
          <Input
            type='text'
            value={name}
            classNames={styles.ruleNameEditMode}
            onChange={(e) => {
              updateRule(ruleId, { name: e.target.value });
              toggleChanges(true);
            }}
          /> :
          <span className={styles.ruleName}>{ name }</span>
        }

        <div className={styles.actions}>
          {
            !editMode &&
            <Button
              type='button'
              onClick={editRule}
              background='transparent'
              classNames={styles.changeRuleBtn}
            >
              Изменить
            </Button>
          }

          <Switcher
            onChange={(value: boolean) => {
              updateRule(ruleId, { isActivate: value });
              toggleChangesForAutomationBlock(true);
              toggleChanges(true);
            }}
            value={isActivate}
          />
        </div>
      </div>

      {
        editMode &&
        <div className={styles.ruleSettingsContainer}>
          {
            conditions.map(({ variant, operator, value, id }, idx) => {
              return (
                <Condition
                  key={idx}
                  variant={variant}
                  operator={operator}
                  value={value}
                  id={id}
                  ruleId={ruleId}
                  deleteCondition={deleteCondition}
                  updateCondition={updateCondition}
                  toggleChanges={toggleChanges}
                />
              );
            })
          }

          <Button
            type='button'
            onClick={() => {
              addCondition(ruleId);
              toggleChanges(true);
            }}
            background='transparent'
            classNames={styles.addConditionBtn}
          >
            + Добавить условие
          </Button>

          <div className={styles.conditionResult}>
            <span className={styles.conditionResultTitle}>Тогда отправить сообщение</span>
            <Textarea
              value={result}
              maxLength={250}
              onChange={(e) => {
                updateRule(ruleId, { result: e.target.value });
                toggleChanges(true);
              }}
            />
          </div>

          <ButtonsGroup
            hasChanges={hasChanges}
            toggleChanges={toggleChanges}
            // setActiveTab={setActiveTab}
            resetBlockSettings={() => {
              // updateAssignedOperators([]);
            }}
          />

          <Button
            type='button'
            onClick={() => deleteRule(ruleId)}
            background='transparent'
            classNames={styles.deleteActionBtn}
          >
            Удалить это действие
          </Button>
        </div>
      }
    </div>
  );
}