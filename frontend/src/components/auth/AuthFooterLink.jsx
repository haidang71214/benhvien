export default function AuthFooterLink({ text, linkText, linkHref }) {
  return (
    <div className="mt-6 text-center text-sm text-gray-500">
      {text}{" "}
      <a
        href={linkHref}
        className="font-medium underline underline-offset-4 text-blue-600 hover:text-blue-700"
      >
        {linkText}
      </a>
    </div>
  );
}