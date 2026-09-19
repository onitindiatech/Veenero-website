import mongoose, { Schema, Document } from 'mongoose';

export interface INavItemChild {
  id: string;
  label: string;
  path: string;
  isExternal: boolean;
  openInNewTab: boolean;
  isActive: boolean;
  order: number;
}

export interface INavigationItem {
  id: string;
  label: string;
  path: string;
  isExternal: boolean;
  openInNewTab: boolean;
  isActive: boolean;
  order: number;
  icon?: string;
  children?: INavItemChild[];
}

export interface INavigationCTA {
  label: string;
  path: string;
  isActive: boolean;
  openInNewTab: boolean;
}

export interface INavigation extends Document {
  items: INavigationItem[];
  cta: INavigationCTA;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NavItemChildSchema = new Schema<INavItemChild>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    isExternal: { type: Boolean, default: false },
    openInNewTab: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const NavigationItemSchema = new Schema<INavigationItem>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    isExternal: { type: Boolean, default: false },
    openInNewTab: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    icon: { type: String },
    children: [NavItemChildSchema],
  },
  { _id: false }
);

const NavigationSchema = new Schema<INavigation>(
  {
    items: [NavigationItemSchema],
    cta: {
      label: { type: String, default: 'Get in Touch' },
      path: { type: String, default: '/contact' },
      isActive: { type: Boolean, default: true },
      openInNewTab: { type: Boolean, default: false },
    },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

export const DEFAULT_NAVIGATION_ITEMS: INavigationItem[] = [
  { id: 'nav-about', label: 'About Us', path: '/about', isExternal: false, openInNewTab: false, isActive: true, order: 0 },
  { id: 'nav-solutions', label: 'Solutions', path: '/solutions', isExternal: false, openInNewTab: false, isActive: true, order: 1 },
  { id: 'nav-approach', label: 'Our Approach', path: '/approach', isExternal: false, openInNewTab: false, isActive: true, order: 2 },
  { id: 'nav-impact', label: 'Impact', path: '/impact', isExternal: false, openInNewTab: false, isActive: true, order: 3 },
  { id: 'nav-careers', label: 'Careers', path: '/careers', isExternal: false, openInNewTab: false, isActive: true, order: 4 },
  { id: 'nav-blog', label: 'Blog / Insights', path: '/blog', isExternal: false, openInNewTab: false, isActive: true, order: 5 },
];

export const NavigationModel = mongoose.model<INavigation>('Navigation', NavigationSchema);
