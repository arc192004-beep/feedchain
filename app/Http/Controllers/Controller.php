<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * An `exists` rule constrained to the authenticated user's workspace.
     *
     * Laravel's `exists` rule queries the database directly and therefore
     * ignores Eloquent global scopes, so workspace ownership has to be added
     * explicitly here.
     */
    protected function workspaceExists(string $table, string $column = 'id'): Exists
    {
        return Rule::exists($table, $column)->where('workspace_id', auth()->user()?->workspace_id);
    }
}
