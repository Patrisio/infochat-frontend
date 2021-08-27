import { combineReducers } from 'redux';
import { channelsReducer } from './channels';
import { inboxReducer } from './inbox';
import { teammatesReducer } from './teammates';
import { templatesReducer } from './templates';
import { tariffReducer } from './tariff';

export const rootReducer = combineReducers({
  inbox: inboxReducer,
  teammates: teammatesReducer,
  channels: channelsReducer,
  templates: templatesReducer,
  tariff: tariffReducer,
});

export type RootState = ReturnType<typeof rootReducer>;