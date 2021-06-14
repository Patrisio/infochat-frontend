import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import Title from '../../../../components/Typography/Title/Title';
import Button from '../../../../components/Button/Button';

import { updateTariffPlan, saveTariffPlan } from '../../../../actions';
import { bonus, YEAR } from '../../constants';
import styles from './totalTariffPlan.module.scss';

interface CounterProps {
  featureId: string,
}

export default function TotalTariffPlan() {
  const tariffPeriod = useSelector((state: any) => state.tariff.period);
  const tariffPlan = useSelector((state: any) => state.tariff.plan);
  const dispatch = useDispatch();

  const { projectId } = useParams<{ projectId: string }>();
  const history = useHistory();

  const features = Object.entries(tariffPlan).map((feature: any) => {
    return {
      id: feature[0],
      ...feature[1],
    };
  });

  const updateCounter = (type: 'inc' | 'dec', featureId: string) => {
    const featureCount = tariffPlan[featureId].count;
    dispatch(updateTariffPlan({
      featureId,
      count: type === 'inc' ? featureCount + 1 : featureCount - 1,
    }));
  };

  const getTotalPriceForPeriod = (period: number): number => {
    let totalPriceForOneMonth = 0;

    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      const featureTotalPrice = feature.count * feature.price;
      totalPriceForOneMonth+=featureTotalPrice;
    }

    return totalPriceForOneMonth * period;
  };

  const getBonusAccruals = (period: number): number => {
    const totalPrice = getTotalPriceForPeriod(YEAR);
    return Math.round(totalPrice / 100 * bonus[period]);
  };

  const getPeriodNotice = (word: string): string | undefined => {
    switch (tariffPeriod) {
      case 1:
        return `${word} в месяц:`;
      case 3:
        return `${word} за 3 месяца:`;
      case 6:
          return `${word} за полгода:`;
      case 12:
        return `${word} за год:`
    }
  };

  const totalPrice = getTotalPriceForPeriod(tariffPeriod);

  const Counter = ({ featureId }: CounterProps) => {
    return (
      <div className={styles.counterContainer}>
        <Button
          type='button'
          stylesList={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            height: '15px',
            width: '15px',
            border: '1px solid #ccc',
            borderRadius: '50%',
            background: 'transparent',
            color: '#ccc',
          }}
          onClick={() => updateCounter('dec', featureId)}
        >
          -
        </Button>
        <div className={styles.counterValue}>{tariffPlan[featureId].count}</div>
        <Button
          type='button'
          stylesList={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            height: '15px',
            width: '15px',
            border: '1px solid #ccc',
            borderRadius: '50%',
            background: 'transparent',
            color: '#ccc',
          }}
          onClick={() => updateCounter('inc', featureId)}
        >
          +
        </Button>
      </div>
    );
  };

  const TariffDescription = () => {
    const selectedFeatures = features.filter((feature) => feature.count);

    return (
      <div className={styles.tariffDescriptionContainer}>
        {
          selectedFeatures.map(({ id, name, count, category, price }) => {
            const totalFeaturePrice = price * count * tariffPeriod;

            return (
              <div
                key={id}
                className={styles.feature}
              >
                <p className={styles.featureName}>{name}</p>
                {category === 'multiple' && <Counter featureId={id} />}
                <p className={styles.featurePrice}>
                  {price === 0 ? <span className={styles.freePrice}>Бесплатно</span> : `${totalFeaturePrice} ₽`}
                </p>
              </div>
            );
          })
        }
      </div>
    );
  };

  const BonusTotalPrice = () => {
    const bonusAccruals = getBonusAccruals(tariffPeriod);

    return (
      <div className={styles.bonusTotalPriceContainer}>
        <div className={`${styles.bonusLine} ${styles.grey}`}>
          <span>{getPeriodNotice('Стоимость')}</span>
          <span>{`${totalPrice} ₽`}</span>
        </div>
        <div className={`${styles.bonusLine} ${styles.green}`}>
          <span>{`Бонус +${bonus[tariffPeriod]}%:`}</span>
          <span>{`+${bonusAccruals} ₽`}</span>
        </div>
        <div className={`${styles.bonusLine} ${styles.grey}`}>
          <span>Будет на счету:</span>
          <span>{`${totalPrice + bonusAccruals} ₽`}</span>
        </div>
      </div>
    );
  };

  const TotalPrice = () => {
    const goToBillsPage = () => {
      history.push({
        pathname: `/project/${projectId}/settings/bills`,
        state: { totalPrice },
      });
    };

    const updateTariffPlan = () => {
      const { operators, infochatLink, chat, templates } = tariffPlan;
      dispatch(saveTariffPlan({
        projectId,
        operatorsCount: operators.count,
        infochatLinkCount: infochatLink.count,
        chatCount: chat.count,
        templatesCount: templates.count,
      }));
    };

    return (
      <div className={styles.totalContainer}>
        <div className={styles.totalPriceContainer}>
          <Title level='3' weight='semibold'>{getPeriodNotice('Итого')}</Title>
          <Title level='3' weight='semibold'>{`${totalPrice} ₽`}</Title>
        </div>

        <Button
          type='button'
          fluid
          stylesList={{
            padding: '15px 10px',
            marginBottom: '10px',
          }}
          onClick={updateTariffPlan}
        >
          Сохранить изменения
        </Button>
        <Button
          type='button'
          fluid
          stylesList={{
            padding: '15px 10px',
            marginBottom: '10px',
          }}
          onClick={goToBillsPage}
        >
          {`Оплатить ${totalPrice} ₽`}
        </Button>
      </div>
    );
  };

  const Prompt = () => {
    return tariffPeriod === YEAR ?
    <div className={styles.promptContainer}>
      <Title level='4' weight='semibold'>Поздравляем!</Title>
      <span className={styles.promptText}>Вы применили максимальную скидку 25%!</span>
    </div> :
    <div className={styles.promptContainer}>
      <Title level='4' weight='semibold'>Получите бонус 25% при оплате сразу за год!</Title>

      <span className={styles.promptText}>
        При пополнении счета сразу на год мы зачислим на счет дополнительно
        <span className={styles.proptBonus}>{`${getBonusAccruals(YEAR)} ₽`}</span>
      </span>
    </div>
  };

  return (
    <div className={styles.totalTariffPlanContainer}>
      <div className={styles.tariffContainer}>
        <Title level='3' weight='bold'>Мой баланс:</Title>

        <div className={styles.balance}>
          <p>Баланс</p>
          0
        </div>

        <Link
          to={`/project/${projectId}/settings/bills`}
          className={styles.link}
        >
          Пополнить счет
        </Link>
      </div>

      <div className={styles.tariffContainer}>
        <Title level='3' weight='bold'>Мой тариф</Title>
        <TariffDescription />
        {tariffPeriod > 1 && <BonusTotalPrice />}
        <TotalPrice />
        <Prompt />
      </div>
    </div>
  );
}