
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-custom-blue">SellerCabinet</h1>
        <p className="text-lg text-gray-600">Streamline your returns management process</p>
      </div>

      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="login">
              <LoginForm />
              <div className="mt-4 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="text-custom-blue hover:text-custom-blue-dark font-medium"
                >
                  Sign up
                </button>
              </div>
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
              <div className="mt-4 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-custom-blue hover:text-custom-blue-dark font-medium"
                >
                  Sign in
                </button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      <div className="mt-12 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Manage Your Returns with Ease</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="rounded-full w-12 h-12 bg-custom-blue-light text-custom-blue flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-bold">Track Returns</h3>
            <p className="text-sm text-gray-600">Monitor all returns from a single dashboard</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="rounded-full w-12 h-12 bg-custom-green-light text-custom-green flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold">Make Decisions</h3>
            <p className="text-sm text-gray-600">Quickly decide what to do with returned items</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="rounded-full w-12 h-12 bg-custom-red-light text-custom-red flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold">Analyze Trends</h3>
            <p className="text-sm text-gray-600">Get insights into your return patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
