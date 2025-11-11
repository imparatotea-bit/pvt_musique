export default function Layout({ children, className = '' }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className={`w-full max-w-4xl ${className}`}>
        {children}
      </div>
    </div>
  );
}
