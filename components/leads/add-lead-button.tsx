"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LeadForm } from "./lead-form"

export function AddLeadButton({ onSuccess }: { onSuccess?: () => void }) {
    const [open, setOpen] = useState(false)

    const handleSuccess = () => {
        setOpen(false)
        onSuccess?.()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                </DialogHeader>
                <LeadForm onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    )
}

