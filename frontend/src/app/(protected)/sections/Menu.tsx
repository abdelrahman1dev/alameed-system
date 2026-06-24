'use client';

import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  Receipt,
  Wallet,
  BarChart3,
  Truck,
  Settings,
} from 'lucide-react';

const menuItems = [
  {
    title: 'شراء بضائع',
    description: 'شراء بضائع جديدة',
    icon: Truck,
    href: '/purchases',
  },
  {
    title: 'بيع',
    description: 'إنشاء عملية بيع جديدة',
    icon: ShoppingCart,
    href: '/sales',
  },
  {
    title: 'المنتجات',
    description: 'إدارة المنتجات',
    icon: Package,
    href: '/products',
  },
  {
    title: 'العملاء',
    description: 'إدارة العملاء',
    icon: Users,
    href: '/customers',
  },
  {
    title: 'الفواتير',
    description: 'عرض وإدارة الفواتير',
    icon: Receipt,
    href: '/invoices',
  },
  {
    title: 'المصروفات',
    description: 'إدارة المصروفات',
    icon: Wallet,
    href: '/expenses',
  },
  {
    title: 'التقارير',
    description: 'تقارير المبيعات والمخزون',
    icon: BarChart3,
    href: '/reports',
  },
  {
    title: 'الإعدادات',
    description: 'إعدادات النظام',
    icon: Settings,
    href: '/settings',
  },
];

export default function Menu() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        لوحة التحكم
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="
                group
                rounded-2xl
                border
                bg-white
                p-6
                shadow-sm
                transition-all
                hover:-translate-y-1
                hover:border-blue-500
                hover:shadow-lg
                block
                cursor-pointer
              "
            >
              <div
                className="
                  mb-4
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                  transition-colors
                  group-hover:bg-blue-600
                  group-hover:text-white
                "
              >
                <Icon size={28} />
              </div>

              <h2 className="text-lg font-semibold text-slate-800">
                {item.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}