'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface SidebarUser {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

interface SidebarProps {
  user?: SidebarUser | null;
  basePath: string; // e.g., `/profile/123`
}

const menu = [
  { key: 'orders', label: 'Orders', href: 'orders' },
  { key: 'products', label: 'Product Listing', href: 'products' },
  { key: 'address-book', label: 'Address Book', href: 'address-book' },
  { key: 'details', label: 'User Details', href: 'details' },
];

export function Sidebar({ user, basePath }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0 border-r bg-white">
      <div className="p-4 flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || 'User'} />
          <AvatarFallback>{user?.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium leading-tight">{user?.name || 'User'}</div>
          {user?.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
        </div>
      </div>
      <Separator />
      <nav className="p-2 space-y-1">
        {menu.map((item) => {
          const href = `${basePath}/${item.href}`;
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm transition-colors',
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;


