<?php

namespace App\Http\Controllers;

use App\Models\BlockList;
use Illuminate\Http\RedirectResponse;

class PhoneNumberController extends Controller
{
    public function unBlock(BlockList $blockList): RedirectResponse
    {
        $blockList->delete();

        return redirect()->back();
    }
}
