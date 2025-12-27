interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side with Only Background Image */}
      <div
        className="hidden md:flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/auth.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Right Side Form */}
      <div className="flex items-center justify-center px-5">
        <div className="w-full max-w-xl">{children}</div>
      </div>
    </div>
  )
}
