import {
  Home,
  Package,
  ShoppingCart,
  Receipt,
  FileText,
  BarChart3,
  Users,
  Settings,
  Plus,
  Printer,
  RotateCw,
  Download,
  Database,
  Search,
  ArchiveRestore,
} from "lucide-react";

type Action =
  | "home"
  | "products"
  | "purchases"
  | "sales"
  | "invoices"
  | "reports"
  | "customers"
  | "settings"
  | "new-product"
  | "new-sale"
  | "new-purchase"
  | "print"
  | "refresh"
  | "export-excel"
  | "backup"
  | "restore";
type Props = {
  onAction: (action: Action) => void;
};


export default function Toolbar({ onAction }: Props) {
  return (
    <header className="border-b bg-zinc-900 text-white select-none">
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 h-12">

        <div className="flex items-center gap-2">

          <ToolbarButton icon={<Home size={18} />} text="الرئيسية" action="home" onClick={onAction}/>
          <ToolbarButton icon={<Package size={18} />} text="المنتجات" action="products" onClick={onAction} />
          <ToolbarButton icon={<ShoppingCart size={18} />} text="المشتريات" action="purchases" onClick={onAction} />
          <ToolbarButton icon={<Receipt size={18} />} text="المبيعات"  action="sales" onClick={onAction}/>
          <ToolbarButton icon={<FileText size={18} />} text="الفواتير"  action="invoices" onClick={onAction}/>
          <ToolbarButton icon={<BarChart3 size={18} />} text="التقارير"  action="reports" onClick={onAction}/>
          <ToolbarButton icon={<Users size={18} />} text="العملاء" action="customers" onClick={onAction} />
          <ToolbarButton icon={<Settings size={18} />} text="الإعدادات" action="settings" onClick={onAction} />

        </div>

        <div className="relative">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
          />

          <input
            placeholder="بحث..."
            className="w-64 rounded bg-zinc-800 px-9 py-2 outline-none"
          />

        </div>

      </div>

      {/* Quick Actions */}

      <div className="flex items-center gap-2 px-4 h-11 border-t border-zinc-800">

        <QuickAction icon={<Plus size={16} />} text="منتج جديد" action="new-product" onClick={onAction} />
        <QuickAction icon={<Receipt size={16} />} text="فاتورة بيع"  action="new-sale" onClick={onAction}/>
        <QuickAction icon={<ShoppingCart size={16} />} text="فاتورة شراء" action="new-purchase" onClick={onAction} />
        <QuickAction icon={<Printer size={16} />} text="طباعة" action="print" onClick={onAction} />
        <QuickAction icon={<RotateCw size={16} />} text="تحديث" action="refresh" onClick={onAction} />
        <QuickAction icon={<Download size={16} />} text="تصدير Excel" action="export-excel" onClick={onAction} />
        <QuickAction icon={<Database size={16} />} text="نسخة احتياطية" action="backup" onClick={onAction} />
        <QuickAction icon={<ArchiveRestore size={16} />} text=" استعادة" action="restore" onClick={onAction} />

      </div>
    </header>
  );
}

function ToolbarButton({
  icon,
  text,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  action: Action;
  onClick: (action: Action) => void;
}) {
  return (
    <button
      onClick={() => onClick(action)}
      className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-800 transition"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}

function QuickAction({
  icon,
  text,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  action: Action;
  onClick: (action: Action) => void;
}) {
  return (
    <button
      onClick={() => onClick(action)}
      className="flex items-center gap-2 rounded bg-zinc-800 px-3 py-2 hover:bg-zinc-700 transition"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}