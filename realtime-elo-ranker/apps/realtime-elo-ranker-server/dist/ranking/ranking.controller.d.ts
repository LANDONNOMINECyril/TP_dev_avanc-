import { PlayerService } from '../player/player.service';
import { Player } from '../player/player.entity';
import { EventEmitter2 } from 'eventemitter2';
import { Observable } from 'rxjs';
export declare class RankController {
    private readonly playerService;
    private readonly eventEmitter2;
    private readonly rankingUpdates;
    constructor(playerService: PlayerService, eventEmitter2: EventEmitter2);
    getPlayers(): Promise<Player[]>;
    subscribeToRankingUpdates(): Observable<MessageEvent>;
}
