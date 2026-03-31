import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/components/LoginPage";
import AppLayout from "@/components/AppLayout";
import LoadingState from "@/components/LoadingState";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState className="flex min-h-screen items-center justify-center bg-background" />;
  }

  if (!user) return <LoginPage />;

  return <AppLayout />;
};

export default Index;
