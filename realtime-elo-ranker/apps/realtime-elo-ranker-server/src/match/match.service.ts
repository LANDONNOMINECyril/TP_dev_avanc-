import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        private readonly playerService: PlayerService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async createMatch(matchData: Partial<Match>): Promise<Match> {
        const match = this.matchRepository.create({
            ...matchData,
        });
    
        const savedMatch = await this.matchRepository.save(match);
        if (!savedMatch) {
            throw new Error('Failed to create match');
        }
    
        const winner = await this.playerService.getPlayerById(savedMatch.winner);
        const loser = await this.playerService.getPlayerById(savedMatch.loser);
    
        const K = 20;
    
        const p = (D: number): number => {
            return 1 / (1 + Math.pow(10, -D / 400));
        };
    
        let coeffWinner = 1;
        let coeffLoser = 0;
    
        if (savedMatch.draw) {
            coeffWinner = 0.5;
            coeffLoser = 0.5;
        }
    
        const winnerRank = Math.ceil(winner.rank + K * (coeffWinner - p(winner.rank - loser.rank)));
        const loserRank = Math.ceil(loser.rank + K * (coeffLoser - p(loser.rank - winner.rank)));
    
        await this.playerService.updateRanking(savedMatch.winner, winnerRank);
        await this.playerService.updateRanking(savedMatch.loser, loserRank);
    
        this.eventEmitter.emit('match.result', { winner, loser, match: savedMatch });
        this.eventEmitter.emit('match.created', savedMatch);
    
        return savedMatch;
    }
    
}
