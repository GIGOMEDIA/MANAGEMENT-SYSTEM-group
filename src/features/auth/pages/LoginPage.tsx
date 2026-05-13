import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/app/store/authStore'
import { toast } from 'sonner'
import { Store, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

// Mock credentials
const MOCK_USERS = [
  { email: 'admin@storems.com', password: 'admin', name: 'Admin User', role: 'admin' as const, id: 'u-1' },
  { email: 'manager@storems.com', password: 'manager', name: 'Sarah Manager', role: 'manager' as const, id: 'u-2' },
  { email: 'staff@storems.com', password: 'staff', name: 'John Staff', role: 'staff' as const, id: 'u-3' },
]

export function LoginPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@storems.com', password: 'admin' },
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800)) // Simulate API call

    const matched = MOCK_USERS.find(u => u.email === data.email && u.password === data.password)
    if (!matched) {
      toast.error('Invalid email or password')
      setLoading(false)
      return
    }

    login(`mock-jwt-token-${matched.id}`, { id: matched.id, name: matched.name, email: matched.email, role: matched.role })
    toast.success(`Welcome back, ${matched.name}!`)
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left: branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/40">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">StoreMS</h1>
          <p className="text-blue-200 text-lg mb-12 max-w-sm">Enterprise Store Management System for modern businesses</p>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[
              { label: 'Products', value: '2,400+' },
              { label: 'Daily Sales', value: '$12K+' },
              { label: 'Suppliers', value: '50+' },
              { label: 'Users', value: '120+' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-blue-200 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">StoreMS</span>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
            <p className="text-slate-400 text-sm mb-8">Enter your credentials to access the dashboard</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@company.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 mt-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-slate-800/60 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-xs font-medium mb-2">Demo Credentials</p>
              <div className="space-y-1">
                {[
                  { label: 'Admin', email: 'admin@storems.com', pass: 'admin' },
                  { label: 'Manager', email: 'manager@storems.com', pass: 'manager' },
                  { label: 'Staff', email: 'staff@storems.com', pass: 'staff' },
                ].map(c => (
                  <p key={c.label} className="text-slate-500 text-xs">
                    <span className="text-slate-300 font-medium">{c.label}:</span> {c.email} / {c.pass}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
