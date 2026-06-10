import { Car, User, ArrowLeftToLine } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header
      className="
        sticky top-0 z-50
        flex items-center justify-between
        bg-blue-600 px-6 py-4
        shadow-md
      "
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/15 p-2">
          <Car className="text-white" size={28} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            مركز العميد
          </h1>

          <p className="text-sm text-blue-100">
            نظام إدارة قطع غيار السيارات
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block text-left">
          <p className="text-sm text-blue-100">
            {new Date().toLocaleDateString('ar-EG')}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
          <User size={18} className="text-white" />
          <span className="text-sm text-white">
            المدير
          </span>
        </div>
        <Link href={'/'}>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <ArrowLeftToLine size={18} className="text-white" />

          </div>
        </Link>
      </div>
    </header>
  );
}