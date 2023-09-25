import React, { useState } from 'react';
import CustomInput from 'ui/src/components/CustomInput';
import CustomButton from 'ui/src/components/CustomButton';
import apiClient from 'api';

export interface SignupFormProps {
  onSignup?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setError('');

    const response = await apiClient.auth.signup({ email, password });
    if (!response.success) {
      console.log(response);
      return;
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h2 className="text-xl mb-4">Create Account</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <CustomInput placeholder="Email" type="email" onChange={handleEmailChange} />
      </div>
      <div className="mb-4">
        <CustomInput placeholder="Password" type="password" onChange={handlePasswordChange} />
      </div>
      <div className="mb-4">
        <CustomInput placeholder="Confirm Password" type="password" onChange={handleConfirmPasswordChange} />
      </div>
      <CustomButton text="Sign Up" onClick={handleSubmit} />
    </div>
  );
};

export default SignupForm;
