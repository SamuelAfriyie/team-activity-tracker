<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        // return array_merge(parent::share($request), [
        //     'auth' => [
        //         'user' => $request->user() ? [
        //             'id' => $request->user()->id,
        //             'name' => $request->user()->name,
        //             'email' => $request->user()->email,
        //             'position' => $request->user()->position,
        //             'department' => $request->user()->department,
        //             'employee_id' => $request->user()->employee_id,
        //         ] : null,
        //     ],
        //     'flash' => [
        //         'message' => fn () => $request->session()->get('message'),
        //         'success' => fn () => $request->session()->get('success'),
        //         'error' => fn () => $request->session()->get('error'),
        //     ],
        // ]);
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'position' => $request->user()->position,
                    'department' => $request->user()->department,
                    'employee_id' => $request->user()->employee_id,
                    'phone' => $request->user()->phone,
                    'is_admin' => $request->user()->isAdmin(),
                    'last_login_at' => $request->user()->last_login_at,
                ] : null,
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}