<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(): Response
    {
        $user = Auth::guard('admin')->user();

        return Inertia::render('Admin/Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = Auth::guard('admin')->user();

         if($request->hasFile('avatar')) {
            $image = $request->file('avatar');
            $validated['avatar'] = $image->store('images/avatars', 'public');

            if (Storage::disk('public')->exists($user->avatar || '')) {
                Storage::disk('public')->delete($user->avatar || '');
            }

        }else{
            unset($validated['avatar']);
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;

            $user->sendEmailVerificationNotification();
        }

        $user->save();

        return Redirect::route('admin.profile.edit');
    }
}
