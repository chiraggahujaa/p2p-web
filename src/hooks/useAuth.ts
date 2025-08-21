import { useCallback, useEffect, useMemo } from "react";
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

// Type for API errors
type ApiError = Error & { response?: { data?: { error?: string } } };

// Custom hook for authentication logic
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

  // Get user profile query
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: authAPI.getProfile,
    enabled: !!user,
    retry: false,
  });

  // Handle profile query errors
  useEffect(() => {
    if (profile && profile.success === false) {
      storeLogout();
    }
  }, [profile, storeLogout]);

  // Initial hydration from tokens -> try refresh once on mount if no user but tokens exist
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasTokens = !!(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
    if (!user && hasTokens) {
      setLoading(true);
      authAPI
        .refreshToken()
        .then((res) => {
          if (res.success && res.data?.user && res.data?.session) {
            const s = res.data.session as { access_token?: string; refresh_token?: string } | null;
            if (s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string') {
              setTokens(s.access_token, s.refresh_token);
            }
            const u = res.data.user;
            setUser({
              id: u.id,
              email: u.email,
              name: u.name,
              emailConfirmedAt: u.emailConfirmedAt,
              createdAt: u.createdAt,
              updatedAt: u.updatedAt,
            });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
          } else {
            storeLogout();
          }
        })
        .finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;
        const s = session as { access_token?: string; refresh_token?: string } | null;
        if (s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string') {
          setTokens(s.access_token, s.refresh_token);
        }

        if (!user) return;

        // Set user in store
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

        // Invalidate and refetch profile
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

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;

        const isEmailConfirmed = user?.emailConfirmedAt !== null;
        
        if (isEmailConfirmed) {
          const s = session as { access_token?: string; refresh_token?: string } | null;
          if (s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string') {
            setTokens(s.access_token, s.refresh_token);
          }

          // Set user in store
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

          // Invalidate and refetch profile
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          
          toast.success(response.message || "Registration successful!");
          
          router.push('/');
        } else {
          // Don't log user in, they need to verify email first
          toast.success(response.message || "Registration successful! Please check your email to verify your account.");
        }
      }
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.error || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Logout mutation
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
      router.push('/');
    },
    onError: (error: ApiError) => {
      // Even if logout fails on server, clear local state
      storeLogout();
      queryClient.clear();
      console.error("Logout error:", error);
      router.push('/');
    },
  });

  // Reset password mutation
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
      const errorMessage =
        error?.response?.data?.error || "Failed to send reset email";
      toast.error(errorMessage);
    },
  });

  // Update password mutation
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
      const errorMessage =
        error?.response?.data?.error || "Failed to update password";
      toast.error(errorMessage);
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (data: VerifyEmailRequest) => authAPI.verifyEmail(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;

        // Update user in store
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

        const s = session as { access_token?: string; refresh_token?: string } | null;
        if (s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string') {
          setTokens(s.access_token, s.refresh_token);
        }

        toast.success(response.message || "Email verified successfully!");
        
        router.push('/');
      }
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.error || "Email verification failed";
      toast.error(errorMessage);
    },
  });

  // Send phone OTP mutation
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

  // Verify phone OTP mutation
  const verifyPhoneOtpMutation = useMutation({
    mutationFn: (data: PhoneOtpVerificationRequest) =>
      authAPI.verifyPhoneOtp(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;

        const s = session as { access_token?: string; refresh_token?: string } | null;
        if (s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string') {
          setTokens(s.access_token, s.refresh_token);
        }

        // Set user in store
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

        // Invalidate and refetch profile
        queryClient.invalidateQueries({ queryKey: ["profile"] });

        toast.success(response.message || "Phone verification successful!");
        
        router.push('/');
      }
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.error || "Phone verification failed";
      toast.error(errorMessage);
    },
  });

  // Google sign-in mutation
  const googleSignInMutation = useMutation({
    mutationFn: (tokens: { accessToken: string; idToken: string }) => authAPI.googleSignIn(tokens),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;
        const s = session as { access_token?: string; refresh_token?: string } | null;
        if (s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string') {
          setTokens(s.access_token, s.refresh_token);
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
        
        router.push('/');
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || 'Google sign-in failed';
      toast.error(errorMessage);
    },
  });

  // Google sign-up mutation
  const googleSignUpMutation = useMutation({
    mutationFn: (tokens: { accessToken: string; idToken: string }) => authAPI.googleSignUp(tokens),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, session } = response.data;
        const s = session as { access_token?: string; refresh_token?: string } | null;
        if (s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string') {
          setTokens(s.access_token, s.refresh_token);
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
        
        router.push('/');
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || 'Google sign-up failed';
      toast.error(errorMessage);
    },
  });

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      loginMutation.mutate({ email, password });
    },
    [loginMutation]
  );

  // Register function
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

  // Logout function
  const logout = useCallback(async () => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  // Reset password function
  const resetPassword = useCallback(
    async (email: string) => {
      resetPasswordMutation.mutate({ email });
    },
    [resetPasswordMutation]
  );

  // Update password function
  const updatePassword = useCallback(
    async (password: string, currentPassword?: string) => {
      updatePasswordMutation.mutate({ password, currentPassword });
    },
    [updatePasswordMutation]
  );

  // Verify email function
  const verifyEmail = useCallback(
    async (
      token: string,
      type: "signup" | "email" | "recovery",
      email?: string
    ) => {
      verifyEmailMutation.mutate({ token, type, email });
    },
    [verifyEmailMutation]
  );

  // Send phone OTP function
  const sendPhoneOtp = useCallback(
    async (phone: string) => {
      sendPhoneOtpMutation.mutate({ phone });
    },
    [sendPhoneOtpMutation]
  );

  // Verify phone OTP function
  const verifyPhoneOtp = useCallback(
    async (phone: string, otp: string) => {
      verifyPhoneOtpMutation.mutate({ phone, otp });
    },
    [verifyPhoneOtpMutation]
  );

  const derivedIsAuthenticated = useMemo(() => !!user, [user]);
  const derivedIsLoading =
    isLoading ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    profileLoading;

  return {
    user,
    profile: profile?.data || null,
    isLoading: derivedIsLoading,
    error,
    isAuthenticated: derivedIsAuthenticated,
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
    // Mutation states
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
