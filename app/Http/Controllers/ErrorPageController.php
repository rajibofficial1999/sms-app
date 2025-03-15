<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ErrorPageController extends Controller
{
    public function unauthorized(Request $request): Response
    {
        return Inertia::render('Errors/Unauthorized', [
            'backTo' => $request->backTo,
        ]);
    }
}
