export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Deal' | 'Junk';

export interface Lead {
    id?: string;
    name: string;
    city: string;
    category: string;
    address: string;
    phone: string;
    rating: string | number;
    website: string | null;
    status: LeadStatus;
    provinceId?: string;
    created_at?: string;
}

export interface Province {
    id: string;
    code: string;
    name: string;
    created_at?: string;
}

export interface User {
    id: string;
    username: string;
    email?: string;
    role: 'superadmin' | 'admin';
    provinceId?: string;
    isActive: boolean;
    createdAt?: string; // Kept as is per existing file
    updatedAt?: string;
    provinces?: Province;
}

export interface CreateUserDto {
    username: string;
    email?: string;
    password: string;
    role: 'superadmin' | 'admin';
    provinceId?: string;
}

export interface UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    role?: 'superadmin' | 'admin';
    provinceId?: string;
}

export interface AuthUser {
    id: string;
    username: string;
    email?: string;
    role: 'superadmin' | 'admin';
    provinceId?: string;
    province?: Province;
}
