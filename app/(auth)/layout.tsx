export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex items-center flex-col justify-center p-5">
      {children}
    </div>
  )
}
