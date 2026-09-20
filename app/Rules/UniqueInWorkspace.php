<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Translation\PotentiallyTranslatedString;

/**
 * Validates uniqueness of a column scoped to the authenticated user's workspace.
 *
 * Eloquent global scopes do not apply to the validation layer, so a plain
 * `unique:` rule would reject a code already used in a *different* workspace
 * and, worse, reveal that the value exists elsewhere. This rule keeps the
 * uniqueness check inside the tenant.
 */
class UniqueInWorkspace implements ValidationRule
{
    public function __construct(
        private string $table,
        private string $column,
        private ?int $ignoreId = null,
    ) {}

    /**
     * @param  Closure(string): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = DB::table($this->table)
            ->where($this->column, $value)
            ->where('workspace_id', Auth::user()?->workspace_id);

        if ($this->ignoreId !== null) {
            $query->where('id', '!=', $this->ignoreId);
        }

        if ($query->exists()) {
            $fail('The :attribute has already been taken.');
        }
    }
}
