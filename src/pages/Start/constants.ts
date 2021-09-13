import channels from '../../assets/channels.svg';
import teammates from '../../assets/teammates.svg';
import template from '../../assets/template.svg';
import stats from '../../assets/stats.svg';
import tariff from '../../assets/tariff.svg';
import bills from '../../assets/bills.svg';
import billingHistory from '../../assets/billing-history.svg';

import colors from '../../scss/variables.module.scss';

interface Feature {
  imageSrc: string,
  alt: string,
  backgroundColor: string,
  title: string,
  description: string,
  linkText: string,
  linkHref: string,
}

export const getSettingsFeatures = (projectId: string): Feature[] => ([
  {
    imageSrc: channels,
    alt: 'channels',
    backgroundColor: colors.green3,
    title: 'Каналы',
    description: 'Добавьте каналы связи для вашего проекта или настройте чат для сайта.',
    linkText: 'Добавить и настроить каналы ›',
    linkHref: `/project/${projectId}/settings/channels`,
  },
  {
    imageSrc: teammates,
    alt: 'teammates',
    backgroundColor: colors.red1,
    title: 'Сотрудники',
    description: 'Пригласите в ваш проект операторов для ответов на входящие сообщения и поддержки клиентов.',
    linkText: 'Добавить и управлять сотрудниками ›',
    linkHref: `/project/${projectId}/settings/teammates`,
  },
  {
    imageSrc: template,
    alt: 'template',
    backgroundColor: colors.green4,
    title: 'Шаблоны ответов',
    description: 'Настройте шаблоны ответов для операторов, чтобы реагировать на сообщения клиентов быстрее.',
    linkText: 'Настроить шаблоны ответов ›',
    linkHref: `/project/${projectId}/settings/templates`,
  },
  {
    imageSrc: stats,
    alt: 'stats',
    backgroundColor: colors.blue10,
    title: 'Статистика',
    description: 'Подключите статистику и определяйте популярные каналы, часы пиковой нагрузки и лучших операторов.',
    linkText: 'Перейти к статистике ›',
    linkHref: `/project/${projectId}/settings/statistics`,
  },
]);

export const getBillingFeatures = (projectId: string): Feature[] => ([
  {
    imageSrc: tariff,
    alt: 'tariff',
    backgroundColor: colors.blue11,
    title: 'Конфигуратор тарифа',
    description: 'Соберите свой собственный тариф и платите только за те услуги, которые вам действительно нужны.',
    linkText: 'Собрать свой тариф ›',
    linkHref: `/project/${projectId}/settings/tariff`,
  },
  {
    imageSrc: bills,
    alt: 'bills',
    backgroundColor: colors.green5,
    title: 'Пополнение счета',
    description: 'Пополните счёт с помощью оплаты картой или выставите счет на оплату для юридического лица.',
    linkText: 'Пополнить счет ›',
    linkHref: `/project/${projectId}/settings/bills`,
  },
  {
    imageSrc: billingHistory,
    alt: 'billing-hsitory',
    backgroundColor: colors.green3,
    title: 'История транзакций',
    description: 'Просмотрите историю пополнений вашего счета, бонусных начислений и суточных списаний за услуги.',
    linkText: 'Посмотреть историю транзакций ›',
    linkHref: `/project/${projectId}/settings/billing-history`,
  },
]);