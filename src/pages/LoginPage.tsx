import { LoginForm } from '../components/LoginForm';

interface LoginPageProps {
  onNavigateToSignup?: () => void;
}

export function LoginPage({ onNavigateToSignup }: LoginPageProps) {
  return (
    <div className="min-h-screen">
      <LoginForm onNavigateToSignup={onNavigateToSignup} />
    </div>
  );
}
