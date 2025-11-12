export default function Layout({ children, className = '' }) {
  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-hidden">
      <div className={`w-full h-full ${className}`}>
        {children}
      </div>
    </div>
  );
}
