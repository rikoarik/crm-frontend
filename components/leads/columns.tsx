"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Lead, LeadStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { leadsApi } from "@/lib/api/leads"
import { useTransition, useState, useEffect } from "react"
import { MoreHorizontal, Phone, Pencil, Trash, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LeadForm } from "./lead-form"
import { ProposalGenerator } from "@/components/proposals/proposal-generator"
import { proposalsApi } from "@/lib/api/proposals"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const StatusCell = ({ lead }: { lead: Lead }) => {
    const [isPending, startTransition] = useTransition()

    const handleStatusChange = (status: LeadStatus) => {
        startTransition(async () => {
            try {
                await leadsApi.updateLeadStatus(lead.id!, status)
                toast.success(`Status updated to ${status}`)
                window.dispatchEvent(new CustomEvent('leadUpdated'))
            } catch (err: any) {
                toast.error(err.message || "Failed to update status")
            }
        })
    }

    const getVariant = (status: string) => {
        switch (status) {
            case 'New': return 'secondary'
            case 'Contacted': return 'default'
            case 'Interested': return 'outline'
            case 'Deal': return 'destructive'
            default: return 'outline'
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-[100px] p-0 hover:bg-transparent">
                    <Badge variant={getVariant(lead.status)} className={`
                         ${lead.status === 'Deal' ? 'bg-green-500 hover:bg-green-600 border-transparent text-white' : ''}
                         ${lead.status === 'Contacted' ? 'bg-blue-500 hover:bg-blue-600 border-transparent text-white' : ''}
                    `}>
                        {lead.status}
                    </Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['New', 'Contacted', 'Interested', 'Deal', 'Junk'].map((s) => (
                    <DropdownMenuItem
                        key={s}
                        onClick={() => handleStatusChange(s as LeadStatus)}
                        disabled={isPending}
                    >
                        {s}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const ActionsCell = ({ lead }: { lead: Lead }) => {
    const cleanPhone = lead.phone ? lead.phone.replace(/\D/g, '') : ''
    const waLink = cleanPhone ? `https://wa.me/62${cleanPhone.replace(/^0/, '')}` : '#'
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeletePending, startDeleteTransition] = useTransition()
    const [proposalCount, setProposalCount] = useState(0)
    const router = useRouter()

    useEffect(() => {
        if (lead.id) {
            proposalsApi.getProposals(lead.id).then(proposals => {
                setProposalCount(proposals.length)
            }).catch(() => {})
        }
    }, [lead.id])

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this lead?")) {
            startDeleteTransition(async () => {
                try {
                    await leadsApi.deleteLead(lead.id!)
                    toast.success("Lead deleted successfully")
                    window.dispatchEvent(new CustomEvent('leadUpdated'))
                } catch (err: any) {
                    toast.error(err.message || "Failed to delete lead")
                }
            })
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(lead.phone)}
                    >
                        Copy Phone
                    </DropdownMenuItem>
                    {cleanPhone && (
                        <DropdownMenuItem asChild>
                            <a href={waLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer items-center flex">
                                <Phone className="mr-2 h-4 w-4" /> WhatsApp
                            </a>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <div>
                            <ProposalGenerator
                                leadId={lead.id}
                                onSuccess={(proposalId) => {
                                    router.push(`/proposals`)
                                }}
                                trigger={
                                    <div className="flex items-center cursor-pointer w-full">
                                        <FileText className="mr-2 h-4 w-4" /> Generate Proposal
                                        {proposalCount > 0 && (
                                            <span className="ml-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                                                {proposalCount}
                                            </span>
                                        )}
                                    </div>
                                }
                            />
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} disabled={isDeletePending} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Lead</DialogTitle>
                    </DialogHeader>
                    <LeadForm 
                        initialData={lead} 
                        onSuccess={() => {
                            setIsEditOpen(false);
                            window.dispatchEvent(new CustomEvent('leadUpdated'));
                        }} 
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export const columns: ColumnDef<Lead>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Business Name
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-semibold text-base">{row.getValue("name")}</div>
    },
    {
        accessorKey: "city",
        header: "City",
        cell: ({ row }) => <Badge variant="outline" className="font-normal">{row.getValue("city")}</Badge>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("category")}</div>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusCell lead={row.original} />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell lead={row.original} />
    },
]

