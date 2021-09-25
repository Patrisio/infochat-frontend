import React, { ReactElement } from 'react';

import Panel from './components/Panel/Panel';

interface Panel {
  title: string,
  count: number | undefined | null,
  content: React.ReactElement,
  isVisible: boolean,
}

interface AccordionProps {
  panels: Panel[],
}

export default function Accordion({ panels }: AccordionProps) {
  return (
    <div>
      {
        panels.map(({ title, content, count, isVisible }, idx) => {
          return isVisible ?
          <Panel
            key={idx}
            title={title}
            content={content}
            count={count}
          /> : null;
        })
      }
    </div>
  );
}