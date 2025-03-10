<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Email Verification</title>
</head>
<body>
    <div>
        <h1>Email Verification</h1>
        <p>Hello {{ $user->name }},</p>
        <p>Your verification code is.</p>
        <p>{{ $code }}</p>
    </div>
</body>
</html>