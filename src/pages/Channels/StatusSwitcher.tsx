import React, { useState } from 'react';

import Switcher from '../../components/Switcher/Switcher';

import styles from './channels.module.scss';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';

export default function StatusSwitcher({data}: any) {
  const [statuses, setStatus] = useState([data.status, 'disabled']);
  const [prevStatus, setNewStatus] = useState(data.status);
  const { channels: connectedChannels } = useTypedSelector(state => state.channels);
  const { updateChannelStatusByChannelName } = useActions();
  
  const getChannelStatus = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Ожидание';
      case 'disabled':
        return 'Выключено';
    }
  };

  return (
    <div className={styles.switcher}>
      <span className={`
        ${styles.switcherLabel}
        ${data.status === 'pending' ? styles.pending :
          data.status === 'disabled' ? styles.disabled : ''}
      `}>
        { getChannelStatus(data.status) }
      </span>
      <Switcher
        onChange={(isActive: boolean) => {
          const channel = connectedChannels.find(channel => channel.name === data.name);

          if (channel) {
            if (prevStatus === 'disabled') {
              // channel.status = data.status;
            }
            
            // channel.status = statuses.find(((statusItem: string) => statusItem !== channel.status));
            // setNewStatus(channel.status);
            updateChannelStatusByChannelName({
              name: channel.name,
              status: statuses.find(((statusItem: string) => statusItem !== channel.status)),
            });
          }
        }}
      />
    </div>
  );
};