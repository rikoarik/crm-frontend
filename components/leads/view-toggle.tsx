"use client"

import { LayoutGrid, List } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

function ViewToggleContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const view = searchParams.get('view') || 'list'

    const setView = (v: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('view', v)
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex items-center border rounded-lg p-1 bg-background">
            <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="h-8 px-2"
            >
                <List className="h-4 w-4 mr-2" /> List
            </Button>
            <Button
                variant={view === 'board' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('board')}
                className="h-8 px-2"
            >
                <LayoutGrid className="h-4 w-4 mr-2" /> Board
            </Button>
        </div>
    )
}

export function ViewToggle() {
    return (
        <Suspense fallback={<div className="h-10 w-32 animate-pulse bg-muted rounded" />}>
            <ViewToggleContent />
        </Suspense>
    )
}

