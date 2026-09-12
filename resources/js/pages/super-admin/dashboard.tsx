import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Activity, ShieldCheck, UserCheck, UserMinus, Users } from 'lucide-react';

export default function SuperAdminDashboard({ users = [], activities = [], systemStatus = 'Operational' }: any) {
    const active = users.filter((user: any) => user.status === 'active').length;
    const inactive = users.length - active;
    const roleCount = (role: string) => users.filter((user: any) => user.role === role).length;
    const cards = [
        ['Registered Users', users.length, Users, 'text-teal-600 bg-teal-50'],
        ['Active Accounts', active, UserCheck, 'text-emerald-600 bg-emerald-50'],
        ['Inactive Accounts', inactive, UserMinus, 'text-amber-600 bg-amber-50'],
        ['System Status', systemStatus, ShieldCheck, 'text-indigo-600 bg-indigo-50'],
    ];

    return <AppLayout breadcrumbs={[{ title: 'Super Administrator', href: route('dashboard.super_admin') }]}>
        <Head title="Super Administrator" />
        <div className="space-y-6 p-4 md:p-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-lg">
                <p className="text-xs font-bold tracking-widest text-teal-400">SUPER ADMINISTRATOR</p>
                <h1 className="mt-2 text-2xl font-bold">System Administration Dashboard</h1>
                <p className="mt-1 text-sm text-slate-300">Manage user accounts, roles, access, system configuration, and audit activity.</p>
            </section>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon, style]: any) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className={`inline-flex rounded-xl p-3 ${style}`}><Icon size={20} /></div><p className="mt-4 text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-800">{value}</p></div>)}</div>
            <div className="grid gap-6 lg:grid-cols-3">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-bold text-slate-800">Recent User Activity</h2><p className="text-xs text-slate-500">Authentication and account administration events</p></div><Activity className="text-teal-600" size={18}/></div><div className="space-y-3">{activities.length ? activities.map((log: any) => <div key={log.id} className="border-b border-slate-100 pb-3 text-sm"><span className="font-semibold text-slate-800">{log.user?.name || 'System'}</span><span className="text-slate-600"> — {log.description || log.action}</span><p className="mt-1 text-xs text-slate-400">{log.module} · {new Date(log.created_at).toLocaleString()}</p></div>) : <p className="text-sm text-slate-500">No activity recorded yet.</p>}</div></section>
                <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-sm font-bold text-slate-800">Role Distribution</h2><div className="mt-4 space-y-3 text-sm"><p>Super Administrators <b className="float-right">{roleCount('super_admin')}</b></p><p>Administrators <b className="float-right">{roleCount('administrator')}</b></p><p>Production Managers <b className="float-right">{roleCount('production_manager')}</b></p></div><Link href={route('users.index')} className="mt-6 block rounded-xl bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white">Manage User Accounts</Link></section>
            </div>
        </div>
    </AppLayout>;
}
