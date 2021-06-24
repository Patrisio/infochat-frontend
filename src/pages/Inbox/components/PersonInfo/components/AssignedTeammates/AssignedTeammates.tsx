import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Input from '../../../../../../components/Input/Input';
import Tabs from '../../../../../../components/Tabs/Tabs';

import styles from './assignedTeammates.module.scss';
import { Teammate } from '../../../../../../reducers/teammates';
import { State } from '../../../../../../reducers/inbox';
import { changeMessagesStatus } from '../../../../../../actions';

interface ITeammate {
  id?: string | '' |  null,
  icon?: string,
  value: string | '' |  null,
}

interface AssignedTeammatesProps {
  selectedClient: State['selectedClient'],
}

export default function AssignedTeammates({ selectedClient }: AssignedTeammatesProps) {
  const dispatch = useDispatch();
  let { projectId } = useParams<{ projectId: string }>();

  const teammates = useSelector((state: any) => state.teammates.teammates);

  const [assignedTeammates, setAssignedTeammate] = useState<ITeammate[]>([]);

  const getTeammates = () => {
    return teammates.map((teammate: Teammate) => ({
      id: teammate.email,
      value: teammate.username
    }));
  };

  const assignTeammate = (teammate: ITeammate) => {
    dispatch(changeMessagesStatus({
      clientId: selectedClient.clientId,
      projectId,
      assignedTo: teammate.id,
      messagesStatus: 'opened',
    }));

    console.log(teammate.id);
    const teammateName = teammates.find((user: Teammate) => user.email === teammate.id).username;
    console.log(teammateName, 'teammateName');
    setAssignedTeammate((prev) => prev.concat({
      id: teammate.id,
      value: teammateName,
    }));
  };

  const removeAssignedTeammate = (teammate: ITeammate) => {
    dispatch(changeMessagesStatus({
      clientId: selectedClient.clientId,
      projectId,
      assignedTo: '',
      messagesStatus: 'opened',
    }));

    setAssignedTeammate((prev) => prev.filter((assignedTeammate) => assignedTeammate.value !== teammate.value));
  };

  useEffect(() => {
    const teammateName = teammates.find((user: Teammate) => user.email === selectedClient.assignedTo)?.username;
    const assignedTeammate = {
      id: selectedClient.assignedTo,
      value: teammateName,
    };

    setAssignedTeammate([assignedTeammate].filter(item => item.id));
  }, [selectedClient.clientId]);

  return (
    <div>
      <Input
        type='text'
        placeholder='+ Выбрать сотрудника'
        classNames={styles.checkTeammateInput}
        fluid
        onClick={assignTeammate}
        data={getTeammates()}
      />

      <Tabs
        data={assignedTeammates}
        removeTab={removeAssignedTeammate}
      />
    </div>
  );
}