import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Title from '../../components/Typography/Title/Title';
import Input from '../../components/Input/Input';

import styles from './bills.module.scss';

interface ILocationState {
  totalPrice: number,
}

export default function Bills() {
  const location = useLocation<ILocationState>();
  const totalPrice = location.state?.totalPrice;

  const [userPrice, updateUserPrice] = useState<number>(totalPrice || 0);

  return (
    <div className={styles.billsContainer}>
      <Title level='1' weight='bold'>Пополнение счета</Title>
      <Title level='3' weight='regular'>Пополните счёт или подключите автопополнение, чтобы не беспокоиться о балансе</Title>

      <div className={styles.paymentFormContainer}>
        <div className={styles.paymentRow}>
          <Title level='4' weight='semibold' classNames={styles.paymentRowTitle}>Оплатить</Title>

          <div className={styles.billPayment}>
            <Input
              type='number'
              min={0}
              value={totalPrice || userPrice}
              onChange={(e) => updateUserPrice(e.target.value)}
              addonAfter={<span className={styles.addonAfter}>₽</span>}
            />
            {/* <p>{`— хватит до ${}`}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}