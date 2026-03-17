import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar/Navbar'

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_20%_0%,rgba(56,189,248,0.10),transparent_60%),radial-gradient(900px_600px_at_80%_10%,rgba(34,197,94,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.2),rgba(2,6,23,1))]" />
      </div>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

