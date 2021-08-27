import * as AuthPlayerCreators from './auth';
import * as ChannelsPlayerCreators from './channels';
import * as InboxPlayerCreators from './inbox';
import * as ProjectsPlayerCreators from './projects';
import * as TariffPlayerCreators from './tariff';
import * as TeammatesPlayerCreators from './teammates';
import * as TemplatesPlayerCreators from './templates';

export default {
  ...AuthPlayerCreators,
  ...ChannelsPlayerCreators,
  ...InboxPlayerCreators,
  ...ProjectsPlayerCreators,
  ...TariffPlayerCreators,
  ...TeammatesPlayerCreators,
  ...TemplatesPlayerCreators,
}