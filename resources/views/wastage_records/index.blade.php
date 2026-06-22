@extends('layouts.app')
@section('content')
<div class="d-flex justify-content-between"><h3>Wastage Records</h3><a href="{{ route('wastage_records.create') }}" class="btn btn-primary">Record</a></div>
<table class="table"><thead><tr><th>#</th><th>Type</th><th>Quantity</th><th>Date</th></tr></thead><tbody>
@foreach($items as $w)<tr><td>{{ $w->id }}</td><td>{{ $w->wastage_type }}</td><td>{{ $w->quantity }}</td><td>{{ $w->date_recorded }}</td></tr>@endforeach
</tbody></table>
{{ $items->links() }}
@endsection
