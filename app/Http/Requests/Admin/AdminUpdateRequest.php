<?php

namespace App\Http\Requests\Admin;

use App\Rules\StrongPassword;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUpdateRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('admins', 'email')->ignore($this->route('admin_user')->id)],
            'password' => ['nullable', 'confirmed', new StrongPassword()],
            'roles' => 'required|array',
            'roles.*' => 'required|integer|exists:roles,id',
        ];
    }

}
