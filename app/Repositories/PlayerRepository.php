<?php

namespace App\Repositories;

use App\Models\Player;

class PlayerRepository
{
    public function getAll()
    {
        return Player::all();
    }

    public function getById($id)
    {
        return Player::findOrFail($id);
    }

    public function create(array $data)
    {
        return Player::create($data);
    }

    public function update($id, array $data)
    {
        $player = Player::findOrFail($id);
        $player->update($data);
        return $player;
    }

    public function delete($id)
    {
        $player = Player::findOrFail($id);
        $player->delete();
        return true;
    }
}

