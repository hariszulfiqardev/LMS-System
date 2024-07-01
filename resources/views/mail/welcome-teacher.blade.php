<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333333;
        }

        .content {
            margin: 20px 0;
        }

        .footer {
            margin-top: 20px;
            color: #777777;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Hi {{ $mail_data['name'] }},</h1>
        <div class="content">
            <p>Welcome to <strong>QuizPrism</strong>!</p>
            <p>Your account has been created successfully.</p>
            <p>Your new password is: <strong class="underline">{{ $mail_data['password'] }}</strong></p>
        </div>
        <p>If you have any questions or need further assistance, please do not hesitate to reach out to us.</p>
        <p>Thank you for choosing us.</p>
        <div class="footer">
            <p>Best regards,</p>
        </div>
    </div>
</body>

</html>
