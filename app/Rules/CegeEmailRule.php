<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CegeEmailRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $email = strtolower($value);
        if (!str_ends_with($email, '@edu.cegeptr.qc.ca')) {
            $fail('Seules les adresses @edu.cegeptr.qc.ca sont acceptées.');
        }
    }
}