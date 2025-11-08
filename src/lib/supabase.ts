import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          points: number
          level: 'bronze' | 'silver' | 'gold'
          status: 'active' | 'inactive'
          total_spent: number
          visit_count: number
          last_visit: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          points?: number
          level?: 'bronze' | 'silver' | 'gold'
          status?: 'active' | 'inactive'
          total_spent?: number
          visit_count?: number
          last_visit?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          points?: number
          level?: 'bronze' | 'silver' | 'gold'
          status?: 'active' | 'inactive'
          total_spent?: number
          visit_count?: number
          last_visit?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          cost: number
          category: string
          image_url: string | null
          is_active: boolean
          is_available: boolean
          preparation_time: number
          popularity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          cost: number
          category: string
          image_url?: string | null
          is_active?: boolean
          is_available?: boolean
          preparation_time?: number
          popularity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          cost?: number
          category?: string
          image_url?: string | null
          is_active?: boolean
          is_available?: boolean
          preparation_time?: number
          popularity?: number
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string | null
          type: 'balcao' | 'delivery' | 'mesa' | 'comanda'
          status: 'open' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total: number
          payment_method: string | null
          table_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          type: 'balcao' | 'delivery' | 'mesa' | 'comanda'
          status?: 'open' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total: number
          payment_method?: string | null
          table_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          type?: 'balcao' | 'delivery' | 'mesa' | 'comanda'
          status?: 'open' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total?: number
          payment_method?: string | null
          table_number?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          observations: string | null
          status: 'pending' | 'preparing' | 'ready' | 'delivered'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          observations?: string | null
          status?: 'pending' | 'preparing' | 'ready' | 'delivered'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          observations?: string | null
          status?: 'pending' | 'preparing' | 'ready' | 'delivered'
          updated_at?: string
        }
      }
    }
  }
}