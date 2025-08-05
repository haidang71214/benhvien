import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import AuthInput from "./AuthInput";
import SocialLoginButton from "./SocialLoginButton";
import AuthFooterLink from "./AuthFooterLink";
import * as Icons from "lucide-react"; // ✅

export default function AuthForm({
  className,
  formData,
  onChange,
  onSubmit,
  loading,
  mode = "login",
  ...props
}) {
  const isLogin = mode === "login";

  const config = {
    login: {
      title: "Welcome Back!",
      submitText: "Login",
      submitIcon: "LogIn",
      loadingText: "Logging in...",
      alternateText: "Don't have an account?",
      alternateLink: "/auth/register",
      alternateLinkText: "Sign up",
      googleText: "Login with Google",
    },
    register: {
      title: "Create Account",
      submitText: "Sign Up",
      submitIcon: "UserPlus",
      loadingText: "Creating account...",
      alternateText: "Already have an account?",
      alternateLink: "/auth/login",
      alternateLinkText: "Sign in",
      googleText: "Sign up with Google",
    },
  };
  const current = config[mode];
  const Icon = Icons[current.submitIcon];

  return (
    <div className={className} {...props}>
      <Card className="rounded-xl shadow-lg border border-gray-100">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-800">
            {current.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <AuthInput
              isLogin={isLogin}
              formData={formData}
              onChange={onChange}
              loading={loading}
              error={false}
            />

            <div className="flex flex-col gap-4 mt-2">
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {current.loadingText}
                  </>
                ) : (
                  <>
                    <Icon className="w-4 h-4" />
                    {current.submitText}
                  </>
                )}
              </Button>

              <SocialLoginButton text={current.googleText} />
            </div>

            <AuthFooterLink
              text={current.alternateText}
              linkText={current.alternateLinkText}
              linkHref={current.alternateLink}
            />
            {/* Forgot password link for login mode */}
            {isLogin && (
              <div className="text-center mt-2">
                <a
                  href="/auth/forgot-password"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
