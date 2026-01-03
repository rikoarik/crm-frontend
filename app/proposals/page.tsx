"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProposalEditor } from "@/components/proposals/proposal-editor"
import { ProposalGenerator } from "@/components/proposals/proposal-generator"
import { TemplateManager } from "@/components/proposals/template-manager"
import { proposalsApi, Proposal } from "@/lib/api/proposals"
import { Plus, FileText } from "lucide-react"
import { toast } from "sonner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function ProposalsPage() {
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      setLoading(true)
      const data = await proposalsApi.getProposals()
      setProposals(data)
      if (data.length > 0 && !selectedProposalId) {
        setSelectedProposalId(data[0].id)
      }
    } catch (error: any) {
      toast.error("Failed to load proposals")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSuccess = (proposalId: string) => {
    setSelectedProposalId(proposalId)
    fetchProposals()
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex-1 space-y-8 p-8 pt-6">
          <p>Loading proposals...</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Proposals</h2>
            <p className="text-muted-foreground">
              Manage and generate proposals for your leads
            </p>
          </div>
          <ProposalGenerator onSuccess={handleGenerateSuccess} />
        </div>

        <Tabs defaultValue="proposals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="proposals">
              <FileText className="mr-2 h-4 w-4" />
              Proposals
            </TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          <TabsContent value="proposals" className="space-y-4">
            {proposals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No proposals yet</p>
                  <ProposalGenerator
                    onSuccess={handleGenerateSuccess}
                    trigger={
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Your First Proposal
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Proposals List</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {proposals.map((proposal) => (
                          <Button
                            key={proposal.id}
                            variant={selectedProposalId === proposal.id ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setSelectedProposalId(proposal.id)}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{proposal.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {proposal.leads?.name}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="pt-6">
                      {selectedProposalId ? (
                        <ProposalEditor
                          proposalId={selectedProposalId}
                          onSave={fetchProposals}
                        />
                      ) : (
                        <p className="text-muted-foreground">
                          Select a proposal to view and edit
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="templates">
            <TemplateManager />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

