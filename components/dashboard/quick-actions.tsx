"use client"

import { Button } from "@/components/ui/button"
import { Plus, FileText, Download, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LeadForm } from "@/components/leads/lead-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface QuickActionsProps {
  onExport?: () => void
  onGenerateProposal?: () => void
}

export function QuickActions({ onExport, onGenerateProposal }: QuickActionsProps) {
  const router = useRouter()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Lead
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
            <DialogDescription>
              Add a new lead to your pipeline
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            onSuccess={() => {
              setCreateDialogOpen(false)
              router.refresh()
            }}
          />
        </DialogContent>
      </Dialog>

      {onGenerateProposal && (
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={onGenerateProposal}
        >
          <FileText className="h-4 w-4" />
          Generate Proposal
        </Button>
      )}

      {onExport && (
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      )}

      <Button
        size="sm"
        variant="outline"
        className="gap-2"
        onClick={() => router.push('/analytics')}
      >
        <BarChart3 className="h-4 w-4" />
        View Analytics
      </Button>
    </div>
  )
}

