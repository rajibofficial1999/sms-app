<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class VerificationCodeController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'code' => 'required|numeric'
        ]);

        $user = Auth::user();
        $dbVerificationCode = $user->verification_code()->where('code', $request->code)->first();

         if (!$dbVerificationCode) {
            throw ValidationException::withMessages([
                'code' => 'Invalid verification code'
            ]);
        }

        if ($dbVerificationCode->is_used) {
            throw ValidationException::withMessages([
                'code' => 'This verification code has already been used.'
            ]);
        }

        $expiryTime = $dbVerificationCode->created_at->addDay();
        
         if (Carbon::now()->greaterThan($expiryTime)) {
            throw ValidationException::withMessages([
                'code' => 'Verification code has expired.'
            ]);
        }

        // dd($dbVerificationCode);

        $dbVerificationCode->update([
            'is_used' => true
        ]);

        $user->update([
            'email_verified_at' => Carbon::now()
        ]);
        
        return redirect()->route('dashboard');
    }
}
