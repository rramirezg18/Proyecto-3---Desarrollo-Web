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

    public function getAllPlayers()
    {
        return $this->repository->getAll();
    }

    public function getPlayerById($id)
    {
        return $this->repository->getById($id);
    }

    public function createPlayer(array $data)
    {
        return $this->repository->create($data);
    }

    public function updatePlayer($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deletePlayer($id)
    {
        return $this->repository->delete($id);
    }
}
