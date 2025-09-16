
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  type View = 'login' | 'signup' | 'forgotPassword' | 'resetConfirmation' | '2fa';
  const [view, setView] = useState<View>('login');

  const handlePrimaryAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'login' || view === 'signup') {
        setView('2fa');
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('resetConfirmation');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-brand-neutral flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-brand-dark">Uni<span className="text-brand-primary">Me</span></h1>
          <p className="text-gray-500 mt-2">Your data, your control.</p>
        </div>

        {view === 'login' || view === 'signup' ? (
            <>
                <form className="space-y-4" onSubmit={handlePrimaryAction}>
                    <h2 className="text-2xl font-bold text-center text-gray-800">{view === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                    
                    <div className="relative pt-2">
                        <input type="email" placeholder="Email Address" required className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-brand-primary" />
                        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                    </div>
                    <div className="relative pt-2">
                        <input type="password" placeholder="Password" required className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-brand-primary" />
                        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                    </div>
                    
                    <div className="text-right h-5">
                       {view === 'login' && (
                            <button type="button" onClick={() => setView('forgotPassword')} className="text-sm font-semibold text-brand-primary hover:underline">
                                Forgot Password?
                            </button>
                        )}
                    </div>

                     {view === 'signup' && (
                         <div className="relative pt-2">
                            <input type="password" placeholder="Confirm Password" required className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-brand-primary" />
                            <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Confirm Password</label>
                        </div>
                     )}

                    <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">{view === 'login' ? 'Log In' : 'Sign Up'}</button>
                    
                    <p className="text-center text-sm text-gray-500">
                        {view === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button type="button" onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="font-semibold text-brand-primary hover:underline ml-1">
                            {view === 'login' ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </form>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">Or continue with</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>
                
                <div className="space-y-3">
                    <button type="button" onClick={onLogin} className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition">
                        <svg className="w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.356-11.303-7.918l-6.522,5.023C9.505,39.556,16.227,44,24,44z"></path>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.596,44,31.219,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        <span>Sign in with Google</span>
                    </button>
                    <button type="button" onClick={onLogin} className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition">
                        <svg className="w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                          <path fill="#f25022" d="M1 1h9v9H1z"/>
                          <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                          <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                          <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                        </svg>
                        <span>Sign in with Microsoft</span>
                    </button>
                    <button type="button" onClick={onLogin} className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition">
                        <svg className="w-5 h-5 mr-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Enterprise Single Sign-On</span>
                    </button>
                </div>
            </>
        ) : view === 'forgotPassword' ? (
             <form className="space-y-6" onSubmit={handleForgotPasswordSubmit}>
                <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
                <p className="text-center text-sm text-gray-500">Enter your email and we'll send a link to get back into your account.</p>
                <div className="relative pt-2">
                    <input type="email" placeholder="Email Address" required className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-brand-primary" />
                    <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                </div>
                <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Send Reset Link</button>
                <button type="button" onClick={() => setView('login')} className="w-full text-center text-sm text-gray-500 hover:underline">Back to Login</button>
            </form>
        ) : view === 'resetConfirmation' ? (
            <div className="text-center space-y-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-brand-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-center text-gray-800">Check Your Email</h2>
                <p className="text-center text-gray-600">If an account exists for the email provided, you will receive a password reset link shortly.</p>
                <button type="button" onClick={() => setView('login')} className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Back to Login</button>
            </div>
        ) : view === '2fa' ? (
             <form className="space-y-6" onSubmit={handle2FASubmit}>
                <h2 className="text-2xl font-bold text-center text-gray-800">Two-Factor Authentication</h2>
                <p className="text-center text-gray-600">Enter the code sent to your authenticator app.</p>
                
                <div className="flex justify-center space-x-2">
                    {[...Array(6)].map((_, i) => (
                        <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-md focus:outline-none focus:border-brand-primary" />
                    ))}
                </div>

                <button type="submit" className="w-full bg-brand-success text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">Verify</button>
                <button type="button" onClick={() => setView('login')} className="w-full text-center text-sm text-gray-500 hover:underline">Back to Login</button>
            </form>
        ) : null}
      </div>
    </div>
  );
};

export default Login;
