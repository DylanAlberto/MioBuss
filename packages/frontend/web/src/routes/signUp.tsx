import React, { useEffect, useState } from 'react';
import { userState, notificationState } from '../state';
import CustomInput from 'ui/src/components/CustomInput';
import CustomButton from 'ui/src/components/CustomButton';
import apiClient from 'api';
import { NotificationType, codes } from 'types';
import { useNavigate } from 'react-router-dom';

export interface SignupFormProps {
  onSignup?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(JSON.parse(sessionStorage.getItem('isCodeSent') as string) || false);
  const { addError, clearErrors, setUserState, errors, email, token, name, lastName, type } = userState();
  const { addNotification } = notificationState();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    clearErrors();
    if (password !== confirmPassword) {
      addError({ message: codes.passwordNotMatch.message, code: codes.passwordNotMatch.code });
      return;
    }

    const response = await apiClient.auth.signup({ name, lastName, email, password, type });
    if (!response.success) {
      addError(response.data.error);
      return;
    }

    sessionStorage.setItem('isCodeSent', JSON.stringify(true));
    setIsCodeSent(true);
  };

  const handleConfirmCode = async () => {
    const response = await apiClient.auth.confirmUser({ email, confirmationCode });
    if (!response.success) {
      addError(response.data.error);
      return;
    }

    addNotification({ message: codes.accountConfirmed.message, type: NotificationType.SUCCESS, code: codes.accountConfirmed.code });

    const loginResponse = await apiClient.auth.login({ email, password });
    if (!loginResponse.success) {
      addError(loginResponse.data.error);
      return;
    } else {
      setUserState({ token: loginResponse.data.token, refreshToken: loginResponse.data.refreshToken });
    }
  };

  const handleResendCode = async () => {
    const response = await apiClient.auth.resendConfirmationCode({ email });
    if (!response.success) {
      addError(response.data.error);
    } else {
      addNotification({ message: codes.accountConfirmed.message, type: NotificationType.SUCCESS, code: codes.accountConfirmed.code });
    }
  };

  useEffect(() => { }, [isCodeSent]);
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h2 className="text-xl mb-4">Create Account</h2>

      {errors && Object.values(errors).map((error) => <div className="text-red-500 mb-4" key={error.code}>{error.message}</div>)}

      {!isCodeSent ? (
        <>
          <div className="mb-4">
            <CustomInput placeholder="Name" setState={(e) => setUserState({ name: e.target.value })} value={name} />
          </div>
          <div className="mb-4">
            <CustomInput placeholder="Name" setState={(e) => setUserState({ lastName: e.target.value })} value={lastName} />
          </div>
          <div className="mb-4">
            <CustomInput placeholder="Email" type="email" setState={(e) => setUserState({ email: e.target.value })} value={email} />
          </div>
          <div className="mb-4">
            <CustomInput placeholder="Password" type="password" setState={(e) => setPassword(e.target.value)} value={password} />
          </div>
          <div className="mb-4">
            <CustomInput placeholder="Confirm Password" type="password" setState={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
          </div>
          <CustomButton text="Sign Up" onClick={handleSignUp} />
        </>
      ) : (
        <>
          <div className="mb-4">
            <CustomInput placeholder="Confirmation Code" type="text" setState={(e) => setConfirmationCode(e.target.value)} value={confirmationCode} />
            <p className="text-sm text-gray-600 mt-2">
              Check your email for the code. Didn't receive it?
              <button
                onClick={handleResendCode}
                className="text-blue-500 hover:text-blue-700 ml-1"
              >
                Resend Code
              </button>
            </p>
          </div>
          <CustomButton text="Confirm Signup" onClick={handleConfirmCode} />
        </>
      )}
    </div>
  );
};

export default SignupForm;
