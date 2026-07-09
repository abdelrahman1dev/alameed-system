'use client';

import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  Truck,
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
    title: 'الملف الشخصي',
    description: 'بيانات المستخدم والصلاحية',
    icon: Users,
    href: '/user',
  },
];

export default function Menu() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-[#1d293d]">
        العمليات السريعة
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
                hover:border-[#1447e6]
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
                  bg-[#dbeafe]
                  text-[#1447e6]
                  transition-colors
                  group-hover:bg-[#1447e6]
                  group-hover:text-white
                "
              >
                <Icon size={28} />
              </div>

              <h2 className="text-lg font-semibold text-[#1d293d]">
                {item.title}
              </h2>

              <p className="mt-1 text-sm text-[#45556c]">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
