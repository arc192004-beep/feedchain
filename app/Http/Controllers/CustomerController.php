<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:production_manager,super_admin']);
    }

    public function index(Request $request)
    {
        $customers = Customer::query()
            ->when($request->q, fn ($query, $q) => $query->where('name', 'like', "%{$q}%")->orWhere('address', 'like', "%{$q}%"))
            ->orderBy('name')->paginate(15);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($customers);
        }

        return view('customers.index', compact('customers'));
    }

    public function create()
    {
        return view('customers.create');
    }

    public function store(Request $request)
    {
        $customer = Customer::create($this->validated($request));

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($customer, 201);
        }

        return redirect()->route('customers.index')->with('success', 'Customer saved successfully.');
    }

    public function show(Customer $customer)
    {
        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json($customer);
        }

        return view('customers.show', compact('customer'));
    }

    public function edit(Customer $customer)
    {
        return view('customers.edit', compact('customer'));
    }

    public function update(Request $request, Customer $customer)
    {
        $customer->update($this->validated($request));

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($customer->fresh(), 200);
        }

        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        abort_if($customer->sales()->exists(), 422, 'Customers with recorded sales cannot be deleted.');

        $customer->delete();

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json(['deleted' => true], 200);
        }

        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'fish_cage' => 'nullable|string|max:255',
            'address' => 'required|string|max:500',
            'contact_number' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);
    }
}
