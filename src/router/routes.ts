import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import Inbox from '../pages/Inbox/Inbox';
import Chat from '../pages/Chat/Chat';
import ChatTrigger from '../pages/Chat/ChatTrigger';
import InviteForm from '../pages/InviteForm/InviteForm';
import Settings from '../pages/Settings/Settings';
import Profile from '../pages/Profile/Profile';
import Projects from '../pages/Projects/Projects';

interface RouteProps {
  exact: boolean,
  path: string,
  component: () => JSX.Element,
}

interface Routes {
  [key: string]: RouteProps
}

export default {
  route_main: { exact: true, path: '/', component: SignInPage },
  route_sign_in: { exact: false, path: '/signin', component: SignInPage },
  route_sign_up: { exact: false, path: '/signup', component: SignUpPage },
  route_inbox: { exact: false, path: '/project/:projectId/inbox/:dialogType', component: Inbox },
  route_chat_trigger: { exact: false, path: '/project/:projectId/iframe/:clientId/chatTrigger', component: ChatTrigger },
  route_chat: { exact: false, path: '/project/:projectId/iframe/:clientId', component: Chat },
  route_settings: { exact: false, path: '/project/:projectId/settings/:pageId', component: Settings },
  route_invite_teammate: { exact: false, path: '/project/:projectId/teammate/invite/:inviteId', component: InviteForm },
  route_profile: { exact: false, path: '/project/:projectId/profile', component: Profile },
  route_projects: { exact: false, path: '/project/:projectId/projects', component: Projects },
} as Routes;