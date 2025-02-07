import { Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { EventEmitter2 } from 'eventemitter2';
import { RankingService } from 'src/ranking/ranking.service';

@Injectable()
export class PlayerService implements OnModuleDestroy {
    constructor(
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
        private readonly eventEmitter: EventEmitter2,
        private readonly rankingService: RankingService,
    ) {}

    async createPlayer(playerData: Partial<Player>): Promise<Player> {
        const player = this.playerRepository.create(playerData);
        const savedPlayer = await this.playerRepository.save(player);
        if (!savedPlayer) {
            throw new Error('Failed to create player');
        }

        this.rankingService.notifySubscribers();
        return player;
    }

    async getRanking(): Promise<{ id: string; rank: number }[]> {
        return await this.playerRepository.find({
            select: ['id', 'rank'],
            order: { rank: 'DESC' },
        });
    }

    async updateRanking(playerId: string, newRank: number): Promise<Player> {
        const player = await this.playerRepository.findOne({ where: { id: playerId } });
        if (!player) {
            throw new NotFoundException('Player not found');
        }

        player.rank = newRank;
        const updatedPlayer = await this.playerRepository.save(player);

        this.rankingService.notifySubscribers();
        return updatedPlayer;
    }

    async getPlayerById(playerId: string): Promise<Player> {
        const player = await this.playerRepository.findOne({ where: { id: playerId } });
        if (!player) {
            throw new NotFoundException('Player not found');
        }
        return player;
    }

    onModuleDestroy() {
        this.eventEmitter.removeAllListeners();
    }
}
