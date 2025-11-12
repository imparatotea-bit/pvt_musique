export default function Layout({ children, className = '' }) {
  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className={`w-full max-w-4xl ${className}`}>
        {children}
      </div>
    </div>
  );
}
