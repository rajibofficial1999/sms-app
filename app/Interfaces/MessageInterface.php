<?php

namespace App\Interfaces;

use Illuminate\Support\Collection;

interface MessageInterface
{
    public function sendSMS(string $reciever_number, string $body): Collection;

    public function sendMMS(string $reciever_number, string $image_url): Collection;

}
