export type SubMenuItem = {
  label: string;
  href: string;
};

export type MenuItem = {
  label: string;
  href: string;
  icon: string;
  hasArrow?: boolean;
  subItems?: SubMenuItem[];
};

export type MenuGroup = {
  title?: string;
  items: MenuItem[];
};