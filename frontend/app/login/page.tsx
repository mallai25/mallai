'use client';
import { useState, useEffect, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import LogoImage from './Images/download.png';
import MainImage from './Images/cpg.jpg'
import { useRouter, useSearchParams } from 'next/navigation';

function AuthContent() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const action = searchParams.get('action');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      if (userCredential.user) {
        const userRef = doc(FIREBASE_DB, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const currentLogins = userDoc.data().loginCount || 0;
          await updateDoc(userRef, {
            loginCount: currentLogins + 1,
            lastLogin: new Date()
          });
        } else {
          await setDoc(userRef, {
            loginCount: 1,
            lastLogin: new Date(),
            email: userCredential.user.email
          });
        }

        if (productId && action === 'claim') {
          await updateDoc(doc(FIREBASE_DB, 'products', productId), {
            claimedListing: true,
            isTemporary: false,
            userId: userCredential.user.uid
          });
        }
        router.push('/home');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        await setDoc(doc(FIREBASE_DB, 'users', userCredential.user.uid), {
          loginCount: 1,
          lastLogin: new Date(),
          email: userCredential.user.email,
          displayName: name
        });

        if (productId && action === 'claim') {
          await updateDoc(doc(FIREBASE_DB, 'products', productId), {
            claimedListing: true,
            isTemporary: false,
            userId: userCredential.user.uid
          });
        }
        // Redirect to new user page with pricing plans instead of home
        router.push('/newuser');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-white p-2 md:p-4">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl p-4 md:p-8 bg-white rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.03)] border border-gray-100">
          {/* Grid container with responsive columns */}
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr,1fr]  gap-6 md:gap-6 items-start">
            {/* Left side - Image */}
            <div className="hidden md:block relative h-[500px]">
              <Image
                src={MainImage}
                alt={'CPG'}
                fill
                sizes="(max-width: 768px) 100vw, 90vw"
                className="object-cover rounded-3xl transition-all duration-500 transform"
                priority
              />
            </div>

            {/* Mobile Image */}
            <div className="md:hidden w-full h-[200px] relative rounded-2xl overflow-hidden mb-6">
              <Image
                src={MainImage}
                alt={'CPG'}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Right side - Form */}
            <div className="space-y-6 flex flex-col items-center text-center w-full">
              <div className="w-full flex items-center justify-between mb-6">
                {/* Back Button */}
                <button 
                  onClick={() => router.push('/')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>

                {/* Logo Section - Centered */}
                <div className="flex items-center gap-3">
                  <Image 
                    src={LogoImage}
                    alt="Mall AI Logo" 
                    width={40}
                    height={40}
                    className="rounded-xl w-[40px] md:w-[50px]"
                  />
                  <span className="text-xl md:text-2xl font-bold text-black">Mall AI</span>
                </div>

                {/* Empty div for centering */}
                <div className="w-[28px]"></div>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              
              <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4 md:space-y-6 w-full max-w-sm">
                <div className="space-y-3 md:space-y-4">
                  {!isLogin && (
                    <div className="relative group">
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="pl-12 h-14 bg-white/50 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="relative group">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 h-14 bg-white/50 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                  </div>
                  <div className="relative group">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 h-14 bg-white/50 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {error && <p className="text-sm text-red-500">{error}</p>}
                
                <Button
                  type="submit"
                  className="w-full h-12 md:h-14 bg-gradient-to-r from-[#4147d5] to-[#5159ff] hover:from-[#5159ff] hover:to-[#4147d5] text-white rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 text-lg md:text-base font-medium"
                  disabled={loading}
                >
                  {loading ? (isLogin ? 'Signing in...' : 'Signing up...') : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>

                {/* Toggle Link */}
                <div className="text-center mt-4 md:mt-6">
                  <p className="text-sm md:text-base text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 text-[#4147d5] hover:text-[#5159ff] font-medium transition-colors duration-200"
                    >
                      {isLogin ? 'Create one' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>    
  );
}

// Main page component with Suspense boundary
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white p-2 md:p-4 flex items-center justify-center">
        <div className="text-gray-600"></div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
