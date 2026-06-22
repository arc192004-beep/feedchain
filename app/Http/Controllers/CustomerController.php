<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $items = Customer::paginate(15);
        return view('customers.index', compact('items'));
    }

    public function create()
    {
        return view('customers.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_code' => 'required|unique:customers,customer_code',
            'customer_name' => 'required',
        ]);

        Customer::create($data);
        return redirect()->route('customers.index')->with('success','Saved');
    }

    public function edit(Customer $customer)
    {
        return view('customers.edit', compact('customer'));
    }

    public function update(Request $request, Customer $customer)
    {
        $data = $request->validate([
            'customer_code' => 'required|unique:customers,customer_code,' . $customer->id,
            'customer_name' => 'required',
        ]);

        $customer->update($data);
        return redirect()->route('customers.index')->with('success','Updated');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->route('customers.index')->with('success','Deleted');
    }
}
