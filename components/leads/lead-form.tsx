"use client"

import { Lead, LeadStatus } from "@/lib/types"
import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { leadsApi } from "@/lib/api/leads"
import { provincesApi } from "@/lib/api/provinces"
import { useAuth } from "@/lib/auth/auth-context"
import { Province } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface LeadFormProps {
    initialData?: Lead
    onSuccess?: () => void
}

export function LeadForm({ initialData, onSuccess }: LeadFormProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [provinces, setProvinces] = useState<Province[]>([])
    const { user } = useAuth()

    useEffect(() => {
        // Only load provinces if superadmin
        if (user?.role === 'superadmin') {
            provincesApi.getAllProvinces().then(setProvinces).catch(() => {});
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)

        const data: any = {
            name: formData.get('name') as string,
            city: formData.get('city') as string,
            category: formData.get('category') as string,
            address: formData.get('address') as string,
            phone: formData.get('phone') as string,
            rating: formData.get('rating') as string,
            website: formData.get('website') as string,
            status: formData.get('status') as LeadStatus,
        }

        // Add provinceId if superadmin selected one, or auto-assign for admin
        const provinceId = formData.get('provinceId') as string;
        if (user?.role === 'superadmin' && provinceId) {
            data.provinceId = provinceId;
        }
        // For admin, provinceId will be auto-assigned by backend

        startTransition(async () => {
            // Basic Check
            if (!data.name) {
                const msg = "Business Name is required"
                setError(msg)
                toast.error(msg)
                return
            }

            try {
                if (initialData?.id) {
                    await leadsApi.updateLead(initialData.id, data)
                    toast.success("Lead updated successfully")
                    onSuccess?.()
                } else {
                    await leadsApi.createLead(data)
                    toast.success("Lead created successfully")
                    onSuccess?.()
                }
            } catch (err: any) {
                const msg = err.message || "Failed to save lead"
                setError(msg)
                toast.error(msg)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Business Name</label>
                    <Input id="name" name="name" defaultValue={initialData?.name} required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <Select name="status" defaultValue={initialData?.status || 'New'}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {['New', 'Contacted', 'Interested', 'Deal', 'Junk'].map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {user?.role === 'superadmin' && provinces.length > 0 && (
                <div className="space-y-2">
                    <label htmlFor="provinceId" className="text-sm font-medium">Province</label>
                    <Select name="provinceId" defaultValue={initialData?.provinceId || ''}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select province (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">No Province</SelectItem>
                            {provinces.map(province => (
                                <SelectItem key={province.id} value={province.id}>
                                    {province.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <Input id="phone" name="phone" defaultValue={initialData?.phone} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium">Website</label>
                    <Input id="website" name="website" defaultValue={initialData?.website || ''} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium">City</label>
                    <Input id="city" name="city" defaultValue={initialData?.city} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Input id="category" name="category" defaultValue={initialData?.category} />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Address</label>
                <Input id="address" name="address" defaultValue={initialData?.address} />
            </div>
            <div className="space-y-2">
                <label htmlFor="rating" className="text-sm font-medium">Rating/Notes</label>
                <Input id="rating" name="rating" defaultValue={initialData?.rating || ''} placeholder="Optional rating or notes" />
            </div>

            {error && (
                <div className="rounded-md bg-destructive/15 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onSuccess?.()} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Update Lead' : 'Create Lead'}
                </Button>
            </div>
        </form>
    )
}

