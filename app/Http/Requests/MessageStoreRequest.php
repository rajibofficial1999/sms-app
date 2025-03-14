<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MessageStoreRequest extends FormRequest
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
            'body'         => 'nullable|string',
            'image'        => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'conversation' => 'nullable|exists:conversations,id',
            'receiver_number' => 'required|phone:US',
        ];
    }

    public function messages(): array
    {
        return [
            'receiver_number.phone' => 'The :attribute field must be a valid phone number.',
        ];            
    }
}
