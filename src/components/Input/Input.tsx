import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './input.module.scss';
import OutsideClickHandler from 'react-outside-click-handler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

interface IData {
  id?: string | number,
  icon?: string,
  value: string,
}

interface IInputProps {
  placeholder?: string,
  value?: string | number,
  type: string,
  name?: string,
  onChange?: (e: any) => void,
  onClick?: (item: {icon?: string, value: string}) => void,
  onSelect?: (arg0: string | number) => void,
  onBlur?: (e: any) => void,
  onFocus?: () => void,
  fluid?: boolean,
  width?: string,
  classNames?: string,
  data?: IData[],
  fixedSelect?: boolean,
  allowClear?: boolean,
  readOnly?: boolean,
  disabled?: boolean,
  addonAfter?: React.ReactNode | HTMLDivElement,
  maxLength?: number,
  label?: string,
  checked?: boolean,
  required?: boolean,
  min?: number,
  max?: number,
  errorMessage?: string,
};

export default function Input({
  placeholder,
  value = '',
  type = 'text',
  name,
  fluid,
  width,
  classNames,
  onChange,
  onClick,
  onSelect,
  onBlur,
  onFocus,
  data = [],
  fixedSelect,
  allowClear,
  readOnly,
  disabled,
  addonAfter,
  maxLength,
  label,
  checked,
  required,
  min,
  max,
  errorMessage = '',
}: IInputProps) {
  const [isOpen, setOpen] = useState(false);
  const [fieldValue, setFieldValue] = useState<string | number | null>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  useEffect(() => {
    const clickHandler = (e: any) => {
      const target: any = e.target;

      if (!(inputRef.current && inputRef.current.contains(target))) {
        setOpen(false);
      }
    };

    if (data.length > 0) {
      document.addEventListener('click', clickHandler);
    }

    return document.removeEventListener('click', clickHandler);
  }, [isOpen]);

  const getInputValue = () => {
    return typeof fieldValue === 'string' ? fieldValue : value;
  }

  return (
    <div
      className={styles.inputContainer}
    >
      <label className={styles.label}>
        <input
          readOnly={readOnly}
          ref={inputRef}
          placeholder={placeholder}
          value={getInputValue()}
          type={type}
          name={name}
          className={`
            ${styles.input}
            ${fluid && styles.fluid }
            ${type === 'radio' ? styles.radioStyles : styles.notRadioStyles}
            ${errorMessage && styles.error}
            ${classNames}
          `}
          style={fluid ? { width: '100%' } : { width }}
          onChange={(e) => {
            onChange && onChange(e);
            setFieldValue(e.target.value);
          }}
          onFocus={() => {
            setOpen(true);
            onFocus && onFocus();
          }}
          onBlur={onBlur}
          disabled={disabled}
          maxLength={maxLength}
          checked={checked}
          required={required}
          min={min}
          max={max}
        />

        {
          errorMessage &&
          <div className={styles.errorMessage}>
            { errorMessage }
          </div>
        }

        {
          label && 
          <span
            className={styles.labelText}
            dangerouslySetInnerHTML={{ __html: label }}
          />
        }

        { addonAfter }

        {
          allowClear && fieldValue &&
          <div
            className={styles.clearSearchFieldIcon}
            onClick={() => {
              setFieldValue('');
            }}
          >
            <FontAwesomeIcon
              icon={faTimesCircle}
              color='#aaa'
              size='lg'
            />
          </div>
        }
      </label>

      {
        isOpen && data.length > 0 &&
        <OutsideClickHandler
          onOutsideClick={(e: any) => {
            const target = e.target;
            const inputNode = inputRef.current;

            if (inputNode && !inputNode.contains(target)) {
              setOpen(false);
            }
          }}
        >
          <div className={styles.popup}>
            {
              data.map((item, idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (fixedSelect) {
                        if (item.value !== fieldValue) {
                          setFieldValue(item.value)
                          if (onSelect && item.id) onSelect(item.id);
                          setOpen(false);
                        }

                        return;
                      }

                      setOpen(false);
                      onClick!(item);
                    }}
                  >
                    {item.icon && <img src={item.icon} />}
                    <p className={styles.popupValue}>{item.value}</p>
                  </div>
                );
              })
            }
          </div>
        </OutsideClickHandler>
      }
    </div>
  );
}