@extends('layouts.admin')

@section('title', 'Edit Feed Formula')
@section('page_title', 'Edit Feed Formula')

@section('content')
<form method="POST" action="{{ route('feed_formulas.update', $feed_formula) }}" class="rounded-xl bg-white p-6 shadow-sm">
    @csrf @method('PUT')
    @include('feed_formulas._form', ['formula' => $feed_formula])
    <button class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Update Formula</button>
</form>
@endsection

@push('scripts')
    @include('feed_formulas._items_script')
@endpush
