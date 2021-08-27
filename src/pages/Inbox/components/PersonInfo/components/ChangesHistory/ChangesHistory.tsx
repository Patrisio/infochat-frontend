import React from 'react';

import Modification from '../../../Modification/Modification';

import { InboxState } from '../../../../../../types/inbox';

interface ChangesHistoryProps {
  selectedClient: InboxState['selectedClient']
}

export default function ChangesHistory({ selectedClient }: ChangesHistoryProps) {
  return (
    <>
      {
        selectedClient.changesHistory &&
        selectedClient.changesHistory.map(({ before, after, changeInFieldValue, timestamp }, idx) => {
          return (
            <Modification
              key={idx}
              before={before}
              after={after}
              changeInFieldValue={changeInFieldValue}
              timestamp={timestamp}
            />
          )
        })
      }
    </>
  );
}