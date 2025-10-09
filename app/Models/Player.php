<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'age',
        'team',
        'position',
        'number',
        'nationality',
    ];

    protected $casts = [
        'age' => 'integer',
        'number' => 'integer',
    ];
}
