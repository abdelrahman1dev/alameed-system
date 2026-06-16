import React from 'react'

function page() {
    return (
<div className="min-h-screen flex items-center justify-center bg-slate-100">
  <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-8">
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">
        مركز العميد
      </h1>

      <p className="text-slate-600">
        مرحباً مدير النظام في نظام إدارة مركز العميد
      </p>
    </div>

    <form className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          كلمة المرور
        </label>

        <input
          type="password"
          placeholder="أدخل كلمة المرور"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        تسجيل الدخول
      </button>
    </form>
  </div>
</div>
    )
}

export default page
