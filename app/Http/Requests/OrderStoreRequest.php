<?php

namespace App\Http\Requests;

use App\Enums\SubscriptionPeriod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class OrderStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'account_holder_name' => 'required|string|min:3|max:100',
            'payment_method' => 'required|integer|exists:payment_methods,id',
            'payment_screenshot' => 'required|mimes:png,jpg',
            'period' => ['required', new Enum(SubscriptionPeriod::class)],  
            'area_code' => 'nullable|numeric|digits:3',
            'is_renewal' => 'nullable|boolean'
        ];
    }
}
