<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class VerificationCodeController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'code' => 'required|numeric',
            'email' => 'required|email|exists:admins,email',
        ]);

        $user = Admin::whereEmail($request->email)->first();
        
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


        $dbVerificationCode->update([
            'is_used' => true
        ]);

        $user->update([
            'email_verified_at' => Carbon::now()
        ]);
        
        return redirect()->back();
    }
}
