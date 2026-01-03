"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { proposalsApi, ProposalTemplate } from "@/lib/api/proposals"
import { leadsApi } from "@/lib/api/leads"
import { Lead } from "@/lib/types"

interface ProposalGeneratorProps {
  leadId?: string
  onSuccess?: (proposalId: string) => void
  trigger?: React.ReactNode
}

export function ProposalGenerator({ leadId, onSuccess, trigger }: ProposalGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [templates, setTemplates] = useState<ProposalTemplate[]>([])
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leadId || "")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")

  useEffect(() => {
    if (open) {
      fetchLeads()
      fetchTemplates()
      if (leadId) {
        setSelectedLeadId(leadId)
      }
    }
  }, [open, leadId])

  const fetchLeads = async () => {
    try {
      const response = await leadsApi.getLeads({ limit: 100 })
      setLeads(response.data)
    } catch (error: any) {
      toast.error("Failed to load leads")
    }
  }

  const fetchTemplates = async () => {
    try {
      const templates = await proposalsApi.getTemplates()
      setTemplates(templates)
    } catch (error: any) {
      toast.error("Failed to load templates")
    }
  }

  const handleGenerate = async () => {
    if (!selectedLeadId) {
      toast.error("Please select a lead")
      return
    }

    try {
      setLoading(true)
      const proposal = await proposalsApi.generateProposal({
        leadId: selectedLeadId,
        templateId: selectedTemplateId || undefined,
      })
      toast.success("Proposal generated successfully")
      setOpen(false)
      onSuccess?.(proposal.id)
    } catch (error: any) {
      toast.error(error.message || "Failed to generate proposal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Generate Proposal</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Proposal</DialogTitle>
          <DialogDescription>
            Generate a proposal for a lead using AI
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Lead</label>
            <Select
              value={selectedLeadId}
              onValueChange={setSelectedLeadId}
              disabled={!!leadId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id || ""}>
                    {lead.name} - {lead.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Template (Optional)</label>
            <Select
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Use default template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default Template</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                    {template.is_default && " (Default)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !selectedLeadId}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Proposal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

