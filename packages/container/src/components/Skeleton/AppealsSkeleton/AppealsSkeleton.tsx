import React from 'react';
import SkeletonElement from '../SkeletonElement/SkeletonElement';
import styles from './appealsSkeleton.module.scss';

export default function AppealSkeleton() {
  return (
    <>
      {
        [1,2,3,4,5,6,7,8,9,10,11,12].map((item) => (
          <div
            key={item}
            className={styles.appealSkeletonContainer}
          >
            <SkeletonElement type='avatar' width='26px' />
            <div className={styles.appealSkeletonDescription}>
              <SkeletonElement type='title' width='50%' />
              <SkeletonElement type='paragraph'  width='80%' />
              <SkeletonElement type='paragraph'  width='60%' />
            </div>
          </div>
        ))
      }
    </>
  );
}