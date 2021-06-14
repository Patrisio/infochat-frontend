import React, { useState, useEffect } from 'react';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import styles from './textarea.module.scss';

interface Props {
  value?: string,
  classNames?: string,
  onChange?: (e: any) => void,
  onKeyDown?: (e: any) => void,
  maxLength?: number,
  disabled?: boolean,
  placeholder?: string,
  name?: string,
}

export default function Textarea({ value, classNames, onChange, onKeyDown, maxLength, disabled, placeholder, name }: Props) {
  const [textareaValue, setTextareaValue] = useState(value);
  
  useEffect(() => {
    setTextareaValue(value);
  }, [value]);

  return (
    <textarea
      className={`
        ${styles.textarea}
        ${classNames && classNames}
      `}
      placeholder={placeholder}
      value={textareaValue}
      onChange={(e) => {
        onChange && onChange(e);
        setTextareaValue(e.target.value);
      }}
      onKeyDown={(e) => {
        onKeyDown && onKeyDown(e)
      }}
      maxLength={maxLength}
      disabled={disabled}
      name={name}
    />
  );
}