<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Password reset</title>
</head>
<body>
    <div>
        <h1>Password reset</h1>
        <p>Hello {{ $user->name }},</p>
        <p>Password reset.</p>
        <p>{{ $url }}</p>
    </div>
</body>
</html>