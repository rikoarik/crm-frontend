"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <>
      <AppSidebar />
      <main className="flex-1 min-h-screen md:ml-[240px] pt-14 md:pt-0">
        {children}
      </main>
    </>
  )
}

