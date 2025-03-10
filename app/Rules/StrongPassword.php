<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rules\Password;

class StrongPassword implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $passwordRules = Password::min(8) 
            ->mixedCase() // Requires both uppercase & lowercase
            ->letters() // Must contain at least one letter
            ->numbers() // Must contain at least one number
            ->symbols() // Must contain at least one special character
            ->uncompromised(); // Checks if the password is in a data breach

        $validator = validator([$attribute => $value], [
            $attribute => $passwordRules
        ]);

        if ($validator->fails()) {
            $fail("The {$attribute} must be a strong password (at least 10 characters, including uppercase, lowercase, numbers, and symbols).");
        }
    }
}
