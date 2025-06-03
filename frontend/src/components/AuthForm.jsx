import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, LogIn, UserPlus } from "lucide-react";
import { GoogleIcon } from "@/components/google-icon";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function AuthForm({
  className,
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  onGoogleLogin,
  mode = "login",
  ...props
}) {
  const isLogin = mode === "login";

  const config = {
    login: {
      title: "Welcome Back!",
      submitText: "Login",
      submitIcon: LogIn,
      loadingText: "Logging in...",
      alternateText: "Don't have an account?",
      alternateLink: "/auth/register",
      alternateLinkText: "Sign up",
      googleText: "Login with Google",
    },
    register: {
      title: "Create Account",
      submitText: "Sign Up",
      submitIcon: UserPlus,
      loadingText: "Creating account...",
      alternateText: "Already have an account?",
      alternateLink: "/auth/login",
      alternateLinkText: "Sign in",
      googleText: "Sign up with Google",
    },
  };

  const currentConfig = config[mode];

  useEffect(() => {
    toast.error(error);
  }, [error]);

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="rounded-xl shadow-lg border border-gray-100">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-800">
            {currentConfig.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col pt-8 pb-8">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                {!isLogin && (
                  <div className="grid gap-2 pb-4">
                    <Label
                      htmlFor="userName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Username
                    </Label>
                    <Input
                      name="userName"
                      type="text"
                      placeholder="Enter your username"
                      required
                      value={formData.userName || ""}
                      onChange={onChange}
                      className={cn(
                        "h-10 text-sm px-3 py-2 border-0 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200",
                        error && "ring-2 ring-red-500 bg-red-50"
                      )}
                      disabled={loading}
                    />
                  </div>
                )}
                <div className="grid gap-2 pb-4">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={onChange}
                    className={cn(
                      "h-10 text-sm px-3 py-2 border-0 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200",
                      error && "ring-2 ring-red-500 bg-red-50"
                    )}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid gap-2 pb-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  {isLogin && (
                    <div className="ml-auto">
                      <a
                        href="/auth/forgot-password"
                        className="text-xs text-blue-600 hover:underline hover:text-blue-700 transition-colors duration-200"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  )}
                </div>
                <Input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={onChange}
                  className={cn(
                    "h-10 text-sm px-3 py-2 border-0 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200",
                    error && "ring-2 ring-red-500 bg-red-50"
                  )}
                  disabled={loading}
                />
              </div>

              {!isLogin && (
                <div className="grid gap-2 pb-4">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword || ""}
                    onChange={onChange}
                    className={cn(
                      "h-10 text-sm px-3 py-2 border-0 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200",
                      error && "ring-2 ring-red-500 bg-red-50"
                    )}
                    disabled={loading}
                  />
                </div>
              )}

              <div className="flex flex-col gap-4 mt-2">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      {currentConfig.loadingText}
                    </>
                  ) : (
                    <>
                      <currentConfig.submitIcon className="w-4 h-4" />
                      {currentConfig.submitText}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onGoogleLogin}
                  className="w-full h-11 text-base font-medium flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <GoogleIcon className="w-5 h-5" />
                  {currentConfig.googleText}
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              {currentConfig.alternateText}{" "}
              <a
                href={currentConfig.alternateLink}
                className="font-medium underline underline-offset-4 text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                {currentConfig.alternateLinkText}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
