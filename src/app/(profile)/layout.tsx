export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen place-content-center">{children}</div>
  )
}
