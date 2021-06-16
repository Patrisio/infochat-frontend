import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Title from '../../components/Typography/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import { THREE_MONTHS, SIX_MONTHS, YEAR } from '../../lib/utils/date';
import { bonus } from '../../lib/utils/bonus';
import {
  addMonthsToDate, getMomentDate,
  formatDateWithUserTimezoneToCustomDateFormat
} from '../../lib/utils/date';
import styles from './bills.module.scss';

interface ILocationState {
  totalPrice: number,
  tariffPeriod: number,
  bonusAccruals: number,
}

interface DescriptionProps {
  totalPrice: number,
  bonusAccruals: number,
}

export default function Bills() {
  const getEnoughMoneyDate = () => {
    if (userPrice > 0 && tariffPeriod) {
      const monthsCount = Math.floor((userPrice * tariffPeriod) / totalPrice);
      const enoughMoneyDateWithoutUserTimezone = addMonthsToDate(getMomentDate(), monthsCount);
      return formatDateWithUserTimezoneToCustomDateFormat(enoughMoneyDateWithoutUserTimezone, 'DD.MM.YYYY');
    }
  };

  const location = useLocation<ILocationState>();

  const totalPrice = location.state?.totalPrice;
  const tariffPeriod = location.state?.tariffPeriod;
  const bonusAccruals = location.state?.bonusAccruals;

  const [userPrice, updateUserPrice] = useState<number>(totalPrice || 0);
  const [bonusValue, updatebBonusValue] = useState<number>(bonusAccruals || 0);
  const [selectedPaymentWay, setPaymentWay] = useState<string>('creditCard');

  const enoughMoneyDate = getEnoughMoneyDate();

  const paymentWays = [
    {
      id: 'creditCard',
      name: 'Банковской картой',
    },
    {
      id: 'paymentBill',
      name: 'Выставить счет на оплату',
    },
  ];

  const PromoToPayment = () => {
    const getBonusAccruals = (period: number) => {
      const totalPriceForOneMonth = totalPrice / tariffPeriod;
      const totalPriceForPeriod = totalPriceForOneMonth * period;
      return Math.round(totalPriceForPeriod / 100 * bonus[period]);
    };

    const getTotalPrice = (period: number) => {
      const totalPriceForOneMonth = totalPrice / tariffPeriod;
      return period !== tariffPeriod ? totalPriceForOneMonth * period : totalPrice;
    };

    const updatePaymentInfo = (totalPrice: number, bonusAccruals: number) => {
      updateUserPrice(totalPrice);
      updatebBonusValue(bonusAccruals);
    };

    const Description = ({ totalPrice, bonusAccruals }: DescriptionProps) => {
      return (
        <div className={styles.promoDescription}>
          <span>Оплатите</span>
          <Button
            type='button'
            background='transparent'
            stylesList={{
              padding: '0',
              color: '#0886f8',
              borderBottom: '1px dotted #0886f8',
              borderRadius: '0',
              marginLeft: '5px',
            }}
            onClick={() => updatePaymentInfo(totalPrice, bonusAccruals)}
          >
            {totalPrice} ₽
          </Button>, а мы зачислим на счёт дополнительно
          <span className={styles.bonusAccruals}>{bonusAccruals} ₽</span>
        </div>
      );
    };

    const promoThumbs = [
      {
        period: THREE_MONTHS,
        title: 'Пополните баланс на 3 месяца и получите бонус',
        description: <Description totalPrice={getTotalPrice(THREE_MONTHS)} bonusAccruals={getBonusAccruals(THREE_MONTHS)}/>,
      },
      {
        period: SIX_MONTHS,
        title: 'Пополните баланс на 6 месяцев и получите бонус',
        description: <Description totalPrice={getTotalPrice(SIX_MONTHS)} bonusAccruals={getBonusAccruals(SIX_MONTHS)}/>,
      },
      {
        period: YEAR,
        title: 'Пополните баланс на 1 год и получите бонус',
        description: <Description totalPrice={getTotalPrice(YEAR)} bonusAccruals={getBonusAccruals(YEAR)}/>,
      },
    ];

    return (
      <div>
        {
          promoThumbs
            .filter((promoThumb) => promoThumb.period > tariffPeriod)
            .map(({ title, description }, idx) => {
              return (
                <div key={idx}>
                  <p className={styles.promoTitle}>{title}</p>
                  <p className={styles.promoDescriptionContainer}>{description}</p>
                </div>
              );
            })
        }
      </div>
    )
  };

  const changePaymentWay = (e: any) => {
    setPaymentWay(e.target.value);
  };

  const CreditCardPaymentWay = () => {
    return (
      <div className={styles.paymentWayContent}>
        <p className={styles.paymentWayContentText}>Для совершения платежа вы будете перенаправлены на защищенную страницу оплаты. Моментальное зачисление средств на ваш баланс.</p>
        <Button
          type='button'
          background='success'
          stylesList={{
            padding: '20px 70px',
          }}
        >
          Перейти к оплате
        </Button>
      </div>
    );
  };

  const PaymentBillPaymentWay = () => {
    return (
      <div className={styles.paymentWayContent}>
        <p className={styles.paymentWayContentText}>Будет сформирован счёт на оплату по реквизитам компании, которые вы укажите. Средства будут зачислены на ваш баланс только после обработки платежа по счету.</p>
      </div>
    );
  };

  const displayPaymentWayContent = () => {
    switch (selectedPaymentWay) {
      case 'creditCard':
        return <CreditCardPaymentWay />;
      case 'paymentBill':
        return <PaymentBillPaymentWay />;
    }
  };

  return (
    <div className={styles.billsContainer}>
      <Title level='1' weight='bold'>Пополнение счета</Title>
      <Title level='3' weight='regular'>Пополните счёт или подключите автопополнение, чтобы не беспокоиться о балансе</Title>

      <div className={styles.paymentFormContainer}>
        <div className={styles.paymentRow}>
          <Title level='4' weight='semibold' classNames={styles.paymentRowTitle}>Оплатить</Title>

          <div className={styles.billPayment}>
            <div className={styles.paymentFieldContainer}>
              <Input
                type='number'
                min={0}
                value={userPrice}
                onChange={(e) => updateUserPrice(e.target.value)}
                addonAfter={<span className={styles.addonAfter}>₽</span>}
                classNames={styles.paymentField}
              />
              <p className={styles.enoughMoneyDate}>
                { bonusValue > 0 && <span className={styles.bonus}>{`+ ${bonusValue} ₽ на счет`}</span> }
                { enoughMoneyDate && `— хватит до ${enoughMoneyDate}`}
              </p>
            </div>

            <PromoToPayment />
          </div>
        </div>

        <div className={styles.paymentRow}>
          <Title level='4' weight='semibold' classNames={styles.paymentRowTitle}>Способ оплаты</Title>

          <div className={styles.paymentWaysContainer}>
            <div className={styles.paymentWaysTabs}>
              {
                paymentWays.map(({id, name}) => {
                  const isCheckedPaymentWay = id === selectedPaymentWay;

                  return (
                    <div
                      key={id}
                      className={`
                        ${styles.paymentWayTab}
                        ${isCheckedPaymentWay && styles.paymentWayTabActive}
                      `}
                    >
                      <Input
                        type='radio'
                        classNames={styles.paymentWayRadioButton}
                        label={name}
                        name='paymentWay'
                        value={id}
                        checked={isCheckedPaymentWay}
                        onChange={changePaymentWay}
                      />
                    </div>
                  );
                })
              }
            </div>
            { displayPaymentWayContent() }
          </div>
        </div>
      </div>
    </div>
  );
}