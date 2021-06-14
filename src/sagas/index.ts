import { all } from 'redux-saga/effects';
import authSagas from './auth';
import teammatesSagas from './teammates';
import channelsSagas from './channels';
import inboxSagas from './inbox';
import templatesSagas from './templates';
import projectsSagas from './projects';
import tariffSagas from './tariff';

export default function* rootSaga() {
  yield all([
    ...authSagas,
    ...teammatesSagas,
    ...channelsSagas,
    ...inboxSagas,
    ...templatesSagas,
    ...projectsSagas,
    ...tariffSagas,
  ]);
}