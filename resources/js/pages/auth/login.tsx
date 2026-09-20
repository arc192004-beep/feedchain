import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import LoginComponent from '@/components/Login';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    needsSuperAdminSetup?: boolean;
}

export default function Login({ status, needsSuperAdminSetup = false }: LoginProps) {
    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />
            <LoginComponent needsSuperAdminSetup={needsSuperAdminSetup} />
            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
