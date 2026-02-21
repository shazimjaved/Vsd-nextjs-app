import type { LucideIcon } from "lucide-react"

export type NavItem = {
    href: string
    title: string
    icon?: LucideIcon
    description?: string;
    subItems?: NavItem[];
}
   
