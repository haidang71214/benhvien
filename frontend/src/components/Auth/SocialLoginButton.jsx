import { GoogleIcon } from "../google-icon";

export default function SocialLoginButton({ text = "Đăng nhập với Google" }) {
  const handleGoogleLogin = () => {
    // nhớ sửa cái này trước khi deploy
    window.location.href = "http://localhost:8080/api/v1/auth/auth/google";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-white text-black border border-gray-300 px-6 py-2 rounded shadow-sm hover:bg-gray-100 flex items-center justify-center gap-2 mx-auto w-full"
    >
      <div className="w-5 h-5">
        <GoogleIcon />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
}