import AuthPage from './AuthPage';
export default function Login({ status, canResetPassword }) {
    return <AuthPage defaultTab="login" status={status} canResetPassword={canResetPassword} />;
}
