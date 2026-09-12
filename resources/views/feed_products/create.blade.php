@extends('layouts.admin')

@section('title', 'Add Feed Product')
@section('page_title', 'Add Feed Product')

@section('content')
<form method="POST" action="{{ route('feed_products.store') }}" class="max-w-3xl rounded-xl bg-white p-6 shadow-sm">
    @csrf
    @include('feed_products._form')
    <button class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Save Product</button>
</form>
@endsection
