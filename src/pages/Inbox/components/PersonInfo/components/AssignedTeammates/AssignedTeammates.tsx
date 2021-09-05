import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import Input, { IData } from '../../../../../../components/Input/Input';
import Tabs from '../../../../../../components/Tabs/Tabs';

import { useTypedSelector } from '../../../../../../hooks/useTypedSelector';

import styles from './assignedTeammates.module.scss';
import { Teammate } from '../../../../../../types/teammates';
import { InboxState } from '../../../../../../types/inbox';
import { useActions } from '../../../../../../hooks/useActions';

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

  const { teammates } = useTypedSelector((state: any) => state.teammates);

  const [assignedTeammates, setAssignedTeammate] = useState<ITeammate[]>([]);

  const getTeammates = (): IData[] => {
    return teammates
      .filter((teammate: any) => teammate.status === 'active')
      .map((teammate: Teammate) => ({
        id: teammate.email,
        value: teammate.username
      }));
  };

  const [formattedTeammates, setTeammates] = useState(getTeammates());

  const assignTeammate = (teammate: ITeammate) => {
    changeMessagesStatus({
      clientId: selectedClient.clientId,
      projectId,
      assignedTo: teammate.id,
      messagesStatus: 'opened',
    });

    console.log(teammate.id);
    const teammateName = teammates.find((user: Teammate) => user.email === teammate.id).username;
    console.log(teammateName, 'teammateName');
    setAssignedTeammate([{
      id: teammate.id,
      value: teammateName,
    }]);
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

  const filterTeammates = (e: any) => {
    const value = e.target.value.toLowerCase();
    const filteredTeammates = getTeammates().filter((teammate: any) => teammate.value.toLowerCase().includes(value));

    setTeammates(filteredTeammates);
  };

  useEffect(() => {
    const teammateName = teammates.find((user: Teammate) => user.email === selectedClient.assignedTo)?.username;
    const assignedTeammate = {
      id: selectedClient.assignedTo,
      value: teammateName,
    };

    setAssignedTeammate([assignedTeammate].filter(item => item.id));
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