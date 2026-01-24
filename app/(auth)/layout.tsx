export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh p-5">
      {children}
    </main>
  )
}
