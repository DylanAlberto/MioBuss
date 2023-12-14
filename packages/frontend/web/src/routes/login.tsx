import React, { useState } from 'react';
import { userState, notificationState } from '../state';
import CustomInput from 'ui/src/components/CustomInput';
import CustomButton from 'ui/src/components/CustomButton';
import apiClient from 'api';
import { NotificationType, codes } from 'types';
import { Link, useNavigate } from 'react-router-dom';
export interface LoginFormProps {
  onLogin?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [password, setPassword] = useState('');
  const { addError, setUserState, errors, email } = userState();
  const { addNotification } = notificationState();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await apiClient.auth.login({ email, password });
    if (!response.success) {
      addError(response.data.error);

      if (response.data.error.code === codes.invalidUserOrPassword.code) {
        addNotification({ message: codes.invalidUserOrPassword.message, type: NotificationType.ERROR, code: codes.invalidUserOrPassword.code });
      }
      if (response.data.error.code === codes.userNotConfirmed.code) {
        sessionStorage.setItem('isCodeSent', JSON.stringify(true));
        navigate('/signup');
      }
    } else {
      sessionStorage.setItem('token', response.data.accessToken);
      setUserState({ token: response.data.accessToken, refreshToken: response.data.refreshToken });
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/');
    };
  }

  return (
    <>
      <div className="p-4 border border-gray-300 rounded max-w-xs">
        <h2 className="text-xl mb-4">Login</h2>
        <div className="mb-4">
          <CustomInput placeholder="Email" type="email" setState={(e) => setUserState({ email: e.target.value })} value={email} />
        </div>
        <div className="mb-4">
          <CustomInput placeholder="Password" type="password" setState={(e) => setPassword(e.target.value)} value={password} />
        </div>
        {
          errors[codes.invalidUserOrPassword.code] &&
          <div className="mb-4 text-center">
            <span>Don't you have an account? </span>
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">Create one</Link>
          </div>
        }
        <CustomButton text="Login" onClick={handleSubmit} />
      </div>
    </>
  );
};

export default LoginForm;
