import { Injectable, Inject, forwardRef, OnModuleDestroy } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class RankingService implements OnModuleDestroy {
    constructor(
        @Inject(forwardRef(() => PlayerService))
        private readonly playerService: PlayerService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    public notifySubscribers(): void {
        const ranking = this.playerService.getRanking();
        this.eventEmitter.emit('ranking.update', ranking);
    }

    onModuleDestroy() {
        this.eventEmitter.removeAllListeners('ranking.update');
    }
}