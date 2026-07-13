"use client";
import React, { useEffect, useState } from 'react';
import type { ReportsDashboard } from '../../../types/api';
import {
  Wallet, ShoppingCart, TrendingUp, Warehouse, Target, Boxes,
  Filter, Calendar, User, Package, Tag, RotateCcw, FileDown,
  FileSpreadsheet, AlertTriangle, ArrowUpRight, ArrowDownRight,
  PackagePlus, PackageMinus, PackageSearch, ChevronDown, Clock,
} from 'lucide-react';
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

/* ------------------------------------------------------------------ */
/* Design tokens — hex only, industrial instrument-cluster palette     */
/* ------------------------------------------------------------------ */
const C = {
  bg: '#EFF3F8',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F9FC',
  border: '#E2E8F1',
  ink: '#132238',
  inkSoft: '#3C4A5E',
  muted: '#7C8AA0',
  primary: '#1D4E7A',
  primaryDark: '#0F3352',
  primarySoft: '#E6EFF7',
  gold: '#D98E2B',
  goldSoft: '#FBEEDA',
  green: '#1C7A46',
  greenSoft: '#E3F5EA',
  red: '#C2272E',
  redSoft: '#FBE7E8',
  orange: '#D97706',
  orangeSoft: '#FDF0DE',
  track: '#E7EBF2',
  needle: '#D98E2B',
  chartSales: '#1D4E7A',
  chartPurchases: '#9FB6CB',
  chartProfitLine: '#1C7A46',
};

const FONT_DISPLAY = "'Almarai', 'Segoe UI', sans-serif";
const FONT_BODY = "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif";

const arNum = (n: number) => new Intl.NumberFormat('ar-EG').format(Math.round(n));
const arCurrency = (n: number) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n);

/* ------------------------------------------------------------------ */
/* Small building blocks                                              */
/* ------------------------------------------------------------------ */
function Badge({ children, fg, bg }: { children?: React.ReactNode; fg: string; bg: string }) {
  return (
    <span
      style={{
        color: fg, backgroundColor: bg,
        fontFamily: FONT_BODY, fontWeight: 600, fontSize: '12px',
        padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function statusStyle(status: 'منخفض' | 'متوسط' | 'جيد' | string): { fg: string; bg: string } {
  if (status === 'منخفض') return { fg: C.red, bg: C.redSoft };
  if (status === 'متوسط') return { fg: C.orange, bg: C.orangeSoft };
  return { fg: C.green, bg: C.greenSoft };
}

function marginStyle(margin: number): { fg: string; bg: string } {
  if (margin >= 30) return { fg: C.green, bg: C.greenSoft };
  if (margin >= 15) return { fg: C.orange, bg: C.orangeSoft };
  return { fg: C.red, bg: C.redSoft };
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ width: '100%', height: '6px', borderRadius: '999px', backgroundColor: C.track, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '999px' }} />
    </div>
  );
}

function SectionCard({ title, icon, children, style }: { title: string; icon?: React.ReactNode; children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px',
        boxShadow: '0 1px 2px rgba(19,34,56,0.04), 0 8px 20px -12px rgba(19,34,56,0.10)',
        padding: '22px', ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        {icon && (
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px', backgroundColor: C.primarySoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary,
          }}>
            {icon}
          </div>
        )}
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '16px', color: C.ink, margin: 0 }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function StatCard({ icon, title, value, sub, accent }: { icon?: React.ReactNode; title: string; value?: React.ReactNode; sub?: string; accent: { fg: string; soft: string } }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px',
        padding: '20px', boxShadow: hover
          ? '0 1px 2px rgba(19,34,56,0.05), 0 14px 26px -14px rgba(19,34,56,0.22)'
          : '0 1px 2px rgba(19,34,56,0.04), 0 8px 20px -14px rgba(19,34,56,0.10)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 180ms ease', display: 'flex', flexDirection: 'column', gap: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px', backgroundColor: accent.soft,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent.fg,
        }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '24px', color: C.ink, lineHeight: 1.2 }}>
          {value}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: '13px', color: C.inkSoft, marginTop: '4px' }}>
          {title}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: '12px', color: C.muted, marginTop: '2px' }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

/* --- Instrument-cluster gauge, the page's signature element --- */
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const start = polar(cx, cy, r, a0);
  const end = polar(cx, cy, r, a1);
  const largeArc = a1 - a0 <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function GaugeMeter({ pct, label, sub, color }: { pct: number; label: string; sub?: string; color: string }) {
  const cx = 90, cy = 92, r = 68;
  const a0 = 240, sweep = 240;
  const valueAngle = a0 + sweep * Math.max(0, Math.min(1, pct));
  const ticks = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = a0 + i * (sweep / 5);
    const p1 = polar(cx, cy, r + 3, a);
    const p2 = polar(cx, cy, r - 9, a);
    return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={C.track} strokeWidth="3" strokeLinecap="round" />;
  });
  const needleEnd = polar(cx, cy, r * 0.62, valueAngle);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}>
      <div style={{ position: 'relative', width: '180px', height: '136px' }}>
        <svg viewBox="0 0 180 136" width="180" height="136" style={{ position: 'absolute', inset: 0 }}>
          <path d={arcPath(cx, cy, r, a0, a0 + sweep)} fill="none" stroke={C.track} strokeWidth="11" strokeLinecap="round" />
          <path d={arcPath(cx, cy, r, a0, valueAngle)} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" />
          {ticks}
          <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke={C.needle} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="7" fill={C.needle} />
          <circle cx={cx} cy={cy} r="3" fill={C.surface} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', paddingTop: '38px',
        }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '22px', color: C.ink }}>
            {arNum(Math.round(pct * 100))}٪
          </div>
        </div>
      </div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: '13px', color: C.ink, marginTop: '2px' }}>{label}</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: '11px', color: C.muted }}>{sub}</div>
    </div>
  );
}

/* --- Table primitives --- */
function Th({ children }: { children?: React.ReactNode; align?: 'left' | 'center' | 'right' | string }) {
  return (
    <th style={{
      fontFamily: FONT_BODY, fontWeight: 700, fontSize: '12.5px', color: C.muted,
      textAlign: 'right', padding: '10px 14px', borderBottom: `1px solid ${C.border}`,
      whiteSpace: 'nowrap', position: 'sticky', top: 0, backgroundColor: C.surface,
    }}>
      {children}
    </th>
  );
}
function Td({ children, style }: { children?: React.ReactNode; align?: 'left' | 'center' | 'right' | string; style?: React.CSSProperties }) {
  return (
    <td style={{
      fontFamily: FONT_BODY, fontSize: '13.5px', color: C.inkSoft,
      textAlign: 'right', padding: '12px 14px', ...style,
    }}>
      {children}
    </td>
  );
}
function Row({ children, highlight }: { children?: React.ReactNode; highlight?: boolean }) {
  const [Hover, setHover] = useState<boolean>(false);
  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: highlight ? C.redSoft : Hover ? C.surfaceAlt : 'transparent',
        borderBottom: `1px solid ${C.border}`, transition: 'background-color 120ms ease',
      }}
    >
      {children}
    </tr>
  );
}
function TableWrap({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${C.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>{children}</table>
    </div>
  );
}

/* --- Filter controls --- */
function FieldShell({ icon, children }: { icon?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: C.surfaceAlt,
      border: `1px solid ${C.border}`, borderRadius: '10px', padding: '8px 12px', minWidth: '150px',
    }}>
      <span style={{ color: C.muted, display: 'flex' }}>{icon}</span>
      {children}
    </div>
  );
}
function Select({ icon, options, value, onChange }: { icon?: React.ReactNode; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <FieldShell icon={icon}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontFamily: FONT_BODY, fontSize: '13px', color: C.ink, backgroundColor: 'transparent',
          border: 'none', outline: 'none', flex: 1, appearance: 'none', cursor: 'pointer',
        }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color={C.muted} />
    </FieldShell>
  );
}
function DateField({ icon, value, onChange }: { icon?: React.ReactNode; value: string; onChange: (v: string) => void }) {
  return (
    <FieldShell icon={icon}>
      <input
        type="date" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ fontFamily: FONT_BODY, fontSize: '13px', color: C.ink, backgroundColor: 'transparent', border: 'none', outline: 'none', flex: 1 }}
      />
    </FieldShell>
  );
}

/* --- Chart tooltip --- */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey?: string; color?: string; name?: string; value?: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px',
      padding: '10px 14px', boxShadow: '0 10px 24px -12px rgba(19,34,56,0.25)', fontFamily: FONT_BODY,
    }}>
      <div style={{ fontSize: '12px', color: C.muted, marginBottom: '6px', fontWeight: 700 }}>{label}</div>
      {payload.map((p) => (
        <div key={String(p.dataKey ?? p.name)} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: C.ink }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '999px', backgroundColor: p.color }} />
          <span style={{ color: C.muted }}>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{arCurrency(p.value ?? 0)}</span>
        </div>
      ))}
    </div>
  );
}

const movementIcon = (op: string): React.ReactNode => {
  if (op === 'شراء') return <PackagePlus size={16} color={C.green} />;
  if (op === 'بيع') return <PackageMinus size={16} color={C.primary} />;
  return <PackageSearch size={16} color={C.orange} />;
};
const movementBg = (op: string): string => (op === 'شراء' ? C.greenSoft : op === 'بيع' ? C.primarySoft : C.orangeSoft);

/* ------------------------------------------------------------------ */
/* Main page                                                          */
/* ------------------------------------------------------------------ */
export default function Page() {
  const [period, setPeriod] = useState<string>('هذا الشهر');
  const [from, setFrom] = useState<string>('2026-07-01');
  const [to, setTo] = useState<string>('2026-07-13');
  const [employee, setEmployee] = useState<string>('كل الموظفين');
  const [product, setProduct] = useState<string>('كل المنتجات');
  const [category, setCategory] = useState<string>('كل التصنيفات');
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [report, setReport] = useState<ReportsDashboard | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const data = await window.api.reports.getDashboard({
          from,
          to,
        });

        if (active) {
          setReport(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [from, to]);

  const inventory = report?.inventory ?? [];
  const inventoryValue = report?.summary.inventoryValue ?? 0;
  const expectedProfit = report?.summary.expectedProfit ?? 0;
  const totalSales = report?.summary.totalSales ?? 0;
  const totalPurchases = report?.summary.totalPurchases ?? 0;
  const grossProfit = report?.summary.grossProfit ?? 0;
  const monthly = report?.monthly ?? [];
  const bestSellers = report?.bestSelling ?? [];
  const profitability = report?.profitability ?? [];
  const employees = report?.employees ?? [];
  const suppliers = report?.suppliers ?? [];
  const customers = report?.customers ?? [];
  const lowStock = report?.lowStock ?? [];
  const movements = report?.movements ?? [];
  const lastPurchaseDate = report?.purchaseHistory?.[0]?.purchasedAt ?? null;
  const lastSaleDate = report?.salesHistory?.[0]?.soldAt ?? null;
  const inventoryHealthPct = inventory.length ? inventory.filter((item) => item.status !== 'منخفض').length / inventory.length : 0;
  const salesGoalPct = Math.min(1, totalSales / 650000);
  const profitPct = totalSales ? grossProfit / totalSales : 0;
  const productOptions = ['كل المنتجات', ...inventory.map((item) => item.name)];
  const profitabilityMap = new Map(profitability.map((item) => [item.name, item]));

  const resetFilters = (): void => {
    setPeriod('هذا الشهر'); setFrom('2026-07-01'); setTo('2026-07-13');
    setEmployee('كل الموظفين'); setProduct('كل المنتجات'); setCategory('كل التصنيفات');
  };
  const flashToast = (msg: string): void => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  return (
    <div dir="rtl" lang="ar" style={{
      backgroundColor: C.bg, minHeight: '100vh', fontFamily: FONT_BODY,
      color: C.ink, paddingBottom: '48px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        input[type="date"]::-webkit-calendar-picker-indicator{ opacity:0.6; cursor:pointer; }
        select{ cursor:pointer; }
        ::-webkit-scrollbar{ height:8px; width:8px; }
        ::-webkit-scrollbar-thumb{ background:${C.border}; border-radius:999px; }
      `}</style>

      {/* Sticky filter bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.border}`,
        padding: '14px 28px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.primary, fontWeight: 700, fontSize: '13px', marginLeft: '4px' }}>
          <Filter size={16} />
          <span>الفلاتر</span>
        </div>
        <Select icon={<Calendar size={15} />} value={period} onChange={setPeriod}
          options={['اليوم', 'هذا الأسبوع', 'هذا الشهر', 'هذا الربع', 'هذه السنة', 'مخصص']} />
        <DateField icon={<Calendar size={15} />} value={from} onChange={setFrom} />
        <DateField icon={<Calendar size={15} />} value={to} onChange={setTo} />
        <Select icon={<User size={15} />} value={employee} onChange={setEmployee}
          options={['كل الموظفين', 'أحمد سعيد', 'محمود عبد الله', 'كريم حسن', 'ياسمين علي']} />
        <Select icon={<Package size={15} />} value={product} onChange={setProduct}
          options={productOptions} />
        <Select icon={<Tag size={15} />} value={category} onChange={setCategory}
          options={['كل التصنيفات', 'زيوت ومواد تشحيم', 'فرامل', 'بطاريات', 'فلاتر', 'كهرباء', 'تبريد']} />

        <div style={{ display: 'flex', gap: '8px', marginRight: 'auto' }}>
          <button onClick={() => flashToast('تم تطبيق الفلاتر')} style={{
            display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: C.primary, color: '#FFFFFF',
            border: 'none', borderRadius: '10px', padding: '9px 16px', fontFamily: FONT_BODY, fontWeight: 700,
            fontSize: '13px', cursor: 'pointer',
          }}>
            <Filter size={14} /> تطبيق الفلاتر
          </button>
          <button onClick={resetFilters} style={{
            display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: C.surface, color: C.inkSoft,
            border: `1px solid ${C.border}`, borderRadius: '10px', padding: '9px 16px', fontFamily: FONT_BODY,
            fontWeight: 600, fontSize: '13px', cursor: 'pointer',
          }}>
            <RotateCcw size={14} /> إعادة تعيين
          </button>
          <button onClick={() => { flashToast('جارٍ تجهيز ملف PDF'); }} style={{
            display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: C.redSoft, color: C.red,
            border: 'none', borderRadius: '10px', padding: '9px 16px', fontFamily: FONT_BODY, fontWeight: 700,
            fontSize: '13px', cursor: 'pointer',
          }}>
            <FileDown size={14} /> تصدير PDF
          </button>
          <button onClick={() => flashToast('جارٍ تجهيز ملف Excel')} style={{
            display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: C.greenSoft, color: C.green,
            border: 'none', borderRadius: '10px', padding: '9px 16px', fontFamily: FONT_BODY, fontWeight: 700,
            fontSize: '13px', cursor: 'pointer',
          }}>
            <FileSpreadsheet size={14} /> تصدير Excel
          </button>
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', insetInlineStart: '50%', transform: 'translateX(-50%)',
          backgroundColor: C.ink, color: '#fff', padding: '10px 18px', borderRadius: '10px',
          fontFamily: FONT_BODY, fontSize: '13px', zIndex: 50, boxShadow: '0 10px 24px -8px rgba(0,0,0,0.35)',
        }}>
          {toast}
        </div>
      )}

      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* Header */}
        <div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: '26px', color: C.ink, margin: 0 }}>
            التقارير والإحصائيات
          </h1>
          <p style={{ fontFamily: FONT_BODY, fontSize: '14px', color: C.muted, marginTop: '6px' }}>
            تحليل شامل للمبيعات والمشتريات والأرباح والمخزون.
          </p>
        </div>

        {/* Instrument cluster — signature element */}
        <div style={{
          backgroundColor: C.primaryDark, borderRadius: '18px', padding: '22px 28px',
          display: 'flex', flexWrap: 'wrap', gap: '18px', alignItems: 'center', justifyContent: 'space-around',
          boxShadow: '0 20px 40px -20px rgba(15,51,82,0.55)',
        }}>
          <GaugeMeter pct={profitPct} label="هامش الربح الإجمالي" sub="من إجمالي المبيعات" color={C.gold} />
          <GaugeMeter pct={inventoryHealthPct} label="صحة المخزون" sub="منتجات فوق الحد الأدنى" color={C.gold} />
          <GaugeMeter pct={salesGoalPct} label="تحقيق هدف المبيعات" sub="الهدف السنوي" color={C.gold} />
        </div>

        {/* Section 1 — Financial summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          <StatCard icon={<Wallet size={18} />} accent={{ fg: C.primary, soft: C.primarySoft }}
            title="إجمالي المبيعات" value={arCurrency(totalSales)} sub="الفترة المختارة" />
          <StatCard icon={<ShoppingCart size={18} />} accent={{ fg: C.inkSoft, soft: C.surfaceAlt }}
            title="إجمالي المشتريات" value={arCurrency(totalPurchases)} sub="الفترة المختارة" />
          <StatCard icon={<TrendingUp size={18} />} accent={{ fg: C.green, soft: C.greenSoft }}
            title="إجمالي الربح الإجمالي" value={arCurrency(grossProfit)} sub="المبيعات − المشتريات" />
          <StatCard icon={<Warehouse size={18} />} accent={{ fg: C.gold, soft: C.goldSoft }}
            title="قيمة المخزون الحالية" value={arCurrency(inventoryValue)} sub="بسعر الشراء" />
          <StatCard icon={<Target size={18} />} accent={{ fg: C.green, soft: C.greenSoft }}
            title="الربح المتوقع من المخزون" value={arCurrency(expectedProfit)} sub="عند البيع بالكامل" />
          <StatCard icon={<Boxes size={18} />} accent={{ fg: C.primary, soft: C.primarySoft }}
            title="عدد المنتجات" value={arNum(report?.summary.productCount ?? 0)} sub="منتج نشط بالمخزون" />
        </div>

        {/* Section 2 — Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
          <SectionCard title="المبيعات مقابل المشتريات" icon={<TrendingUp size={17} />}>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart  data={report?.monthly ?? []} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <CartesianGrid stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontFamily: FONT_BODY, fontSize: 12, fill: C.muted }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis tick={{ fontFamily: FONT_BODY, fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => arNum(v / 1000) + 'ك'} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontFamily: FONT_BODY, fontSize: 12 }} />
                <Bar dataKey="sales" name="المبيعات" fill={C.chartSales} radius={[6, 6, 0, 0]} barSize={16} />
                <Bar dataKey="purchases" name="المشتريات" fill={C.chartPurchases} radius={[6, 6, 0, 0]} barSize={16} />
              </ComposedChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="الأرباح الشهرية" icon={<Target size={17} />}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthly} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.chartProfitLine} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.chartProfitLine} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontFamily: FONT_BODY, fontSize: 12, fill: C.muted }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis tick={{ fontFamily: FONT_BODY, fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => arNum(v / 1000) + 'ك'} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="profit" name="الربح الإجمالي" stroke={C.chartProfitLine} strokeWidth={2.5} fill="url(#profitFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        {/* Section 3 + 9 — Inventory report & low stock */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2.2fr) minmax(260px,1fr)', gap: '16px' }}>
          <SectionCard title="تقرير المخزون" icon={<Warehouse size={17} />}>
            <TableWrap>
              <thead><tr>
                <Th>اسم المنتج</Th><Th align="center">الكمية الحالية</Th><Th>سعر الشراء</Th>
                <Th>سعر البيع</Th><Th>قيمة المخزون</Th><Th>الربح المتوقع</Th><Th align="center">الحالة</Th>
              </tr></thead>
              <tbody>
                {inventory.map((p) => {
                  const s = statusStyle(p.status);
                  return (
                    <Row key={p.id} highlight={p.status === 'منخفض'}>
                      <Td style={{ fontWeight: 600, color: C.ink }}>{p.name}</Td>
                      <Td align="center">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', minWidth: '70px' }}>
                          <span>{arNum(p.quantity)}</span>
                          <ProgressBar value={p.quantity} max={Math.max(20, p.quantity + 10)} color={s.fg} />
                        </div>
                      </Td>
                      <Td>{arCurrency(p.buyPrice)}</Td>
                      <Td>{arCurrency(p.sellPrice)}</Td>
                      <Td style={{ fontWeight: 600 }}>{arCurrency(p.inventoryValue)}</Td>
                      <Td style={{ color: C.green, fontWeight: 600 }}>{arCurrency(p.expectedProfit)}</Td>
                      <Td align="center"><Badge fg={s.fg} bg={s.bg}>{p.status}</Badge></Td>
                    </Row>
                  );
                })}
              </tbody>
            </TableWrap>
          </SectionCard>

          <SectionCard title="المنتجات منخفضة المخزون" icon={<AlertTriangle size={17} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lowStock.length === 0 && (
                <p style={{ color: C.muted, fontSize: '13px' }}>لا توجد منتجات أقل من الحد الأدنى حاليًا.</p>
              )}
              {lowStock.map((p) => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                  backgroundColor: C.redSoft, borderRadius: '12px', padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={16} color={C.red} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: C.ink }}>{p.name}</div>
                      <div style={{ fontSize: '11.5px', color: C.muted }}>
                        الكمية: {arNum(p.quantity)} · الحد الأدنى: ٥
                      </div>
                    </div>
                  </div>
                  <Badge fg={C.red} bg="#FFFFFF">منخفض</Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Section 4 — Best sellers */}
        <SectionCard title="المنتجات الأكثر مبيعاً" icon={<ArrowUpRight size={17} />}>
          <TableWrap>
            <thead><tr>
              <Th>المنتج</Th><Th align="center">عدد القطع المباعة</Th><Th>إجمالي الإيرادات</Th><Th>إجمالي الأرباح</Th>
            </tr></thead>
            <tbody>
              {bestSellers.map((p) => {
                const profit = profitabilityMap.get(p.name)?.profit ?? 0;
                return (
                  <Row key={p.id}>
                    <Td style={{ fontWeight: 600, color: C.ink }}>{p.name}</Td>
                    <Td align="center">{arNum(p.sold)}</Td>
                    <Td>{arCurrency(p.revenue)}</Td>
                    <Td style={{ color: C.green, fontWeight: 600 }}>{arCurrency(profit)}</Td>
                  </Row>
                );
              })}
            </tbody>
          </TableWrap>
        </SectionCard>

        {/* Section 5 — Profitability */}
        <SectionCard title="ربحية المنتجات" icon={<Target size={17} />}>
          <TableWrap>
            <thead><tr>
              <Th>المنتج</Th><Th>تكلفة الشراء</Th><Th>إيرادات البيع</Th><Th>إجمالي الربح</Th><Th align="center">نسبة الربح %</Th>
            </tr></thead>
            <tbody>
              {profitability.map((p) => {
                const s = marginStyle(p.margin);
                return (
                  <Row key={p.id}>
                    <Td style={{ fontWeight: 600, color: C.ink }}>{p.name}</Td>
                    <Td>{arCurrency(p.estimatedCost)}</Td>
                    <Td>{arCurrency(p.revenue)}</Td>
                    <Td style={{ fontWeight: 600 }}>{arCurrency(p.profit)}</Td>
                    <Td align="center"><Badge fg={s.fg} bg={s.bg}>{arNum(p.margin)}٪</Badge></Td>
                  </Row>
                );
              })}
            </tbody>
          </TableWrap>
        </SectionCard>

        {/* Section 6 — Employee performance */}
        <SectionCard title="أداء الموظفين" icon={<User size={17} />}>
          <TableWrap>
            <thead><tr>
              <Th>الموظف</Th><Th align="center">عدد عمليات البيع</Th><Th>إجمالي المبيعات</Th>
              <Th align="center">عدد عمليات الشراء</Th><Th>قيمة المشتريات</Th>
            </tr></thead>
            <tbody>
              {employees.map((e) => (
                <Row key={e.id}>
                  <Td style={{ fontWeight: 600, color: C.ink }}>{e.username}</Td>
                  <Td align="center">{arNum(e.salesCount)}</Td>
                  <Td style={{ color: C.green, fontWeight: 600 }}>{arCurrency(e.salesValue)}</Td>
                  <Td align="center">{arNum(e.purchasesCount)}</Td>
                  <Td>{arCurrency(e.purchasesValue)}</Td>
                </Row>
              ))}
            </tbody>
          </TableWrap>
        </SectionCard>

        {/* Section 7 + 8 — Purchases & sales by party */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
          <SectionCard title="تقرير المشتريات" icon={<ShoppingCart size={17} />}>
            <TableWrap>
              <thead><tr><Th>المورد</Th><Th align="center">عدد الفواتير</Th><Th>إجمالي المشتريات</Th><Th>آخر عملية شراء</Th></tr></thead>
              <tbody>
                {suppliers.map((s) => (
                  <Row key={s.supplierName}>
                    <Td style={{ fontWeight: 600, color: C.ink }}>{s.supplierName}</Td>
                    <Td align="center">{arNum(s.invoices)}</Td>
                    <Td>{arCurrency(s.totalAmount)}</Td>
                    <Td style={{ color: C.muted }}>{lastPurchaseDate ?? '—'}</Td>
                  </Row>
                ))}
              </tbody>
            </TableWrap>
          </SectionCard>

          <SectionCard title="تقرير المبيعات" icon={<Wallet size={17} />}>
            <TableWrap>
              <thead><tr><Th>العميل</Th><Th align="center">عدد الفواتير</Th><Th>إجمالي المبيعات</Th><Th>آخر عملية بيع</Th></tr></thead>
              <tbody>
                {customers.map((c, i) => (
                  <Row key={`${c.customerName}-${i}`}>
                    <Td style={{ fontWeight: 600, color: c.customerName ? C.ink : C.muted }}>{c.customerName || 'عميل نقدي'}</Td>
                    <Td align="center">{arNum(c.invoices)}</Td>
                    <Td style={{ color: C.green, fontWeight: 600 }}>{arCurrency(c.revenue)}</Td>
                    <Td style={{ color: C.muted }}>{lastSaleDate ?? '—'}</Td>
                  </Row>
                ))}
              </tbody>
            </TableWrap>
          </SectionCard>
        </div>

        {/* Section 10 — Inventory movement timeline */}
        <SectionCard title="حركة المخزون" icon={<Clock size={17} />}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {movements.map((m, i) => {
              const operation = m.type === 'purchase' ? 'شراء' : 'بيع';
              return (
                <div key={m.id} style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '10px', backgroundColor: movementBg(operation),
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {movementIcon(operation)}
                    </div>
                    {i !== movements.length - 1 && <div style={{ width: '2px', flex: 1, backgroundColor: C.border, margin: '4px 0' }} />}
                  </div>
                  <div style={{ paddingBottom: '20px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: '13.5px', color: C.ink }}>{m.productName}</span>
                      <Badge
                        fg={operation === 'شراء' ? C.green : C.primary}
                        bg={movementBg(operation)}
                      >
                        {operation}
                      </Badge>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px', fontSize: '12.5px', color: C.muted }}>
                      <span>{m.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {m.quantity > 0 ? <ArrowUpRight size={13} color={C.green} /> : <ArrowDownRight size={13} color={C.red} />}
                        الكمية: {arNum(Math.abs(m.quantity))}
                      </span>
                      <span>الموظف: {m.employee ?? '—'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

      </div>
    </div>
  );
}