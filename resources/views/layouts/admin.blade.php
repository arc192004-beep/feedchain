<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'FEEDCHAIN')</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 text-slate-800">
<div class="flex min-h-screen">
    @include('partials.sidebar')

    <div class="flex flex-1 flex-col">
        <header class="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-xl font-semibold text-slate-900">@yield('page_title', 'Dashboard')</h1>
                    <p class="text-sm text-slate-500">@yield('page_subtitle')</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium">{{ auth()->user()->name }}</p>
                    <p class="text-xs capitalize text-slate-500">{{ str_replace('_', ' ', auth()->user()->role) }}</p>
                </div>
            </div>
        </header>

        <main class="flex-1 p-6">
            @if(session('success'))
                <div class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                    {{ session('success') }}
                </div>
            @endif
            @if(session('error'))
                <div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                    {{ session('error') }}
                </div>
            @endif
            @if($errors->any())
                <div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                    <ul class="list-disc pl-5">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</div>
@stack('scripts')
</body>
</html>
