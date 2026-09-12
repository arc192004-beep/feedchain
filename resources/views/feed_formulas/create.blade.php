@extends('layouts.admin')

@section('title', 'Create Feed Formula')
@section('page_title', 'Create Feed Formula')

@section('content')
<form method="POST" action="{{ route('feed_formulas.store') }}" class="rounded-xl bg-white p-6 shadow-sm">
    @csrf
    @include('feed_formulas._form')
    <button class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Save Formula</button>
</form>
@endsection

@push('scripts')
    @include('feed_formulas._items_script')
@endpush
