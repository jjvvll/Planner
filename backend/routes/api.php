<?php

use App\Http\Controllers\api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {

    // ── Public ───────────────────────────────────────────────────────────────
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    // ── Protected ────────────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me',               [AuthController::class, 'me']);
        Route::post('/logout',          [AuthController::class, 'logout']);
        Route::patch('/profile',        [AuthController::class, 'updateProfile']);
        Route::patch('/profile/password', [AuthController::class, 'updatePassword']);
    });
});
