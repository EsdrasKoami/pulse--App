<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileSetupController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/suspended', function (Illuminate\Http\Request $request) {
    return Inertia::render('Auth/Suspended', [
        'reason' => $request->query('reason')
    ]);
})->name('suspended');

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'banned'])
    ->name('dashboard');

Route::post('/language', [\App\Http\Controllers\LanguageController::class, 'store'])->name('language.store');

Route::middleware(['auth', 'banned'])->group(function () {
    // Profile setup wizard (after registration)
    Route::get('/profile/setup', [ProfileSetupController::class, 'show'])->name('profile.setup');
    Route::post('/profile/setup', [ProfileSetupController::class, 'store'])->name('profile.setup.store');

    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/bio', [ProfileController::class, 'editBio'])->name('profile.bio');
    Route::get('/profile/security', [ProfileController::class, 'editSecurity'])->name('profile.security');
    Route::get('/profile/danger', [ProfileController::class, 'editDanger'])->name('profile.danger');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Contact Requests
    Route::get('/connections', [\App\Http\Controllers\ContactRequestController::class, 'index'])->name('connections.index');
    Route::post('/contact-requests', [\App\Http\Controllers\ContactRequestController::class, 'store'])->name('contact-requests.store');
    Route::patch('/contact-requests/{contactRequest}', [\App\Http\Controllers\ContactRequestController::class, 'update'])->name('contact-requests.update');

    // Messages
    Route::get('/messages/{user?}', [\App\Http\Controllers\MessageController::class, 'index'])->name('messages.index');
    Route::post('/messages/{user}', [\App\Http\Controllers\MessageController::class, 'store'])->name('messages.store');

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');

    // Stories
    Route::post('/stories', [\App\Http\Controllers\StoryController::class, 'store'])->name('stories.store');
    Route::delete('/stories/{story}', [\App\Http\Controllers\StoryController::class, 'destroy'])->name('stories.destroy');
    Route::post('/stories/{story}/like', [\App\Http\Controllers\StoryController::class, 'toggleLike'])->name('stories.like');

    // Interest Groups
    Route::get('/groups', [\App\Http\Controllers\GroupController::class, 'index'])->name('groups.index');
    Route::get('/groups/create', [\App\Http\Controllers\GroupController::class, 'create'])->name('groups.create');
    Route::post('/groups', [\App\Http\Controllers\GroupController::class, 'store'])->name('groups.store');
    Route::get('/groups/{category}', [\App\Http\Controllers\GroupController::class, 'show'])->name('groups.show');
    Route::patch('/groups/{id}', [\App\Http\Controllers\GroupController::class, 'update'])->name('groups.update');
    Route::delete('/groups/{id}', [\App\Http\Controllers\GroupController::class, 'destroy'])->name('groups.destroy');
    Route::post('/groups/{id}/messages', [\App\Http\Controllers\GroupController::class, 'storeMessage'])->name('groups.messages.store');

    // Social Posts
    Route::post('/posts', [\App\Http\Controllers\PostController::class, 'store'])->name('posts.store');
    Route::post('/posts/{post}/comments', [\App\Http\Controllers\PostController::class, 'storeComment'])->name('posts.comments.store');
    Route::post('/posts/{post}/like', [\App\Http\Controllers\PostController::class, 'toggleLike'])->name('posts.like');

    // Events
    Route::get('/events', [\App\Http\Controllers\EventController::class, 'index'])->name('events.index');
    Route::post('/events', [\App\Http\Controllers\EventController::class, 'store'])->name('events.store');
    Route::post('/events/{event}/join', [\App\Http\Controllers\EventController::class, 'join'])->name('events.join');
    Route::post('/events/{event}/invite/{user}', [\App\Http\Controllers\EventController::class, 'invite'])->name('events.invite');
    Route::delete('/events/{event}', [\App\Http\Controllers\EventController::class, 'destroy'])->name('events.destroy');

    // Moderation
    Route::post('/users/{user}/block', [\App\Http\Controllers\ModerationController::class, 'block'])->name('users.block');
    Route::post('/users/{user}/unblock', [\App\Http\Controllers\ModerationController::class, 'unblock'])->name('users.unblock');
    Route::post('/report', [\App\Http\Controllers\ModerationController::class, 'report'])->name('report.store');

    // Public Profiles
    Route::get('/users/{user}', [ProfileController::class, 'showUser'])->name('users.show');
});

Route::middleware(['auth', 'admin', 'banned'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [\App\Http\Controllers\Admin\UserController::class, 'create'])->name('users.create');
    Route::post('/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [\App\Http\Controllers\Admin\UserController::class, 'edit'])->name('users.edit');
    Route::patch('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/toggle-ban', [\App\Http\Controllers\Admin\UserController::class, 'toggleBan'])->name('users.toggle-ban');

    Route::get('/interests', [\App\Http\Controllers\Admin\InterestController::class, 'index'])->name('interests.index');
    Route::post('/interests', [\App\Http\Controllers\Admin\InterestController::class, 'store'])->name('interests.store');
    Route::patch('/interests/{interest}', [\App\Http\Controllers\Admin\InterestController::class, 'update'])->name('interests.update');
    Route::delete('/interests/{interest}', [\App\Http\Controllers\Admin\InterestController::class, 'destroy'])->name('interests.destroy');
});

require __DIR__ . '/auth.php';