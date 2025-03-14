<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PhoneNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PhoneNumberController extends Controller
{
    public function index(): Response
    {
        $phoneNumbers = PhoneNumber::with('user')->latest()->paginate(10);
        
        return Inertia::render('Admin/PhoneNumber/Index',[
            'phoneNumbers' => $phoneNumbers,
        ]);
    }

    public function update(Request $request, PhoneNumber $phoneNumber): RedirectResponse
    {
        $request->validate([
            'number' => ['required', 'string', 'max:255', 'phone:US', Rule::unique('phone_numbers')->ignore($phoneNumber->id)], 
        ], [
            'number.phone' => 'Invalid phone number',
        ]);

        $phoneNumber->update($request->all());
        
        return redirect()->route('admin.phone-numbers.index');
    }

    public function toggleStatus(PhoneNumber $phoneNumber): RedirectResponse
    {        
       $phoneNumber->update([
            'status' => !$phoneNumber->status,
        ]);

       return redirect()->back();
    }

    
    public function destroy(PhoneNumber $phoneNumber): RedirectResponse
    {
        if (Gate::forUser(Auth::guard('admin')->user())->denies('delete', $phoneNumber)) {
            abort(403, 'Unauthorized');
        }

       $phoneNumber->delete();

       return redirect()->back();
    }

    public function search(?string $search = null): JsonResponse
    {
        $phoneNumbers = PhoneNumber::with('user')->when($search, function($query) use ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%$search%");
            });
        })->latest()->paginate(10);

        return response()->json([
            'phoneNumbers' => $phoneNumbers,
        ]);
    }
}
