import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, ShieldCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface SetupForm {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function SetupSuperAdmin() {
    const { data, setData, post, processing, errors, reset } = useForm<SetupForm>({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('setup.super_admin.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Create Super Admin Account"
            description="Set up the first Super Administrator account for FeedChain."
        >
            <Head title="Create Super Admin Account" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900">
                    <div className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 shrink-0" size={18} />
                        <p>
                            This setup option is available only while no Super Administrator exists.
                            The role and a new isolated workspace are assigned server-side.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            required
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.username} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create Super Admin Account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account? <TextLink href={route('login')}>Sign in</TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
