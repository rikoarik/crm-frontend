"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Save, Download, FileText } from "lucide-react"
import { toast } from "sonner"
import { proposalsApi, Proposal } from "@/lib/api/proposals"

interface ProposalEditorProps {
  proposalId: string
  onSave?: () => void
}

export function ProposalEditor({ proposalId, onSave }: ProposalEditorProps) {
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<Proposal["status"]>("draft")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProposal()
  }, [proposalId])

  const fetchProposal = async () => {
    try {
      setLoading(true)
      const data = await proposalsApi.getProposal(proposalId)
      setProposal(data)
      setContent(data.content)
      setStatus(data.status)
    } catch (error: any) {
      toast.error("Failed to load proposal")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await proposalsApi.updateProposal(proposalId, {
        content,
        status,
      })
      toast.success("Proposal saved successfully")
      onSave?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to save proposal")
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = () => {
    // Simple PDF export using browser print
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${proposal?.title || "Proposal"}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${proposal?.title || "Proposal"}</h1>
            <pre>${content}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleExportMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${proposal?.title || 'proposal'}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!proposal) {
    return <div>Proposal not found</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{proposal.title}</h2>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(value: Proposal["status"]) => setStatus(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Content</label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Export MD
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] font-mono text-sm"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

