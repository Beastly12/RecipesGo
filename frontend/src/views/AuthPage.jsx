import { useState } from 'react';
import { CookingPot } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import { LoginService, SignUpService } from '../services/AuthService.mjs';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  message,
  Spin,
  Card,
  Flex,
  Typography,
} from "antd";

const { Title, Text } = Typography;

function FeaturesList() {
  return [
    { icon: '⭐', text: 'Share your favorite recipes' },
    { icon: '💬', text: 'Connect with other chefs' },
    { icon: '❤️', text: 'Save recipes you love' },
    { icon: '📞', text: 'Access anywhere, anytime' },
  ];
}

const AuthPage = () => {
  const features = FeaturesList();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const  navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const handleSignup = async (email, password, username) => {
    if (!password || !email || !username) {
      // setStatus({
      //   message: "Error: No field should be left empty",
      //   isSuccess: false,
      // });
      //TODO: add properregex
      return;
    }

    setIsLoading(true);

    try {
      const signedUp = await SignUpService(email, password, username);
      if (signedUp) {
        messageApi.success('Success! Account created. Please log in now.');
        // User requested to navigate to Login after successful signup
        setIsLogin(true);
      } else {
        messageApi.error('Signup failed. That username or email may already be taken.');
      }
    } catch (error) {
      messageApi.error('An unexpected error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    if (!password || !email) {
      // setStatus({
      //   message: "Error: No field should be left empty",
      //   isSuccess: false,
      // });
      //TODO: add properregex
      return;
    }

    setIsLoading(true);
    try {
      const loggedIn = await LoginService(email, password);
      if (loggedIn) {
        navigate('/'); 
      } else {
        messageApi.error('Login failed. Please check your email and password.');
      }
    } catch (error) {
      messageApi.error('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

   return (
    <Spin spinning={isLoading} tip="Processing...">
      {contextHolder}
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 md:bg-white justify-center items-center p-4">
        <Card
            className="w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden"
            bodyStyle={{ padding: 0 }}
        >
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Left Side Panel */}
            <div className="hidden md:flex bg-[#FF6B6B] text-white flex-col justify-center items-start md:w-1/2 w-full p-8 md:p-12">
              <CookingPot className="w-16 h-16 mb-4 text-white" />

              <Title level={1} className="text-white! text-4xl! font-extrabold! mb-4">
                Prepify
              </Title>

              <Text className="text-white! text-lg! mb-8 opacity-90">
                Join our community of food lovers and discover thousands of delicious recipes.
              </Text>

              <ul className="space-y-4 text-lg">
                {features.map((feature) => (
                  <li key={feature.text} className="flex items-center space-x-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <Text className="text-white! text-base!">{feature.text}</Text>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side Panel */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 md:p-12 bg-white">
              <div className="flex flex-row justify-center items-center mb-8">
                <CookingPot className="w-12 h-12 mr-3 text-[#FF6B6B]" />
                <Title level={2} className="text-gray-800! font-bold! text-4xl! m-0!">
                  Prepify
                </Title>
              </div>

              {/* Toggle Buttons */}
              <div className="flex items-center border border-gray-300 rounded-3xl p-1 w-full max-w-sm h-12 mb-10 bg-gray-100">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`w-1/2 h-full py-2 font-semibold transition-all duration-300 rounded-3xl ${
                    isLogin
                      ? "text-[#FF6B6B] bg-white shadow-md"
                      : "text-gray-500 hover:text-[#FF6B6B]"
                  }`}
                >
                  Login
                </button>

                <button
                  onClick={() => setIsLogin(false)}
                  className={`w-1/2 h-full py-2 font-semibold transition-all duration-300 rounded-3xl ${
                    !isLogin
                      ? "text-[#FF6B6B] bg-white shadow-md"
                      : "text-gray-500 hover:text-[#FF6B6B]"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <div className="w-full max-w-sm">
                {isLogin ? (
                  <LoginForm onLogin={handleLogin} isLoading={isLoading} />
                ) : (
                  <SignUpForm onSignup={handleSignup} isLoading={isLoading} />
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Spin>
  );
};

export default AuthPage;
