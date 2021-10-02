import React, { useState } from 'react';

import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './contactField.module.scss';

interface ContactFieldProps {
  field: string,
  onClick: (fieldValue: string) => void,
}

export default function ContactField({ field, onClick }: ContactFieldProps) {
  const [fieldValue, updateFieldValue] = useState<string>('');
  const [isContactSent, toggleButtonState] = useState<boolean>(false);
  const isDisabledField = () => {
    return fieldValue.length < 4;
  };
  return (
    <div
      className={styles.contactFieldContainer}
      data-test='contact-field-component'
    >
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
              classNames={styles.contactSuccessBtn}
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
              classNames={styles.sendContactBtn}
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