<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    /**
     * Display the login view.
     */
    public function index(): Response
    {
        return Inertia::render('Auth/Login');
    }


    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'Company email address is required',
            'email.email' => 'Please enter a valid company email address',
            'password.required' => 'Access password is required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator->errors());
        }

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember', false);

        if (Auth::attempt($credentials, $remember)) {
            $user = Auth::user();

            // Check if user account is active
            if (!$user->is_active) {
                Auth::logout();
                return redirect()->back()->withErrors([
                    'email' => 'Account deactivated. Please contact system administrator.',
                ]);
            }

            // Update last login timestamp
            // $user->update(['last_login_at' => now()]);

            $request->session()->regenerate();

            // Log the access
            // \Log::info('User login', [
            //     'user_id' => $user->id,
            //     'email' => $user->email,
            //     'ip' => $request->ip(),
            //     'user_agent' => $request->userAgent()
            // ]);

            return redirect()->intended('/dashboard')->with('success', 'Access granted. Welcome back!');
        }

        return redirect()->back()->withErrors([
            'email' => 'Invalid credentials. Please check your email and password.',
        ]);
    }

    public function logout(Request $request)
    {
        // Log the logout
        if (Auth::check()) {
            // \Log::info('User logout', [
            //     'user_id' => Auth::id(),
            //     'email' => Auth::user()->email
            // ]);
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login')->with('info', 'You have been securely logged out.');
    }
}
