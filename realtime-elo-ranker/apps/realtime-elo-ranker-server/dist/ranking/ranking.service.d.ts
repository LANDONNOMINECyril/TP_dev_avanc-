import { OnModuleDestroy } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from 'eventemitter2';
export declare class RankingService implements OnModuleDestroy {
    private readonly playerService;
    private readonly eventEmitter;
    constructor(playerService: PlayerService, eventEmitter: EventEmitter2);
    notifySubscribers(): void;
    onModuleDestroy(): void;
}
