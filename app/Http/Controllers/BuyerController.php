<?php

namespace App\Http\Controllers;

use App\Models\Buyer;
use Illuminate\Http\Request;

class BuyerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $items = Buyer::paginate(15);
        return view('buyers.index', compact('items'));
    }

    public function create()
    {
        return view('buyers.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'buyer_code' => 'required|unique:buyers,buyer_code',
            'buyer_name' => 'required',
            'buyer_type' => 'required',
        ]);

        Buyer::create($data);
        return redirect()->route('buyers.index')->with('success','Saved');
    }

    public function edit(Buyer $buyer)
    {
        return view('buyers.edit', compact('buyer'));
    }

    public function update(Request $request, Buyer $buyer)
    {
        $data = $request->validate([
            'buyer_code' => 'required|unique:buyers,buyer_code,' . $buyer->id,
            'buyer_name' => 'required',
            'buyer_type' => 'required',
        ]);

        $buyer->update($data);
        return redirect()->route('buyers.index')->with('success','Updated');
    }

    public function destroy(Buyer $buyer)
    {
        $buyer->delete();
        return redirect()->route('buyers.index')->with('success','Deleted');
    }
}
