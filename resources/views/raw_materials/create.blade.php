@extends('layouts.admin')

@section('title', 'Add Raw Material')
@section('page_title', 'Add Raw Material')

@section('content')
<form method="POST" action="{{ route('raw_materials.store') }}" class="max-w-3xl rounded-xl bg-white p-6 shadow-sm">
    @csrf
    @include('raw_materials._form')
    <button class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Save Material</button>
</form>
@endsection
