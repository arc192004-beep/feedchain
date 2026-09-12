@extends('layouts.admin')

@section('title', 'Edit Raw Material')
@section('page_title', 'Edit Raw Material')

@section('content')
<form method="POST" action="{{ route('raw_materials.update', $material) }}" class="max-w-3xl rounded-xl bg-white p-6 shadow-sm">
    @csrf @method('PUT')
    @include('raw_materials._form', ['material' => $material])
    <button class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Update Material</button>
</form>
@endsection
