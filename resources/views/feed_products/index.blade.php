@extends('layouts.admin')

@section('title', 'Feed Products')
@section('page_title', 'Feed Products')
@section('page_subtitle', 'Manage feed product catalog')

@section('content')
<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <form method="GET" class="flex gap-2">
        <input type="text" name="q" value="{{ request('q') }}" placeholder="Search products..." class="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <button class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white">Search</button>
    </form>
    <a href="{{ route('feed_products.create') }}" class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Add Feed Product</a>
</div>

<div class="overflow-hidden rounded-xl bg-white shadow-sm">
    <table class="min-w-full text-sm">
        <thead class="bg-slate-50 text-left text-slate-600">
            <tr>
                <th class="px-4 py-3">Code</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Feed Type</th>
                <th class="px-4 py-3">Unit</th>
                <th class="px-4 py-3">Price</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($products as $product)
                <tr class="border-t border-slate-100">
                    <td class="px-4 py-3 font-medium">{{ $product->product_code }}</td>
                    <td class="px-4 py-3">{{ $product->product_name }}</td>
                    <td class="px-4 py-3">{{ $product->feed_type }}</td>
                    <td class="px-4 py-3">{{ $product->unit }}</td>
                    <td class="px-4 py-3">₱{{ number_format($product->price, 2) }}</td>
                    <td class="px-4 py-3">{{ ucfirst($product->status) }}</td>
                    <td class="px-4 py-3">
                        <div class="flex gap-2">
                            <a href="{{ route('feed_products.show', $product) }}" class="text-blue-600 hover:underline">View</a>
                            <a href="{{ route('feed_products.edit', $product) }}" class="text-amber-600 hover:underline">Edit</a>
                            <form action="{{ route('feed_products.destroy', $product) }}" method="POST" onsubmit="return confirm('Delete this product?')">
                                @csrf @method('DELETE')
                                <button class="text-red-600 hover:underline">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
            @empty
                <tr><td colspan="7" class="px-4 py-8 text-center text-slate-500">No feed products found.</td></tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="mt-4">{{ $products->withQueryString()->links() }}</div>
@endsection
