<?php
header('Content-Type: application/json; charset=UTF-8');

$emailTo = getenv('EMAIL_TO') ?: 'ankitgupta31@gmail.com';
$allowedForms = ['payment-form', 'apply-form', 'quote-form'];

function getSmtpConfig() {
    $smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
    $smtpPort = getenv('SMTP_PORT') ?: '587';
    $smtpUser = getenv('SMTP_USER') ?: 'ankitgupta31@gmail.com';
    $smtpPass = getenv('SMTP_PASS') ?: '';
    $smtpSecure = getenv('SMTP_SECURE') ?: 'tls';
    $fromEmail = getenv('SMTP_FROM') ?: 'ankitgupta31@gmail.com';

    return [$smtpHost, (int) $smtpPort, $smtpUser, $smtpPass, $smtpSecure, $fromEmail];
}

function sendSmtpMail($smtpHost, $smtpPort, $smtpUser, $smtpPass, $smtpSecure, $fromEmail, $toEmail, $subject, $body) {
    $secure = strtolower((string) $smtpSecure);
    $transport = $secure === 'ssl' ? 'ssl://' : '';
    $socket = @stream_socket_client(($transport ?: '') . $smtpHost . ':' . (int) $smtpPort, $errno, $errstr, 30);

    if (!$socket) {
        return false;
    }

    $readResponse = function ($connection) {
        $response = '';
        while (!feof($connection)) {
            $line = fgets($connection, 512);
            $response .= $line;
            if (substr($line, 3, 1) === ' ') {
                break;
            }
        }
        return trim($response);
    };

    $writeCommand = function ($connection, $command) {
        fwrite($connection, $command . "\r\n");
        return $command;
    };

    $response = $readResponse($socket);
    if (strpos($response, '220') !== 0) {
        fclose($socket);
        return false;
    }

    $writeCommand($socket, 'EHLO localhost');
    $response = $readResponse($socket);
    if (strpos($response, '250') !== 0) {
        fclose($socket);
        return false;
    }

    if ($smtpUser !== '' && $smtpPass !== '') {
        $writeCommand($socket, 'AUTH LOGIN');
        $response = $readResponse($socket);
        if (strpos($response, '334') !== 0) {
            fclose($socket);
            return false;
        }

        $writeCommand($socket, base64_encode($smtpUser));
        $response = $readResponse($socket);
        if (strpos($response, '334') !== 0) {
            fclose($socket);
            return false;
        }

        $writeCommand($socket, base64_encode($smtpPass));
        $response = $readResponse($socket);
        if (strpos($response, '235') !== 0) {
            fclose($socket);
            return false;
        }
    }

    $writeCommand($socket, 'MAIL FROM:<' . $fromEmail . '>');
    $response = $readResponse($socket);
    if (strpos($response, '250') !== 0) {
        fclose($socket);
        return false;
    }

    $writeCommand($socket, 'RCPT TO:<' . $toEmail . '>');
    $response = $readResponse($socket);
    if (strpos($response, '250') !== 0 && strpos($response, '251') !== 0) {
        fclose($socket);
        return false;
    }

    $writeCommand($socket, 'DATA');
    $response = $readResponse($socket);
    if (strpos($response, '354') !== 0) {
        fclose($socket);
        return false;
    }

    $headers = [
        'From: ' . $fromEmail,
        'To: ' . $toEmail,
        'Subject: ' . $subject,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
        '',
        $body
    ];

    fwrite($socket, implode("\r\n", $headers) . "\r\n.");
    $response = $readResponse($socket);
    if (strpos($response, '250') !== 0) {
        fclose($socket);
        return false;
    }

    $writeCommand($socket, 'QUIT');
    fclose($socket);
    return true;
}

function sendConfiguredEmail($toEmail, $subject, $body) {
    [$smtpHost, $smtpPort, $smtpUser, $smtpPass, $smtpSecure, $fromEmail] = getSmtpConfig();

    if ($smtpHost !== '' && $smtpUser !== '' && $smtpPass !== '') {
        $sent = sendSmtpMail($smtpHost, $smtpPort, $smtpUser, $smtpPass, $smtpSecure, $fromEmail, $toEmail, $subject, $body);
        if ($sent) {
            return true;
        }
        return false;
    }

    $headers = [
        'From: ' . $fromEmail,
        'Reply-To: ' . $fromEmail,
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8'
    ];

    return mail($toEmail, $subject, $body, implode("\r\n", $headers));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit;
}

$formType = $_POST['form_type'] ?? '';
if (!in_array($formType, $allowedForms, true)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid form type.']);
    exit;
}

$sanitize = function ($value) {
    return trim((string) $value);
};

$fields = [];
foreach ($_POST as $key => $value) {
    if ($key === 'form_type') {
        continue;
    }
    $fields[$key] = $sanitize($value);
}

if (empty($fields)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No form data submitted.']);
    exit;
}

$subject = 'Saarthi Finance form submission: ' . ucfirst(str_replace('-', ' ', $formType));
$bodyLines = [];
$bodyLines[] = 'Form type: ' . $formType;
$bodyLines[] = 'Submitted at: ' . date('Y-m-d H:i:s');
$bodyLines[] = '';

foreach ($fields as $key => $value) {
    $label = ucwords(str_replace(['-', '_'], ' ', $key));
    $bodyLines[] = $label . ': ' . $value;
}

$body = implode("\r\n", $bodyLines);
$mailSent = sendConfiguredEmail($emailTo, $subject, $body);

if (!$mailSent) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Mail delivery failed. Set a valid Gmail app password in SMTP_PASS and reload the site to enable live form email sending.'
    ]);
    exit;
}

echo json_encode(['status' => 'success', 'message' => 'Form submitted successfully.']);
