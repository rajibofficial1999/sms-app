<?php

namespace App\Helpers;

use Illuminate\Http\RedirectResponse;

class Redirect {
    public static function unauthorized(): RedirectResponse
    {
        $previousUrl = url()->previous();
        $parsedUrl = parse_url($previousUrl);

        $absolutePath = $parsedUrl['path'];

        return redirect()->route('admin.unauthorized', [
            'backTo' => $absolutePath,
        ]);
    }
}