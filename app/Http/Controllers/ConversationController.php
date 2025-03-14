<?php

namespace App\Http\Controllers;

use App\Models\BlockList;
use App\Models\Conversation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ConversationController extends Controller
{
    public function destroy(Conversation $conversation): RedirectResponse
    {
        $messages = $conversation->messages()->with('image')->get();

        foreach ($messages as $message) {
            $image = $message->image;

            if($image) {
                if (Storage::disk('public')->exists($image->image_url)) {
                    Storage::disk('public')->delete($image->image_url);
                }
            }
        }

        $conversation->delete();

        return redirect()->route('messages.index');
    }

    public function block(Conversation $conversation): RedirectResponse
    {        
        BlockList::updateOrCreate(
            [
                'conversation_id' => $conversation->id,
                'user_id' => Auth::user()->id,
            ],
            [
                'blocked_number' => $conversation->traffic_number,
            ]
        );

        return redirect()->back();
    }

    public function unBlock(Conversation $conversation): RedirectResponse
    {
        $conversation->blockList()->delete();

        return redirect()->back();
    }

    public function blockAndDestroy(Conversation $conversation): RedirectResponse
    {        
        $conversation->blockList()->create([
            'blocked_number' => $conversation->traffic_number,
            'user_id' => Auth::user()->id,
        ]);

        $messages = $conversation->messages()->with('image')->get();

        foreach ($messages as $message) {
            $image = $message->image;

            if($image) {
                if (Storage::disk('public')->exists($image->image_url)) {
                    Storage::disk('public')->delete($image->image_url);
                }
            }
        }

        $conversation->delete();

        return redirect()->route('messages.index');
    }
    
}
