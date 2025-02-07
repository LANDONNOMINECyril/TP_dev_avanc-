import { OnModuleDestroy } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { EventEmitter2 } from 'eventemitter2';
import { RankingService } from 'src/ranking/ranking.service';
export declare class PlayerService implements OnModuleDestroy {
    private readonly playerRepository;
    private readonly eventEmitter;
    private readonly rankingService;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2, rankingService: RankingService);
    createPlayer(playerData: Partial<Player>): Promise<Player>;
    getRanking(): Promise<{
        id: string;
        rank: number;
    }[]>;
    updateRanking(playerId: string, newRank: number): Promise<Player>;
    getPlayerById(playerId: string): Promise<Player>;
    onModuleDestroy(): void;
}
