'use client'

import { useAuth } from '@/lib/firebase/useAuth'
import useSWR, { mutate } from 'swr'
import { Folder, RefreshCw, Image as ImageIcon, Pin } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SystemStats {
  totalCategories: number
  totalImages: number
  totalHomepageImages: number
  recentActivity: string
}

const fetcher = async (url: string, token?: string) => {
  const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [idToken, setIdToken] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      user.getIdToken().then(setIdToken)
    }
  }, [user])

  // 從 Telegram Images API 獲取圖片資料
  const { data: imagesData, error: imagesError, isLoading: imagesLoading } = useSWR(
    idToken ? ['/api/telegram/images', idToken] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  // 從 Category API 獲取分類資料
  const { data: categoriesData, error: categoriesError, isLoading: categoriesLoading } = useSWR(
    idToken ? ['/api/telegram/category', idToken] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  // 從 Homepage API 獲取首頁精選圖片
  const { data: homepageData, error: homepageError, isLoading: homepageLoading } = useSWR(
    '/api/homepage',
    (url) => fetcher(url),
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  const totalImages = imagesData?.images?.length || 0
  const totalCategories = categoriesData?.categories?.length || 0
  const totalHomepageImages = homepageData?.selectedPhotos?.length || 0

  const stats: SystemStats = {
    totalCategories,
    totalImages,
    totalHomepageImages,
    recentActivity: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isLoading = imagesLoading || categoriesLoading || homepageLoading
  const error = imagesError || categoriesError || homepageError

  return (
    <div>
      <div>
        <h1 className="font-semibold mb-7 text-rurikon-600">Admin</h1>
        <p className="mt-7 text-rurikon-600 lowercase">Welcome back, {user?.email?.split('@')[0]}!</p>

        {error && (
          <div className="mt-7 bg-rurikon-50 border border-rurikon-200 text-rurikon-800 px-4 py-3 rounded">
            Failed to load dashboard data. Please try again.
          </div>
        )}

        {/* Stats Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-rurikon-100 border-l-4 border-l-rurikon-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-rurikon-50 border border-rurikon-200 flex items-center justify-center">
                <Folder className="h-5 w-5 text-rurikon-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-rurikon-400 lowercase">Total Categories</p>
                <p className="text-2xl font-semibold text-rurikon-600 mt-1">
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    stats.totalCategories
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-rurikon-100 border-l-4 border-l-rurikon-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-rurikon-50 border border-rurikon-200 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-rurikon-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-rurikon-400 lowercase">Total Images</p>
                <p className="text-2xl font-semibold text-rurikon-600 mt-1">
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    stats.totalImages
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-rurikon-100 border-l-4 border-l-purple-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
                <Pin className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-rurikon-400 lowercase">Homepage Pinned</p>
                <p className="text-2xl font-semibold text-purple-600 mt-1">
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    stats.totalHomepageImages
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-7 bg-white rounded-lg border border-rurikon-100 p-6">
          <h2 className="font-semibold mb-7 text-rurikon-600 lowercase">System Information</h2>
          <div>
            <div className="flex justify-between py-3 border-b border-rurikon-100">
              <span className="text-rurikon-600 lowercase">Last Activity</span>
              <span className="text-rurikon-600">{stats.recentActivity}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-rurikon-100">
              <span className="text-rurikon-600 lowercase">User Email</span>
              <span className="text-rurikon-600">{user?.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-rurikon-100">
              <span className="text-rurikon-600 lowercase">User ID</span>
              <span className="font-mono text-sm text-rurikon-600">{user?.uid}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-rurikon-600 lowercase">Account Created</span>
              <span className="text-rurikon-600">
                {user?.metadata?.creationTime || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-7 bg-white rounded-lg border border-rurikon-100 p-6">
          <h2 className="font-semibold mb-7 text-rurikon-600 lowercase">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/dashboard/telegram"
              className="flex items-center space-x-4 p-4 bg-rurikon-50 border-2 border-rurikon-200 rounded-lg hover:bg-rurikon-100 hover:border-rurikon-300 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-white border border-rurikon-200 flex items-center justify-center shrink-0">
                <ImageIcon className="h-5 w-5 text-rurikon-600" />
              </div>
              <div>
                <h3 className="font-semibold text-rurikon-600 lowercase">Upload Images</h3>
                <p className="text-sm text-rurikon-600 lowercase">Upload photos via Telegram storage</p>
              </div>
            </a>

            <a
              href="/dashboard/category"
              className="flex items-center space-x-4 p-4 bg-rurikon-50 border-2 border-rurikon-200 rounded-lg hover:bg-rurikon-100 hover:border-rurikon-300 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-white border border-rurikon-200 flex items-center justify-center shrink-0">
                <Folder className="h-5 w-5 text-rurikon-600" />
              </div>
              <div>
                <h3 className="font-semibold text-rurikon-600 lowercase">Manage Categories</h3>
                <p className="text-sm text-rurikon-600 lowercase">Organize images into categories</p>
              </div>
            </a>

            <a
              href="/dashboard/homepage"
              className="flex items-center space-x-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-white border border-purple-200 flex items-center justify-center shrink-0">
                <Pin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-600 lowercase">Homepage Pins</h3>
                <p className="text-sm text-rurikon-600 lowercase">Select featured images for homepage</p>
              </div>
            </a>

            <button
              onClick={() => {
                if (idToken) {
                  mutate(['/api/telegram/images', idToken])
                  mutate(['/api/telegram/category', idToken])
                }
                mutate('/api/homepage')
              }}
              className="flex items-center space-x-4 p-4 bg-rurikon-50 border-2 border-rurikon-200 rounded-lg hover:bg-rurikon-100 hover:border-rurikon-300 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-white border border-rurikon-200 flex items-center justify-center shrink-0">
                <RefreshCw className="h-5 w-5 text-rurikon-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-rurikon-600 lowercase">Refresh Stats</h3>
                <p className="text-sm text-rurikon-600 lowercase">Update dashboard statistics</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
