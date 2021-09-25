import React from 'react';
import SkeletonElement from '../SkeletonElement/SkeletonElement';
import styles from './clientInfoSkeleton.module.scss';

export default function ClientInfoSkeleton() {
  return (
    <div className={styles.clientInfoSkeletonContainer}>
      <div className={styles.clientInfoSkeletonHeader}>
        <SkeletonElement type='avatar' width='60px' />

        <div className={styles.clientInfoSkeletonDescription}>
          <SkeletonElement type='title' width="50%" />
          <SkeletonElement type='paragraph' width='80%' />
          <SkeletonElement type='paragraph' width="70%" />
        </div>
      </div>

      <div className={styles.clientInfoSkeletonEntity}>
        {
          [1,2,3,4].map((item) => (
            <div
              key={item}
              className={styles.clientInfoSkeletonEntityItem}
            >
              <SkeletonElement type='title' width='65%' />
              <SkeletonElement type='paragraph' width='35%' />
            </div>
          ))
        }
      </div>

      {
        [1,2,3,4].map((item) => (
          <div
            key={item}
            className={styles.clientInfoSkeletonNote}
          >
            <SkeletonElement type='title' width='45%' />
            <SkeletonElement type='paragraph' width='90%' />

            <div className={styles.clientInfoSkeletonNoteDescription}>
              <SkeletonElement type='title' width='45%' />
              <SkeletonElement type='paragraph' width='90%' />
              <SkeletonElement type='paragraph' width='80%' />
              <SkeletonElement type='paragraph' width='60%' />
              <SkeletonElement type='paragraph' width='60%' />
            </div>
          </div>
        ))
      }
    </div>
  );
}