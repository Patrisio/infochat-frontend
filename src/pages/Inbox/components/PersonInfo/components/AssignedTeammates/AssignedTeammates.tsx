import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import Input, { IData } from 'ui/Input/Input';
import Tabs from 'ui/Tabs/Tabs';

import { useTypedSelector } from 'hooks/useTypedSelector';

import styles from './assignedTeammates.module.scss';
import { Teammate } from '../../../../../../types/teammates';
import { InboxState } from '../../../../../../types/inbox';
import { useActions } from 'hooks/useActions';
import socket from '../../../../../../socket';

interface ITeammate {
  id?: string | '' |  null,
  icon?: string,
  value: string | '' |  null,
}

interface AssignedTeammatesProps {
  selectedClient: InboxState['selectedClient'],
}

export default function AssignedTeammates({ selectedClient }: AssignedTeammatesProps) {
  const { changeMessagesStatus } = useActions();
  let { projectId } = useParams<{ projectId: string }>();

  const { teammates } = useTypedSelector((state) => state.teammates);

  const [assignedTeammates, setAssignedTeammate] = useState<ITeammate[]>([]);

  const getTeammates = (): IData[] => {
    return teammates
      .filter((teammate) => teammate.status === 'active')
      .map((teammate: Teammate) => ({
        id: teammate.email,
        value: teammate.username
      }));
  };

  const [formattedTeammates, setTeammates] = useState(getTeammates());

  const assignTeammate = (teammate: ITeammate) => {
    const changeMessagesStatusData = {
      clientId: selectedClient.clientId,
      projectId,
      assignedTo: teammate.id,
      messagesStatus: 'opened',
    };
    changeMessagesStatus({
      ...changeMessagesStatusData,
      successCallback: () => {
        socket.emit('changeMessagesStatus', changeMessagesStatusData);
      },
    });

    const foundTeammate = teammates.find((user) => user.email === teammate.id);
    if (foundTeammate) {
      setAssignedTeammate([{
        id: teammate.id,
        value: foundTeammate.username,
      }]);
    }
  };

  const removeAssignedTeammate = (teammate: ITeammate) => {
    changeMessagesStatus({
      clientId: selectedClient.clientId,
      projectId,
      assignedTo: '',
      messagesStatus: 'opened',
    });

    setAssignedTeammate((prev) => prev.filter((assignedTeammate) => assignedTeammate.value !== teammate.value));
  };

  const filterTeammates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredTeammates = getTeammates().filter((teammate) => teammate.value.toLowerCase().includes(value));

    setTeammates(filteredTeammates);
  };

  useEffect(() => {
    const foundTeammate = teammates.find((user) => user.email === selectedClient.assignedTo);
    if (foundTeammate) {
      const assignedTeammate = {
        id: selectedClient.assignedTo,
        value: foundTeammate.username,
      };
  
      setAssignedTeammate([assignedTeammate].filter(item => item.id));
    }
  }, [selectedClient.clientId, selectedClient.assignedTo]);

  return (
    <div>
      <Input
        type='text'
        placeholder='+ Выбрать сотрудника'
        classNames={styles.checkTeammateInput}
        fluid
        onClick={assignTeammate}
        onChange={filterTeammates}
        data={formattedTeammates}
      />

      <Tabs
        data={assignedTeammates}
        removeTab={removeAssignedTeammate}
      />
    </div>
  );
}