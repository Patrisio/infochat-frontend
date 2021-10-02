import { TariffState, TariffActionTypes } from 'types/tariff';

import operatorsTariff from 'assets/operators-tariff.svg';
import chatTariff from 'assets/chat-tariff.svg';
import templatesTariff from 'assets/templates-tariff.svg';

const initialState: TariffState = {
  period: 1,
  plan: {
    operators: {
      imageSrc: operatorsTariff,
      name: 'Операторы',
      description: 'Первый оператор — бесплатно, далее 450 ₽ в месяц за оператора',
      count: 1,
      price: 450,
      category: 'multiple',
    },
    templates: {
      imageSrc: templatesTariff,
      name: 'Шаблоны ответов',
      description: 'Возможность создавать шаблоны быстрых ответов для операторов',
      count: 0,
      price: 270,
      category: 'binary',
    },
    infochatLink: {
      imageSrc: templatesTariff,
      name: 'Отключение ссылки',
      description: 'Возможность отключить ссылку на Infochat в вашем чате на сайте',
      count: 0,
      price: 300,
      category: 'binary',
    },
    chat: {
      imageSrc: chatTariff,
      name: 'Чат на сайтe',
      description: 'Получайте и отвечайте на сообщения с вашего сайта',
      count: 0,
      price: 0,
      category: 'binary',
    },
  },
};

export const tariffReducer = (state = initialState, action: any): TariffState => {
  switch (action.type) {
    case TariffActionTypes.TARIFF_UPDATE:
      if (Array.isArray(action.payload)) {
        const tariffPlan = action.payload;
        let formattedTariffPlan: any = {};

        for (let i = 0; i < tariffPlan.length; i++) {
          const tariffFeature = tariffPlan[i];
          const featureId = tariffFeature.id

          formattedTariffPlan[featureId] = { count: tariffFeature.count };

          formattedTariffPlan = {
            ...formattedTariffPlan,
            [featureId]: {
              ...state.plan[featureId],
              ...formattedTariffPlan[featureId],
            },
          };
        }

        return {
          ...state,
          plan: formattedTariffPlan,
        };
      } else {
        const { featureId, count } = action.payload;

        return {
          ...state,
          plan: {
            ...state.plan,
            [featureId]: {
              ...state.plan[featureId],
              count,
            }
          }
        };
      }
    
    case TariffActionTypes.TARIFF_PERIOD_UPDATE:
      const { period } = action.payload;

      return {
        ...state,
        period,
      };

    default:
      return state;
  }
};