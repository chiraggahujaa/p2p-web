import { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/stores/useAppStore";
import { authAPI } from "@/lib/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  VerifyEmailRequest,
  PhoneLoginRequest,
  PhoneOtpVerificationRequest,
} from "@/types/auth";

type ApiError = Error & { response?: { data?: { error?: string } } };

export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    clearError,
    logout: storeLogout,
    setTokens,
  } = useAppStore();

  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hasTokens = !!(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
    
    if (!user && hasTokens) {
      setLoading(true);
      authAPI
        .refreshToken()
        .then((res) => {
          if (res.success && res.data?.user && res.data?.session) {
            const session = res.data.session as { access_token?: string; refresh_token?: string } | null;
            if (session?.access_token && session?.refresh_token) {
              setTokens(session.access_token, session.refresh_token);
            }
            
            const userData = res.data.user;
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              emailConfirmedAt: userData.emailConfirmedAt,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
            });
          } else {
            storeLogout();
          }
        })
        .catch(() => {
          storeLogout();
        })
        .finally(() => setLoading(false));
    } else if (!hasTokens && !user) {
      setLoading(false);
    }
  }, [user, setLoading, setTokens, setUser, storeLogout]);

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;
        const sessionData = session as { access_token?: string; refresh_token?: string } | null;
        
        if (sessionData?.access_token && sessionData?.refresh_token) {
          setTokens(sessionData.access_token, sessionData.refresh_token);
        }

        if (user) {
          setUser({
            id: user.id,
            email: user.email,
            name: user.name,
            emailConfirmedAt: user.emailConfirmedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
        }

        queryClient.invalidateQueries({ queryKey: ["profile"] });

        toast.success("Login successful!");
        
        router.push('/');
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;
        const isEmailConfirmed = user?.emailConfirmedAt !== null;
        
        if (isEmailConfirmed) {
          const sessionData = session as { access_token?: string; refresh_token?: string } | null;
          if (sessionData?.access_token && sessionData?.refresh_token) {
            setTokens(sessionData.access_token, sessionData.refresh_token);
          }

          if (user) {
            setUser({
              id: user.id,
              email: user.email,
              name: user.name,
              emailConfirmedAt: user.emailConfirmedAt,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            });
          }

          queryClient.invalidateQueries({ queryKey: ["profile"] });
          toast.success(response.message || "Registration successful!");
        } else {
          toast.success(response.message || "Registration successful! Please check your email to verify your account.");
        }
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: (response) => {
      storeLogout();
      queryClient.clear();
      if (response?.success) {
        toast.success(response.message || "Logged out successfully");
      } else {
        toast.error(response?.message || "Logout failed");
      }
    },
    onError: (error: ApiError) => {
      storeLogout();
      queryClient.clear();
      console.error("Logout error:", error);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authAPI.resetPassword(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Password reset email sent!");
      } else {
        toast.error(response.message || "Failed to send reset email");
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || "Failed to send reset email";
      toast.error(errorMessage);
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: UpdatePasswordRequest) => authAPI.updatePassword(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Password updated successfully!");
      } else {
        toast.error(response.message || "Failed to update password");
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || "Failed to update password";
      toast.error(errorMessage);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: VerifyEmailRequest) => authAPI.verifyEmail(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;

        if (user) {
          setUser({
            id: user.id,
            email: user.email,
            name: user.name,
            emailConfirmedAt: user.emailConfirmedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
        }

        const sessionData = session as { access_token?: string; refresh_token?: string } | null;
        if (sessionData?.access_token && sessionData?.refresh_token) {
          setTokens(sessionData.access_token, sessionData.refresh_token);
        }

        toast.success(response.message || "Email verified successfully!");
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || "Email verification failed";
      toast.error(errorMessage);
    },
  });

  const sendPhoneOtpMutation = useMutation({
    mutationFn: (data: PhoneLoginRequest) => authAPI.sendPhoneOtp(data),
    onSuccess: (response) => {
      toast.success(response.message || "OTP sent successfully!");
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || "Failed to send OTP";
      toast.error(errorMessage);
    },
  });

  const verifyPhoneOtpMutation = useMutation({
    mutationFn: (data: PhoneOtpVerificationRequest) => authAPI.verifyPhoneOtp(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;

        const sessionData = session as { access_token?: string; refresh_token?: string } | null;
        if (sessionData?.access_token && sessionData?.refresh_token) {
          setTokens(sessionData.access_token, sessionData.refresh_token);
        }

        if (user) {
          setUser({
            id: user.id,
            email: user.email,
            name: user.name,
            emailConfirmedAt: user.emailConfirmedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
        }

        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success(response.message || "Phone verification successful!");
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || "Phone verification failed";
      toast.error(errorMessage);
    },
  });

  const googleSignInMutation = useMutation({
    mutationFn: (tokens: { accessToken: string; idToken: string }) => authAPI.googleSignIn(tokens),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;
        const sessionData = session as { access_token?: string; refresh_token?: string } | null;
        
        if (sessionData?.access_token && sessionData?.refresh_token) {
          setTokens(sessionData.access_token, sessionData.refresh_token);
        }
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email,
            name: user.name,
            emailConfirmedAt: user.emailConfirmedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
        }
        
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success(response.message || 'Signed in with Google');
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || 'Google sign-in failed';
      toast.error(errorMessage);
    },
  });

  const googleSignUpMutation = useMutation({
    mutationFn: (tokens: { accessToken: string; idToken: string }) => authAPI.googleSignUp(tokens),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;
        const sessionData = session as { access_token?: string; refresh_token?: string } | null;
        
        if (sessionData?.access_token && sessionData?.refresh_token) {
          setTokens(sessionData.access_token, sessionData.refresh_token);
        }
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email,
            name: user.name,
            emailConfirmedAt: user.emailConfirmedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
        }
        
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success(response.message || 'Signed up with Google');
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || 'Google sign-up failed';
      toast.error(errorMessage);
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      loginMutation.mutate({ email, password });
    },
    [loginMutation]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      return new Promise((resolve, reject) => {
        registerMutation.mutate(
          { name, email, password },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          }
        );
      });
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const resetPassword = useCallback(
    async (email: string) => {
      resetPasswordMutation.mutate({ email });
    },
    [resetPasswordMutation]
  );

  const updatePassword = useCallback(
    async (password: string, currentPassword?: string) => {
      updatePasswordMutation.mutate({ password, currentPassword });
    },
    [updatePasswordMutation]
  );

  const verifyEmail = useCallback(
    async (token: string, type: "signup" | "email" | "recovery", email?: string) => {
      verifyEmailMutation.mutate({ token, type, email });
    },
    [verifyEmailMutation]
  );

  const sendPhoneOtp = useCallback(
    async (phone: string) => {
      sendPhoneOtpMutation.mutate({ phone });
    },
    [sendPhoneOtpMutation]
  );

  const verifyPhoneOtp = useCallback(
    async (phone: string, otp: string) => {
      verifyPhoneOtpMutation.mutate({ phone, otp });
    },
    [verifyPhoneOtpMutation]
  );

  const isAuthenticated = !!user;
  const derivedIsLoading = isLoading || loginMutation.isPending || registerMutation.isPending;

  return {
    user,
    isLoading: derivedIsLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    verifyEmail,
    sendPhoneOtp,
    verifyPhoneOtp,
    googleSignIn: (tokens: { accessToken: string; idToken: string }) => googleSignInMutation.mutate(tokens),
    googleSignUp: (tokens: { accessToken: string; idToken: string }) => googleSignUpMutation.mutate(tokens),
    clearError,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isUpdatingPassword: updatePasswordMutation.isPending,
    isVerifyingEmail: verifyEmailMutation.isPending,
    isSendingOtp: sendPhoneOtpMutation.isPending,
    isVerifyingOtp: verifyPhoneOtpMutation.isPending,
    isGoogleSigningIn: googleSignInMutation.isPending,
    isGoogleSigningUp: googleSignUpMutation.isPending,
  };
};
