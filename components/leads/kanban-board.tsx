"use client"

import { Lead, LeadStatus } from "@/lib/types"
import { useState } from "react"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from "@dnd-kit/core"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { leadsApi } from "@/lib/api/leads"
import { toast } from "sonner"

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Interested', 'Deal', 'Junk']

export function KanbanBoard({ leads, onUpdate }: { leads: Lead[], onUpdate?: () => void }) {
    const [items, setItems] = useState(leads)
    const [activeId, setActiveId] = useState<string | null>(null)

    const columns = STATUSES.map(status => ({
        id: status,
        title: status,
        leads: items.filter(l => l.status === status)
    }))

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const newStatus = overId as LeadStatus

        if (!STATUSES.includes(newStatus)) {
            return
        }

        const lead = items.find(l => l.id === activeId)
        if (!lead || lead.status === newStatus) return

        const updatedItems = items.map(l =>
            l.id === activeId ? { ...l, status: newStatus } : l
        )
        setItems(updatedItems)

        try {
            await leadsApi.updateLeadStatus(activeId, newStatus)
            toast.success(`Moved to ${newStatus}`)
            onUpdate?.()
        } catch (err: any) {
            toast.error(err.message || "Failed to update status")
            setItems(leads)
        }
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)]">
                {columns.map(col => (
                    <Column key={col.id} id={col.id} title={col.title} leads={col.leads} />
                ))}
            </div>
            <DragOverlay>
                {activeId ? (
                    <div className="opacity-80 rotate-3">
                        <LeadCard lead={items.find(l => l.id === activeId)!} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

function Column({ id, title, leads }: { id: string, title: string, leads: Lead[] }) {
    const { setNodeRef } = useDroppable({
        id: id,
    })

    return (
        <div ref={setNodeRef} className="flex-shrink-0 w-72 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 flex flex-col h-full border">
            <div className="font-semibold mb-3 flex items-center justify-between">
                {title}
                <Badge variant="secondary">{leads.length}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 min-h-[100px]">
                {leads.map(lead => (
                    <DraggableLeadCard key={lead.id} lead={lead} />
                ))}
            </div>
        </div>
    )
}

function DraggableLeadCard({ lead }: { lead: Lead }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: lead.id!,
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined

    if (isDragging) {
        return <div ref={setNodeRef} style={style} className="opacity-30"><LeadCard lead={lead} /></div>
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <LeadCard lead={lead} />
        </div>
    )
}

function LeadCard({ lead }: { lead: Lead }) {
    return (
        <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
            <CardContent className="p-3">
                <div className="font-medium text-sm">{lead.name}</div>
                <div className="text-xs text-muted-foreground truncate">{lead.city}</div>
                {lead.phone && <div className="text-xs text-muted-foreground mt-1">{lead.phone}</div>}
            </CardContent>
        </Card>
    )
}

