
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Favicon -->
        <link
            rel="icon"
            href="{{ asset('img/logo/cf-nobg.svg') }}"
            type="image/svg+xml"
        >

        <!-- Title -->
        <title inertia>{{ config('app.name') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link
            href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap"
            rel="stylesheet"
        >

        <!-- Error Diagnostic & Fallback Tracker -->
        <script>
            window.addEventListener('error', function(event) {
                var box = document.getElementById('cf-error-badge');
                if (!box) {
                    box = document.createElement('div');
                    box.id = 'cf-error-badge';
                    box.style = 'position:fixed;bottom:16px;right:16px;background:#991b1b;color:#ffffff;padding:12px 16px;border-radius:12px;z-index:999999;font-family:sans-serif;font-size:13px;max-width:90vw;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);';
                    (document.body || document.documentElement).appendChild(box);
                }
                box.innerHTML = '<strong>[Error Browser]:</strong> ' + (event.message || event.error || 'Gagal memuat skrip') + (event.filename ? '<br><span style="font-size:11px;opacity:0.8;">' + event.filename + ':' + event.lineno + '</span>' : '');
            });
            window.addEventListener('unhandledrejection', function(event) {
                var box = document.getElementById('cf-error-badge');
                if (!box) {
                    box = document.createElement('div');
                    box.id = 'cf-error-badge';
                    box.style = 'position:fixed;bottom:16px;right:16px;background:#991b1b;color:#ffffff;padding:12px 16px;border-radius:12px;z-index:999999;font-family:sans-serif;font-size:13px;max-width:90vw;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);';
                    (document.body || document.documentElement).appendChild(box);
                }
                box.innerHTML = '<strong>[Promise Rejection]:</strong> ' + (event.reason?.message || event.reason || 'Promise error');
            });
        </script>

        <!-- Google Identity Services -->
        <script src="https://accounts.google.com/gsi/client" async defer></script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>

    <body class="font-sans antialiased bg-stone-50">
        @inertia
    </body>
</html>
