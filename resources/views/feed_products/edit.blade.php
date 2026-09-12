@extends('layouts.admin')

@section('title', 'Edit Feed Product')
@section('page_title', 'Edit Feed Product')

@section('content')
<form method="POST" action="{{ route('feed_products.update', $product) }}" class="max-w-3xl rounded-xl bg-white p-6 shadow-sm">
    @csrf @method('PUT')
    @include('feed_products._form', ['product' => $product])
    <button class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Update Product</button>
</form>
@endsection
