"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { proposalsApi, ProposalTemplate } from "@/lib/api/proposals"
import { Checkbox } from "@/components/ui/checkbox"

export function TemplateManager() {
  const [templates, setTemplates] = useState<ProposalTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    category: "",
    isDefault: false,
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const data = await proposalsApi.getTemplates()
      setTemplates(data)
    } catch (error: any) {
      toast.error("Failed to load templates")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedTemplate(null)
    setFormData({ name: "", content: "", category: "", isDefault: false })
    setEditDialogOpen(true)
  }

  const handleEdit = (template: ProposalTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      content: template.content,
      category: template.category || "",
      isDefault: template.is_default,
    })
    setEditDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (selectedTemplate) {
        await proposalsApi.updateTemplate(selectedTemplate.id, formData)
        toast.success("Template updated successfully")
      } else {
        await proposalsApi.createTemplate(formData)
        toast.success("Template created successfully")
      }
      setEditDialogOpen(false)
      fetchTemplates()
    } catch (error: any) {
      toast.error(error.message || "Failed to save template")
    }
  }

  const handleDelete = async () => {
    if (!selectedTemplate) return
    try {
      await proposalsApi.deleteTemplate(selectedTemplate.id)
      toast.success("Template deleted successfully")
      setDeleteDialogOpen(false)
      setSelectedTemplate(null)
      fetchTemplates()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete template")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Proposal Templates</h3>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{template.name}</CardTitle>
                {template.is_default && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              {template.category && (
                <p className="text-sm text-muted-foreground">{template.category}</p>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {template.content.substring(0, 150)}...
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(template)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(template)
                    setDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No templates yet</p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate
                ? "Update the template details"
                : "Create a new proposal template"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Default Proposal Template"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Restaurant, Clinic"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Template Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Enter template content with placeholders..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isDefault: !!checked })
                }
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default template
              </Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTemplate?.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

