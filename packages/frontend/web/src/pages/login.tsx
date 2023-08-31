// src/components/LoginForm.tsx
import React, { useState } from 'react';
import CustomInput from 'ui/src/components/CustomInput';
import CustomButton from 'ui/src/components/CustomButton';
import { useDispatch } from 'react-redux';
import { setUser } from '../state/slices/user';

interface LoginFormProps {
  onLogin?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(setUser({ id: '1234', token: 'abc' }));
  };

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h2 className="text-xl mb-4">Login</h2>
      <div className="mb-4">
        <CustomInput placeholder="Email" type="email" onChange={handleEmailChange} />
      </div>
      <div className="mb-4">
        <CustomInput placeholder="Password" type="password" onChange={handlePasswordChange} />
      </div>
      <CustomButton text="Login" onClick={handleSubmit} />
    </div>
  );
};

export default LoginForm;
