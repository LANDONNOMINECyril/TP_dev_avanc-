import { Controller, Post, Body } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './player.entity';

@Controller('api/player')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    @Post()
    async createPlayer(@Body() playerData: Partial<Player>): Promise<Player> {
        return await this.playerService.createPlayer(playerData);
    }
}

