import React, { useState, useEffect, forwardRef } from 'react';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import styles from './textarea.module.scss';

interface Props {
  value?: string,
  classNames?: string,
  onChange?: (e: any) => void,
  onBlur?: (e: any) => void,
  onKeyDown?: (e: any) => void,
  onKeyUp?: (e: any) => void,
  onKeyPress?: (e: any) => void,
  maxLength?: number,
  disabled?: boolean,
  placeholder?: string,
  name?: string,
  spellCheck?: boolean,
  errorMessage?: string,
}

const Textarea = forwardRef(({
  value,
  classNames,
  onChange,
  onBlur,
  onKeyDown,
  onKeyPress,
  onKeyUp,
  maxLength,
  disabled,
  placeholder,
  name,
  spellCheck = false,
  errorMessage,
}: Props, ref: any) => {
  const [textareaValue, setTextareaValue] = useState(value);
  
  useEffect(() => {
    setTextareaValue(value);
  }, [value]);

  return (
    <div>
      <textarea
        className={`
          ${styles.textarea}
          ${classNames && classNames}
        `}
        ref={ref}
        placeholder={placeholder}
        value={textareaValue}
        onChange={(e) => {
          onChange && onChange(e);
          setTextareaValue(e.target.value);
        }}
        onBlur={(e) => {
          onBlur && onBlur(e);
        }}
        onKeyDown={(e) => {
          onKeyDown && onKeyDown(e)
        }}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
        maxLength={maxLength}
        disabled={disabled}
        name={name}
        spellCheck={spellCheck}
      />

      <div>{ errorMessage }</div>
    </div>
  );
});

export default Textarea;