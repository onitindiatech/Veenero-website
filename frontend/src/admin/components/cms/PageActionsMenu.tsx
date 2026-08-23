import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { CmsPage } from '../../types/cms.types';

interface PageActionsMenuProps {
  page: CmsPage;
  onEdit: (page: CmsPage) => void;
  onDuplicate: (page: CmsPage) => void;
  onPreview: (page: CmsPage) => void;
  onToggleStatus: (page: CmsPage) => void;
  onDelete: (page: CmsPage) => void;
}

export const PageActionsMenu: React.FC<PageActionsMenuProps> = ({
  page,
  onEdit,
  onDuplicate,
  onPreview,
  onToggleStatus,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isPublished = page.status === 'published';

  const menuItems = [
    {
      label: 'Edit Page',
      icon: 'Pencil',
      onClick: () => { onEdit(page); setOpen(false); },
      className: 'text-foreground',
    },
    {
      label: 'Preview',
      icon: 'Eye',
      onClick: () => { onPreview(page); setOpen(false); },
      className: 'text-foreground',
    },
    {
      label: isPublished ? 'Unpublish' : 'Publish',
      icon: isPublished ? 'EyeOff' : 'Globe',
      onClick: () => { onToggleStatus(page); setOpen(false); },
      className: isPublished ? 'text-amber-600' : 'text-emerald-600',
    },
    {
      label: 'Duplicate',
      icon: 'Copy',
      onClick: () => { onDuplicate(page); setOpen(false); },
      className: 'text-foreground',
    },
    {
      label: 'Delete',
      icon: 'Trash2',
      onClick: () => { onDelete(page); setOpen(false); },
      className: 'text-rose-600',
      disabled: page.isCoreSystemPage,
      disabledReason: 'Core system pages cannot be deleted',
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        id={`page-actions-${page.id}`}
        onClick={(e) => { e.stopPropagation(); setOpen((prev) => !prev); }}
        className={cn(
          'p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150',
          open && 'bg-muted/60 text-foreground'
        )}
        aria-label={`Actions for ${page.name}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Icons.MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-48 bg-card border border-border/50 rounded-xl shadow-2xl z-50 py-1.5 animate-fade-in"
          role="menu"
        >
          {menuItems.map((item) => {
            const Icon = (Icons as any)[item.icon];
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                title={item.disabled ? item.disabledReason : undefined}
                onClick={item.onClick}
                className={cn(
                  'flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold font-sans transition-colors duration-150',
                  item.className,
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-muted/50'
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageActionsMenu;
