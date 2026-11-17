<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google OAuth authorization screen.
     */
    public function redirect(Request $request): RedirectResponse
    {
        $clientId = config('services.google.client_id');
        $redirectUri = config('services.google.redirect_uri');

        if (! $clientId || ! $redirectUri) {
            return redirect()->route('login')->with('error', 'Konfigurasi Google Client ID belum disetel.');
        }

        $state = Str::random(40);
        $request->session()->put('oauth_state', $state);

        $role = $request->query('role', 'visitor');
        $request->session()->put('oauth_role', is_string($role) ? $role : 'visitor');

        $query = http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'state' => $state,
            'prompt' => 'select_account',
        ]);

        return redirect("https://accounts.google.com/o/oauth2/v2/auth?{$query}");
    }

    /**
     * Handle the OAuth callback from Google.
     */
    public function callback(Request $request): RedirectResponse
    {
        if ($request->has('error')) {
            return redirect()->route('login')->with('error', 'Login Google dibatalkan: '.$request->query('error_description', $request->query('error')));
        }

        $sessionState = $request->session()->pull('oauth_state');
        $state = $request->query('state');

        if (! $sessionState || ! hash_equals($sessionState, (string) $state)) {
            return redirect()->route('login')->with('error', 'Sesi login tidak valid (CSRF / invalid state). Silakan coba lagi.');
        }

        $code = $request->query('code');
        if (! $code) {
            return redirect()->route('login')->with('error', 'Kode otentikasi Google tidak ditemukan.');
        }

        $tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'code' => $code,
            'grant_type' => 'authorization_code',
            'redirect_uri' => config('services.google.redirect_uri'),
        ]);

        if ($tokenResponse->failed()) {
            return redirect()->route('login')->with('error', 'Gagal memperoleh token dari Google: '.$tokenResponse->json('error_description', 'Token request failed'));
        }

        $accessToken = $tokenResponse->json('access_token');
        if (! $accessToken) {
            return redirect()->route('login')->with('error', 'Akses token Google tidak valid.');
        }

        $userInfoResponse = Http::withToken($accessToken)->get('https://www.googleapis.com/oauth2/v3/userinfo');
        if ($userInfoResponse->failed()) {
            return redirect()->route('login')->with('error', 'Gagal mengambil profil akun Google.');
        }

        $googleUser = $userInfoResponse->json();
        $googleId = (string) ($googleUser['sub'] ?? '');
        $email = (string) ($googleUser['email'] ?? '');
        $name = (string) ($googleUser['name'] ?? ($email ? explode('@', $email)[0] : 'Pengguna'));
        $avatar = $googleUser['picture'] ?? null;

        if (! $email) {
            return redirect()->route('login')->with('error', 'Email tidak ditemukan dari respon Google.');
        }

        $requestedRole = $request->session()->pull('oauth_role', 'visitor');
        $allowedRoles = ['visitor', 'owner', 'admin', 'cashier'];
        if (! in_array($requestedRole, $allowedRoles, true)) {
            $requestedRole = 'visitor';
        }

        $user = User::where('google_id', $googleId)->first();

        if (! $user) {
            $user = User::where('email', $email)->first();
        }

        if ($user) {
            $user->update([
                'google_id' => $user->google_id ?: $googleId,
                'avatar' => $avatar ?: $user->avatar,
                'email_verified_at' => $user->email_verified_at ?: now(),
            ]);
        } else {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'avatar' => $avatar,
                'email_verified_at' => now(),
                'role' => $requestedRole,
                'password' => null,
            ]);
        }

        Auth::login($user, remember: true);

        $request->session()->regenerate();

        $role = $user->role ?? 'visitor';

        return redirect()->intended(route('dashboard.role', ['role' => $role], absolute: false));
    }

    /**
     * Verify Google ID token (useful for mobile app or client-side GIS token verification).
     */
    public function verifyToken(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_token' => ['required', 'string'],
            'role' => ['nullable', 'string', 'in:visitor,owner,admin,cashier'],
        ]);

        $idToken = $validated['id_token'];

        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $idToken,
        ]);

        if ($response->failed()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token Google tidak valid atau sudah kadaluarsa.',
            ], 422);
        }

        $googleData = $response->json();
        $googleId = (string) ($googleData['sub'] ?? '');
        $email = (string) ($googleData['email'] ?? '');
        $name = (string) ($googleData['name'] ?? ($email ? explode('@', $email)[0] : 'Pengguna'));
        $avatar = $googleData['picture'] ?? null;

        if (! $email) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data email tidak ditemukan di dalam token.',
            ], 422);
        }

        $requestedRole = $validated['role'] ?? 'visitor';

        $user = User::where('google_id', $googleId)->first();

        if (! $user) {
            $user = User::where('email', $email)->first();
        }

        if ($user) {
            $user->update([
                'google_id' => $user->google_id ?: $googleId,
                'avatar' => $avatar ?: $user->avatar,
                'email_verified_at' => $user->email_verified_at ?: now(),
            ]);
        } else {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'avatar' => $avatar,
                'email_verified_at' => now(),
                'role' => $requestedRole,
                'password' => null,
            ]);
        }

        Auth::login($user, remember: true);

        $request->session()->regenerate();

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
            ],
            'redirect' => route('dashboard.role', ['role' => $user->role ?? 'visitor'], absolute: false),
        ]);
    }
}
