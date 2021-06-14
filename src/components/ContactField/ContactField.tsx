import React, { useState } from 'react';

import Input from '../Input/Input';
import Button from '../Button/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faCheck } from '@fortawesome/free-solid-svg-icons'
import styles from './contactField.module.scss';

interface ContactField {
  field: string,
  onClick: (fieldValue: string) => void,
}

export default function ContactField({ field, onClick }: ContactField) {
  const [fieldValue, updateFieldValue] = useState<string>('');
  const [isContactSent, toggleButtonState] = useState<boolean>(false);
  const isDisabledField = () => {
    return fieldValue.length < 4;
  };
  return (
    <div className={styles.contactFieldContainer}>
      <p className={styles.contactFieldTitle}>Пожалуйста, отправьте нам свой e-mail</p>

      <div className={styles.contactField}>
        <Input
          type={`${field === 'email' ? 'email' : 'tel'}`}
          onChange={(e) => updateFieldValue(e.target.value)}
          value={fieldValue}
          placeholder={`${field === 'email' ? 'email@test.com' : '+79876543210'}`}
          classNames={styles.contactInput}
          required
          fluid
          disabled={isContactSent}
        />
          {
            isContactSent ? 
            <Button
              type='button'
              disabled={isDisabledField()}
              stylesList={{
                position: 'absolute',
                top: '50%',
                right: '5px',
                transform: 'translateY(-50%)',
                background: '#4cd233',
                border: 'none',
                padding: '5px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesomeIcon
                icon={faCheck}
                size='xs'
              />
            </Button> :
            <Button
              type='button'
              disabled={isDisabledField()}
              onClick={() => {
                toggleButtonState(true);
                onClick(fieldValue);
              }}
              stylesList={{
                position: 'absolute',
                top: '50%',
                right: '5px',
                transform: 'translateY(-50%)',
                padding: '5px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                size='xs'
              />
            </Button>
          }
      </div>
    </div>
  );
}