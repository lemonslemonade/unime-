import React, { useState, useEffect } from 'react';
import Input from './common/Input';
import { UserType } from '../types';

interface LoginProps {
  onLogin: (userType: UserType) => void;
  userType: UserType;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, userType, onBack }) => {
  type View = 'login' | 'signup' | 'forgotPassword' | 'resetConfirmation' | '2fa';
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');


  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
    }
  }, []);

  const validateEmail = (emailToValidate: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailToValidate) return "Email is required.";
    if (!emailRegex.test(emailToValidate)) return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (passwordToValidate: string) => {
      const errors = [];
      if (passwordToValidate.length < 8) errors.push("at least 8 characters");
      if (!/[a-z]/.test(passwordToValidate)) errors.push("a lowercase letter");
      if (!/[A-Z]/.test(passwordToValidate)) errors.push("an uppercase letter");
      if (!/\d/.test(passwordToValidate)) errors.push("a number");
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(passwordToValidate)) errors.push("a special character");
      if (errors.length > 0) return `Password must contain ${errors.join(', ')}.`;
      return "";
  };

  const handlePrimaryAction = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    const emailValidationResult = validateEmail(email);
    if (emailValidationResult) {
        setEmailError(emailValidationResult);
        return;
    }

    if (view === 'signup') {
        const passwordValidationResult = validatePassword(password);
        if (passwordValidationResult) {
            setPasswordError(passwordValidationResult);
            return;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }
    }

    if (view === 'login') {
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    }
    if (view === 'login' || view === 'signup') {
        setView('2fa');
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(userType);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidationResult = validateEmail(email);
    if (emailValidationResult) {
        setEmailError(emailValidationResult);
        return;
    }
    setView('resetConfirmation');
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) setEmailError('');
    setEmail(e.target.value);
  }

  const handleViewChange = (newView: View) => {
      setEmailError('');
      setPasswordError('');
      setConfirmPasswordError('');
      setPassword('');
      setConfirmPassword('');
      setView(newView);
  }

  const getTitle = () => {
    if (userType === 'business') {
        return view === 'login' ? 'Business Login' : 'Create Business Account';
    }
    return view === 'login' ? 'Welcome Back' : 'Create Account';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-brand-neutral flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-brand-dark">Uni<span className="text-brand-primary">Me</span></h1>
          <p className="text-gray-500 mt-2">{userType === 'business' ? 'Business Portal' : 'Your data, your control.'}</p>
        </div>

        {view === 'login' || view === 'signup' ? (
            <>
                <form className="space-y-4" onSubmit={handlePrimaryAction} noValidate>
                    <h2 className="text-2xl font-bold text-center text-gray-800">{getTitle()}</h2>
                    
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        error={emailError}
                        required
                        autoComplete="email"
                    />

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError('');
                        }}
                        error={passwordError}
                        required
                        autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                    />
                    
                    <div className="flex items-center justify-between h-5">
                       {view === 'login' ? (
                           <div className="flex items-center">
                               <input
                                   id="remember-me"
                                   name="remember-me"
                                   type="checkbox"
                                   checked={rememberMe}
                                   onChange={(e) => setRememberMe(e.target.checked)}
                                   className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                               />
                               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                                   Remember me
                               </label>
                           </div>
                       ) : <span />}
                       {view === 'login' && (
                            <button type="button" onClick={() => handleViewChange('forgotPassword')} className="text-sm font-semibold text-brand-primary hover:underline">
                                Forgot Password?
                            </button>
                        )}
                    </div>

                     {view === 'signup' && (
                        <Input
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                             onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (confirmPasswordError) setConfirmPasswordError('');
                            }}
                            error={confirmPasswordError}
                            required
                            autoComplete="new-password"
                        />
                     )}

                    <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">{view === 'login' ? 'Log In' : 'Sign Up'}</button>
                    
                    <p className="text-center text-sm text-gray-500">
                        {view === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button type="button" onClick={() => handleViewChange(view === 'login' ? 'signup' : 'login')} className="font-semibold text-brand-primary hover:underline ml-1">
                            {view === 'login' ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </form>

                {userType === 'personal' && (
                  <>
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">Or continue with</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    
                    <div className="space-y-3">
                        <button type="button" onClick={() => onLogin(userType)} className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition">
                            <svg className="w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.356-11.303-7.918l-6.522,5.023C9.505,39.556,16.227,44,24,44z"></path>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.596,44,31.219,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                            <span>Sign in with Google</span>
                        </button>
                        <button type="button" onClick={() => onLogin(userType)} className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition">
                            <svg className="w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                              <path fill="#f25022" d="M1 1h9v9H1z"/>
                              <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                              <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                              <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                            </svg>
                            <span>Sign in with Microsoft</span>
                        </button>
                        <button type="button" onClick={() => onLogin(userType)} className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition">
                            <svg className="w-5 h-5 mr-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Enterprise Single Sign-On</span>
                        </button>
                    </div>
                  </>
                )}
                 <button type="button" onClick={onBack} className="w-full text-center text-sm font-semibold text-gray-500 hover:underline mt-4">
                    &larr; Back to account selection
                </button>
            </>
        ) : view === 'forgotPassword' ? (
             <form className="space-y-6" onSubmit={handleForgotPasswordSubmit} noValidate>
                <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
                <p className="text-center text-sm text-gray-500">Enter your email and we'll send a link to get back into your account.</p>
                 <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    error={emailError}
                    required
                    autoComplete="email"
                />
                <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Send Reset Link</button>
                <button type="button" onClick={() => handleViewChange('login')} className="w-full text-center text-sm text-gray-500 hover:underline">Back to Login</button>
            </form>
        ) : view === 'resetConfirmation' ? (
            <div className="text-center space-y-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-brand-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-center text-gray-800">Check Your Email</h2>
                <p className="text-center text-gray-600">If an account exists for the email provided, you will receive a password reset link shortly.</p>
                <button type="button" onClick={() => handleViewChange('login')} className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Back to Login</button>
            </div>
        ) : view === '2fa' ? (
             <form className="space-y-6" onSubmit={handle2FASubmit}>
                <h2 className="text-2xl font-bold text-center text-gray-800">Two-Factor Authentication</h2>
                <p className="text-center text-gray-600">Enter the code from your authenticator app.</p>
                
                <div className="flex justify-center space-x-2">
                    {[...Array(6)].map((_, i) => (
                        <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-md focus:outline-none focus:border-brand-primary" />
                    ))}
                </div>

                <button type="submit" className="w-full bg-brand-success text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">Verify</button>
                <button type="button" onClick={() => handleViewChange('login')} className="w-full text-center text-sm text-gray-500 hover:underline">Back to Login</button>
            </form>
        ) : null}
      </div>
    </div>
  );
};

export default Login;