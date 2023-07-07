export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen place-content-center bg-slate-50">
      {children}
    </div>
  )
}
