<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlayerController;

Route::get('/ping', function () {
    return response()->json(['message' => 'Players Service API is running 🚀']);
});

Route::apiResource('players', PlayerController::class);
