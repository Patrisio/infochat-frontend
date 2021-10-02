import { lazy } from 'react';

const SignInPage = lazy(() => import('pages/SignInPage/SignInPage'));
const SignUpPage = lazy(() => import('pages/SignUpPage/SignUpPage'));
const Inbox = lazy(() => import('pages/Inbox/Inbox'));
const Chat = lazy(() => import('pages/Chat/Chat'));
const ChatTrigger = lazy(() => import('pages/Chat/ChatTrigger'));
const InviteForm = lazy(() => import('pages/InviteForm/InviteForm'));
const Settings = lazy(() => import('pages/Settings/Settings'));
const Profile = lazy(() => import('pages/Profile/Profile'));
const Projects = lazy(() => import('pages/Projects/Projects'));

interface RouteProps {
  exact: boolean,
  path: string,
  component: any,
  onlyOwner: boolean,
}

interface Routes {
  [key: string]: RouteProps
}

export default {
  route_main: { exact: true, path: '/', component: SignInPage, onlyOwner: false },
  route_sign_in: { exact: false, path: '/signin', component: SignInPage, onlyOwner: false },
  route_sign_up: { exact: false, path: '/signup', component: SignUpPage, onlyOwner: false },
  route_inbox: { exact: false, path: '/project/:projectId/inbox/:dialogType', component: Inbox, onlyOwner: false },
  route_chat_trigger: { exact: false, path: '/project/:projectId/iframe/:clientId/chatTrigger', component: ChatTrigger, onlyOwner: false },
  route_chat: { exact: false, path: '/project/:projectId/iframe/:clientId', component: Chat, onlyOwner: false },
  route_settings: { exact: false, path: '/project/:projectId/settings/:pageId', component: Settings, onlyOwner: true },
  route_invite_teammate: { exact: false, path: '/project/:projectId/teammate/invite/:inviteId', component: InviteForm, onlyOwner: false },
  route_profile: { exact: false, path: '/project/:projectId/profile', component: Profile, onlyOwner: false },
  route_projects: { exact: false, path: '/project/:projectId/projects', component: Projects, onlyOwner: true },
} as Routes;