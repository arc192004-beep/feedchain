<?php

namespace App\Http\Controllers;

use App\Models\Buyer;
use Illuminate\Http\Request;

class BuyerController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:production_manager,super_admin']);
    }

    public function index(Request $request)
    {
        $query = Buyer::query();

        if ($search = $request->get('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('buyer_name', 'like', "%{$search}%")
                    ->orWhere('fishpond_or_cage_name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $items = $query->orderBy('buyer_name')->paginate(15);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($items);
        }

        return view('buyers.index', compact('items'));
    }

    private function workspaceId(): ?int
    {
        return auth()->user()?->workspace_id;
    }

    public function create()
    {
        return view('buyers.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'buyer_name' => 'required|string|max:255',
            'fishpond_or_cage_name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'contact_number' => 'required|string|max:50',
            'contact_person' => 'nullable|string|max:255',
        ]);

        // Codes are globally unique, so include the workspace to keep two
        // workspaces from generating the same value.
        $data['buyer_code'] = 'BUYER-'.$this->workspaceId().'-' . str_pad((string) (Buyer::max('id') + 1), 4, '0', STR_PAD_LEFT);
        $buyer = Buyer::create($data);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($buyer, 201);
        }

        return redirect()->route('buyers.index')->with('success', 'Buyer registered successfully.');
    }

    public function show(Buyer $buyer)
    {
        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json($buyer);
        }
        return view('buyers.show', compact('buyer'));
    }

    public function edit(Buyer $buyer)
    {
        return view('buyers.edit', compact('buyer'));
    }

    public function update(Request $request, Buyer $buyer)
    {
        $data = $request->validate([
            'buyer_name' => 'required|string|max:255',
            'fishpond_or_cage_name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'contact_number' => 'required|string|max:50',
            'contact_person' => 'nullable|string|max:255',
        ]);

        $buyer->update($data);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($buyer->fresh(), 200);
        }

        return redirect()->route('buyers.index')->with('success', 'Buyer updated successfully.');
    }

    public function destroy(Buyer $buyer)
    {
        abort_if($buyer->distributions()->exists(), 422, 'Cannot delete buyer because they have distribution delivery records.');

        $buyer->delete();

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json(['deleted' => true], 200);
        }

        return redirect()->route('buyers.index')->with('success', 'Buyer deleted successfully.');
    }
}
