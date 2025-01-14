import { AuthForm } from "@/components/auth/AuthForm";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Video-Feed";
  }, []);

  return <AuthForm />;
};

export default Index;
