import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui-lite";

export default function CustomersPage() {
  return (
    <div dir="rtl" className="mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>العملاء</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>يتم تسجيل اسم العميل ورقم الهاتف داخل فاتورة البيع حالياً.</p>
          <p>هذه الصفحة جاهزة للتوسع لاحقاً إلى سجل عملاء كامل عند الحاجة.</p>
        </CardContent>
      </Card>
    </div>
  );
}
