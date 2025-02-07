import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from 'eventemitter2';
export declare class MatchService {
    private readonly matchRepository;
    private readonly playerService;
    private readonly eventEmitter;
    constructor(matchRepository: Repository<Match>, playerService: PlayerService, eventEmitter: EventEmitter2);
    createMatch(matchData: Partial<Match>): Promise<Match>;
}
