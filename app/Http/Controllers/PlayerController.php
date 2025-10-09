<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PlayerService;

class PlayerController extends Controller
{
    protected $service;

    public function __construct(PlayerService $service)
    {
        $this->service = $service;
    }

    /**
     * 🔹 Lista todos los jugadores o filtra por nombre/equipo (?search=Lakers)
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $players = $this->service->getAllPlayers($search);

        // Formato compatible con TeamsService (Java)
        return response()->json([
            'data' => $players->map(function ($p) {
                return [
                    'id'           => $p->id,
                    'name'         => $p->name,
                    'email'        => $p->email,
                    'age'          => $p->age,
                    'team'         => $p->team,
                    'position'     => $p->position ?? null,
                    'number'       => $p->number ?? null,
                    'nationality'  => $p->nationality ?? null,
                    'teamName'     => $p->team ?? null,
                ];
            }),
        ]);
    }

    /**
     * 🔹 Muestra un jugador por ID
     */
    public function show($id)
    {
        $player = $this->service->getPlayerById($id);

        if (!$player) {
            return response()->json(['message' => 'Player not found'], 404);
        }

        return response()->json([
            'id'           => $player->id,
            'name'         => $player->name,
            'email'        => $player->email,
            'age'          => $player->age,
            'team'         => $player->team,
            'position'     => $player->position ?? null,
            'number'       => $player->number ?? null,
            'nationality'  => $player->nationality ?? null,
            'teamName'     => $player->team ?? null,
        ]);
    }

    /**
     * 🔹 Crear un nuevo jugador
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string',
            'email'       => 'required|email|unique:players,email',
            'age'         => 'nullable|integer',
            'team'        => 'nullable|string',
            'position'    => 'nullable|string|max:50',
            'number'      => 'nullable|integer|min:0',
            'nationality' => 'nullable|string|max:50',
        ]);

        $player = $this->service->createPlayer($data);
        return response()->json($player, 201);
    }

    /**
     * 🔹 Actualiza un jugador existente
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name'        => 'string|nullable',
            'email'       => 'email|nullable',
            'age'         => 'integer|nullable',
            'team'        => 'string|nullable',
            'position'    => 'nullable|string|max:50',
            'number'      => 'nullable|integer|min:0',
            'nationality' => 'nullable|string|max:50',
        ]);

        $player = $this->service->updatePlayer($id, $data);
        return response()->json($player);
    }

    /**
     * 🔹 Elimina un jugador
     */
    public function destroy($id)
    {
        $this->service->deletePlayer($id);
        return response()->json(['message' => 'Player deleted successfully']);
    }
}
