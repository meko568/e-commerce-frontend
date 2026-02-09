import { SignupForm } from '../components/SignupForm';

interface SignupPageProps {
  onNavigateToLogin?: () => void;
}

export function SignupPage({ onNavigateToLogin }: SignupPageProps) {
  return (
    <div className="min-h-screen">
      <SignupForm onNavigateToLogin={onNavigateToLogin} />
    </div>
  );
}
