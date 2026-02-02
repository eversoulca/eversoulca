import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { LogIn, Eye, EyeOff, Mail } from "lucide-react";

interface LoginPageProps {
  onLogin: (token: string, user: any) => void;
  onSwitchToSignup: () => void;
}

export function LoginPage({ onLogin, onSwitchToSignup }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 2FA states
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5266/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Invalid credentials");
      }

      const data = await response.json();

      // Check if 2FA is required
      if (data.requiresEmailTwoFactor) {
        setRequiresTwoFactor(true);
        setUserId(data.userId);
        setPassword(""); // Clear password for security
        return;
      }

      // Standard login (no 2FA)
      const token = data.accessToken;
      const user = data.user || { username };
      onLogin(token, user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (twoFactorCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5266/api/auth/verify-email-2fa/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: twoFactorCode }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Invalid verification code");
      }

      const data = await response.json();
      const token = data.accessToken;
      const user = data.user || { username };
      onLogin(token, user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setRequiresTwoFactor(false);
    setTwoFactorCode("");
    setUserId(null);
    setError("");
  };

  if (requiresTwoFactor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Identity</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyTwoFactor} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground text-center">
                  We've sent a verification code to your registered email address.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="twoFactorCode" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setTwoFactorCode(val);
                  }}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code. Code expires in 10 minutes.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || twoFactorCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBackToLogin}
                disabled={isLoading}
              >
                Back to Login
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Didn't receive the code? Check your spam folder or try logging in again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your EverSoul account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={onSwitchToSignup}
              >
                Sign up here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}