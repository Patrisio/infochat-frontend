import React, { useState, useRef } from 'react';
import { useParams } from 'react-router';

import Button from 'ui/Button/Button';

import styles from './installBlock.module.scss';
import { isProduction, host, localBackendHost } from '../../../../lib/utils/constants';

export default function InstallBlock() {
  const [buttonText, setButtonText] = useState('Скопировать код в буфер');
  let { projectId } = useParams<{ projectId: string }>();
  const codeRef = useRef<HTMLDivElement>(null);

  const displayCode = (projectId: string) => {
    const getHost = () => {
      return isProduction ? host : localBackendHost;
    };
    
    return (
      <>
        &lt;
          <span>script</span>
        &gt;
          var a = document.createElement("script"),
              h = "head";
          a.async = true;
          a.src = `{getHost()}/inbox/api/{projectId}/widget`;
          document.getElementsByTagName(h)[0].appendChild(a);
        &lt;
          <span>/script</span>
        &gt;
      </>
    );
  };

  const saveCodeToBuffer = () => {
    const codeElement = codeRef.current;

    if (codeElement) {
      const textForBuffer = codeElement.textContent;

      if (typeof textForBuffer === 'string') {
        const promise = navigator.clipboard.writeText(textForBuffer);

        promise
          .then(() => {
            setButtonText('Скопировано');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <div>
      <p>Вставьте этот код перед закрывающим тегом &lt;/body&gt; на каждой странице вашего сайта.</p>

      <div
        className={styles.codeContainer}
        ref={codeRef}
      >
        {displayCode(projectId)}  
      </div>

      <Button
        type='button'
        fluid
        onClick={saveCodeToBuffer}
      >
        {buttonText}
      </Button>
    </div>
  );
}