<?php

namespace App\Models\Concerns;

use App\Models\Workspace;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * Scopes a model to the authenticated user's workspace.
 *
 * Every query is constrained to the current workspace, and new records
 * automatically inherit it. Authentication is unchanged: the workspace is
 * derived from the already-authenticated user.
 */
trait BelongsToWorkspace
{
    public static function bootBelongsToWorkspace(): void
    {
        static::addGlobalScope('workspace', function (Builder $builder) {
            $user = Auth::user();

            // Console commands, queue workers and seeders run without a user and
            // must keep full visibility (they have no request context).
            if (! $user) {
                return;
            }

            if ($user->workspace_id === null) {
                // An authenticated account that has no workspace can see nothing.
                $builder->whereRaw('1 = 0');

                return;
            }

            $builder->where(
                $builder->getModel()->getTable().'.workspace_id',
                $user->workspace_id
            );
        });

        static::creating(function (Model $model) {
            if ($model->getAttribute('workspace_id') === null) {
                $model->setAttribute('workspace_id', Auth::user()?->workspace_id);
            }
        });
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function scopeForWorkspace(Builder $query, ?int $workspaceId): Builder
    {
        $column = $query->getModel()->getTable().'.workspace_id';

        return $workspaceId === null
            ? $query->whereNull($column)
            : $query->where($column, $workspaceId);
    }
}
