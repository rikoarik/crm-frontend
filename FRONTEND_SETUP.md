# Frontend Setup Instructions

Frontend baru sudah dibuat di folder `frontend/`. 

## Yang Sudah Dibuat:
- ✅ Package.json dengan dependencies
- ✅ TypeScript config
- ✅ Next.js config
- ✅ API client layer (lib/api/)
- ✅ Types (lib/types.ts)
- ✅ Utils (lib/utils.ts)
- ✅ Globals CSS

## Yang Perlu Dilakukan:

### 1. Copy UI Components dari crm-next
Copy semua file dari `crm-next/components/ui/` ke `frontend/components/ui/`:
- button.tsx
- card.tsx
- dialog.tsx
- dropdown-menu.tsx
- input.tsx
- select.tsx
- table.tsx
- badge.tsx
- sheet.tsx
- sonner.tsx
- checkbox.tsx

### 2. Copy Theme Provider
Copy `crm-next/components/theme-provider.tsx` ke `frontend/components/theme-provider.tsx`

### 3. Buat Layout Components
Buat `frontend/components/layout/app-sidebar.tsx` (sudah ada template di crm-next)

### 4. Buat Pages
Buat pages di `frontend/app/`:
- `layout.tsx` - Root layout
- `page.tsx` - Dashboard
- `leads/page.tsx` - Leads management
- `analytics/page.tsx` - Analytics

### 5. Buat Lead Components
Buat components di `frontend/components/leads/`:
- `data-table.tsx`
- `data-table-toolbar.tsx`
- `columns.tsx`
- `lead-form.tsx`
- `add-lead-button.tsx`
- `kanban-board.tsx`
- `view-toggle.tsx`

## Quick Copy Command (PowerShell):

```powershell
# Copy UI components
Copy-Item -Path "crm-next\components\ui\*" -Destination "frontend\components\ui\" -Recurse -Force

# Copy theme provider
Copy-Item -Path "crm-next\components\theme-provider.tsx" -Destination "frontend\components\theme-provider.tsx" -Force

# Copy layout
Copy-Item -Path "crm-next\components\layout\*" -Destination "frontend\components\layout\" -Recurse -Force
```

Setelah itu, update semua import dan pastikan menggunakan API client dari `lib/api/` bukan dari server actions.

