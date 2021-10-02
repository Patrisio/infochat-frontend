import React from 'react';
import { Link } from 'react-router-dom';
import { useParams, useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

import Sidebar from 'ui/Sidebar/Sidebar';
import SidebarList from 'ui/Sidebar/components/SidebarList/SidebarList';
import Teammates from '../Teammates/Teammates';
import Start from '../Start/Start';
import Channels from '../Channels/Channels';
import Templates from '../Templates/Templates';
import Statistics from '../Statistics/Statistics';
import Tariff from '../Tariff/Tariff';
import Bills from '../Bills/Bills';

import styles from './settings.module.scss';
import colors from 'scss/variables.module.scss';

export default function Settings() {
  let { projectId, pageId } = useParams<{ projectId: string, pageId: string }>();
  const history = useHistory();

  const settingsTitle = () => {
    const location = {
      pathname: `/project/${projectId}/settings/start`,
      state: { feature: 'settings' }
    };
    return (
      <Link
        className={styles.title}
        to={location}
      >
        Настройки
      </Link>
    );
  };

  const billingTitle = () => {
    const location = {
      pathname: `/project/${projectId}/settings/start`,
      state: { feature: 'billing' }
    }

    return (
      <Link 
        className={styles.title}
        to={location}
      >
        Тариф и оплата
      </Link>
    );
  };

  const formatSettings = () => {
    const channels = {
      name: 'Каналы',
      stylesList: {
        color: colors.$brown10,
      },
      onClick: () => history.push(`/project/${projectId}/settings/channels`),
    };
    const teammates = {
      name: 'Сотрудники',
      stylesList: {
        color: colors.$brown10,
      },
      onClick: () => {
        history.push({
          pathname: `/project/${projectId}/settings/teammates`,
          state: { page: 'teammates' }
        });
      },
    };
    const templates = {
      name: 'Шаблоны ответов',
      stylesList: {
        color: colors.$brown10,
      },
      onClick: () => {
        history.push(`/project/${projectId}/settings/templates`)
      },
    };
    const statistics = {
      name: 'Статистика',
      stylesList: {
        color: colors.$brown10,
      },
      onClick: () => {
        history.push(`/project/${projectId}/settings/statistics`)
      },
    };

    const dialogs = [channels, teammates, templates, statistics];

    return dialogs;
  };

  const formatBilling = () => {
    const tariff = {
      name: 'Конфигуратор тарифа',
      stylesList: {
        color: colors.$brown10,
      },
      onClick: () => history.push(`/project/${projectId}/settings/tariff`),
    };
    const bills = {
      name: 'Пополнение счета',
      stylesList: {
        color: colors.$brown10,
      },
      onClick: () => history.push(`/project/${projectId}/settings/bills`),
    };
    const billingHistory = {
      name: 'История транзакций',
      stylesList: {
        color: colors.$brown10,
      },
      onClick: () => {
        history.push(`/project/${projectId}/settings/billing-history`)
      },
    };

    const dialogs = [tariff, bills, billingHistory];

    return dialogs;
  };

  const displayPage = () => {
    switch (pageId) {
      case 'start':
        return <Start />
      case 'teammates':
        return <Teammates />
      case 'channels':
        return <Channels />
      case 'templates':
        return <Templates />
      case 'statistics':
        return <Statistics />
      case 'tariff':
        return <Tariff />
      case 'bills':
        return <Bills />
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <Sidebar mode='light'>
        <Link
          className={styles.link}
          to={`/project/${projectId}/inbox/opened`}
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          <span className={styles.linkText}>Закрыть настройки</span>
        </Link>

        <SidebarList
          mode='light'
          title={settingsTitle()}
          listItems={formatSettings()}
        />

        <SidebarList
          mode='light'
          title={billingTitle()}
          listItems={formatBilling()}
        />
      </Sidebar>

      {displayPage()}
    </div>
  );
}