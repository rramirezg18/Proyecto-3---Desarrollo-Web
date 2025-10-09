<?php

namespace App\Repositories;

use App\Models\Player;

class PlayerRepository
{
    /**
     * 🔹 Retorna todos los jugadores (paginado)
     */
    public function getAll()
    {
        return Player::orderByDesc('id')->paginate(10);
    }

    /**
     * 🔹 Busca jugadores por nombre, equipo, correo o nacionalidad
     */
    public function search(string $term)
    {
        return Player::where('name', 'like', "%{$term}%")
            ->orWhere('team', 'like', "%{$term}%")
            ->orWhere('email', 'like', "%{$term}%")
            ->orWhere('nationality', 'like', "%{$term}%")
            ->orderByDesc('id')
            ->paginate(10);
    }

    /**
     * 🔹 Retorna un jugador por su ID
     */
    public function getById($id)
    {
        return Player::findOrFail($id);
    }

    /**
     * 🔹 Crea un nuevo jugador
     */
    public function create(array $data)
    {
        return Player::create($data);
    }

    /**
     * 🔹 Actualiza un jugador existente
     */
    public function update($id, array $data)
    {
        $player = Player::findOrFail($id);
        $player->update($data);
        return $player;
    }

    /**
     * 🔹 Elimina un jugador
     */
    public function delete($id)
    {
        $player = Player::findOrFail($id);
        return $player->delete();
    }
}


