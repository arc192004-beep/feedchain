<?php

namespace App\Http\Controllers;

use App\Models\StockAlert;
use Illuminate\Http\Request;

class StockAlertController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $alerts = StockAlert::with('rawMaterial','feedProduct')->paginate(20);
        return view('stock_alerts.index', compact('alerts'));
    }

    public function resolve(StockAlert $stock_alert)
    {
        $stock_alert->update(['status' => 'resolved']);
        return redirect()->back()->with('success','Alert resolved');
    }
}
