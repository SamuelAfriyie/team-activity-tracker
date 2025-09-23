<?php

namespace App\Http\Controllers;

use Inertia\Inertia;


class ActivitiesController extends Controller
{
    public function index()
    {
        return Inertia::render('Activities/Index');
    }

    public function create()
    {
        return Inertia::render('Activities/Create');
    }

    public function show()
    {
        return Inertia::render('Activities/Show');
    }
}
