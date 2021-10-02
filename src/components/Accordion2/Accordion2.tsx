import React, { useState, cloneElement } from 'react';
import Panel from './components/Panel/Panel';
import styles from './accordion2.module.scss';

interface PanelInterface {
  imageSrc: string,
  label: string,
  content: React.ReactElement,
}

interface AccordionProps {
  panels: PanelInterface[],
}

export default function Accordion({ panels }: AccordionProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
	
	const activateTab = (index: number) => {
    setActiveTab(prev => prev === index ? -1 : index );
  }

  return (
    <div
      className={styles.accordion}
      role='tablist'
      data-test="accordion2-component"
    >
      {
        panels.map((panel, index) => {
          const updatedPanel = Object.assign(panel, { content: cloneElement(panel.content, { setActiveTab }) });

          return (
            <Panel
              key={index}
              activeTab={activeTab}
              index={index}
              {...updatedPanel}
              activateTab={() => activateTab(index)}
            />
          );
        })
      }
    </div>
  );
}