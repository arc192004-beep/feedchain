@extends('layouts.app')
@section('content')
<h3>Stock Alerts</h3>
<table class="table"><thead><tr><th>#</th><th>Type</th><th>Message</th><th>Status</th><th>Action</th></tr></thead><tbody>
@foreach($alerts as $a)
<tr><td>{{ $a->id }}</td><td>{{ $a->alert_type }}</td><td>{{ $a->message }}</td><td>{{ $a->status }}</td>
<td>@if($a->status=='active')<form method="POST" action="{{ route('stock_alerts.resolve',$a) }}">@csrf<button class="btn btn-sm btn-success">Resolve</button></form>@endif</td></tr>
@endforeach
</tbody></table>
{{ $alerts->links() }}
@endsection
