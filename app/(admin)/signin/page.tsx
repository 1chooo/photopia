'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center px-6 my-20">
      <div className="max-w-md w-full">
        <div>
          <h1 className="font-semibold mb-7 text-rurikon-800 text-center lowercase">Lin Hugo Photo Sign In</h1>
        </div>
        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-rurikon-300 mb-2 lowercase">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-rurikon-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rurikon-400 focus:border-rurikon-400 text-rurikon-800"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-rurikon-300 mb-2 lowercase">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-rurikon-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rurikon-400 focus:border-rurikon-400 text-rurikon-800"
              />
            </div>
          </div>

          {error && (
            <div className="text-rurikon-800 text-sm text-center mt-7">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm text-white bg-rurikon-800 hover:bg-rurikon-600 focus:outline-none focus:ring-2 focus:ring-rurikon-400 disabled:bg-rurikon-200 disabled:cursor-not-allowed transition-colors lowercase"
            >
              {loading ? 'signing in...' : 'sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
