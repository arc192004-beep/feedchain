@extends('layouts.admin')

@section('title', 'Feed Product Details')
@section('page_title', 'Feed Product Details')

@section('content')
<div class="max-w-3xl rounded-xl bg-white p-6 shadow-sm">
    <dl class="grid gap-4 md:grid-cols-2">
        <div><dt class="text-sm text-slate-500">Code</dt><dd class="font-medium">{{ $product->product_code }}</dd></div>
        <div><dt class="text-sm text-slate-500">Name</dt><dd class="font-medium">{{ $product->product_name }}</dd></div>
        <div><dt class="text-sm text-slate-500">Feed Type</dt><dd>{{ $product->feed_type }}</dd></div>
        <div><dt class="text-sm text-slate-500">Unit</dt><dd>{{ $product->unit }}</dd></div>
        <div><dt class="text-sm text-slate-500">Price</dt><dd>₱{{ number_format($product->price, 2) }}</dd></div>
        <div><dt class="text-sm text-slate-500">Status</dt><dd>{{ ucfirst($product->status) }}</dd></div>
        <div class="md:col-span-2"><dt class="text-sm text-slate-500">Description</dt><dd>{{ $product->description ?: '—' }}</dd></div>
    </dl>

    @if($product->formulas->count())
        <div class="mt-6">
            <h3 class="font-semibold">Linked Formulas</h3>
            <ul class="mt-2 list-disc pl-5 text-sm text-slate-700">
                @foreach($product->formulas as $formula)
                    <li><a href="{{ route('feed_formulas.show', $formula) }}" class="text-blue-600 hover:underline">{{ $formula->formula_name }}</a></li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="mt-6 flex gap-3">
        <a href="{{ route('feed_products.edit', $product) }}" class="rounded-lg bg-amber-500 px-4 py-2 text-sm text-white">Edit</a>
        <a href="{{ route('feed_products.index') }}" class="rounded-lg bg-slate-200 px-4 py-2 text-sm">Back</a>
    </div>
</div>
@endsection
