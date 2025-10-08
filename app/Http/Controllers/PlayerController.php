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

    public function index()
    {
        return response()->json($this->service->getAllPlayers());
    }

    public function show($id)
    {
        return response()->json($this->service->getPlayerById($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:players,email',
            'age' => 'nullable|integer',
            'team' => 'nullable|string',
        ]);

        $player = $this->service->createPlayer($data);
        return response()->json($player, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'string|nullable',
            'email' => 'email|nullable',
            'age' => 'integer|nullable',
            'team' => 'string|nullable',
        ]);

        $player = $this->service->updatePlayer($id, $data);
        return response()->json($player);
    }

    public function destroy($id)
    {
        $this->service->deletePlayer($id);
        return response()->json(['message' => 'Player deleted successfully']);
    }
}
