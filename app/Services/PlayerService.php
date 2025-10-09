<?php

namespace App\Services;

use App\Repositories\PlayerRepository;

class PlayerService
{
    protected $repository;

    public function __construct(PlayerRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * 🔹 Obtiene todos los jugadores o filtra por nombre/equipo/nacionalidad
     */
    public function getAllPlayers(?string $search = null)
    {
        if ($search) {
            return $this->repository->search($search);
        }
        return $this->repository->getAll();
    }

    /**
     * 🔹 Obtiene un jugador por su ID
     */
    public function getPlayerById($id)
    {
        return $this->repository->getById($id);
    }

    /**
     * 🔹 Crea un nuevo jugador
     */
    public function createPlayer(array $data)
    {
        return $this->repository->create($data);
    }

    /**
     * 🔹 Actualiza un jugador existente
     */
    public function updatePlayer($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    /**
     * 🔹 Elimina un jugador
     */
    public function deletePlayer($id)
    {
        return $this->repository->delete($id);
    }
}
