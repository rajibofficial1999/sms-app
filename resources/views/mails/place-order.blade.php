<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Order Mail</title>
</head>
<body>
    <div>
        <p>Hello {{ $user->name }},</p>
        <h1>Your order has been placed successfully.</h1>
        <p>Order details:</p>
        <ul>
            <li>Account holder name: {{ $order->account_holder_name }}</li>
            <li>Payment method: {{ $order->paymentMethod->type }}</li>
            @if ($order->isRenewal)
                <li>Renewal Number: {{ $user->phoneNumber->number }}</li>
            @else
                <li>Area code: {{ $order->area_code }}</li>
            @endif
            <li>Price: {{ $price }}</li>
            <li>Period: {{ $order->period->value }}</li>
            <li>Status: Pending</li>
        </ul>
    </div>
</body>
</html>