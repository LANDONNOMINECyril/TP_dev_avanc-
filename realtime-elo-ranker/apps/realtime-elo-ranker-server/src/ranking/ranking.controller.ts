import { Controller, Get, Sse } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/player.entity';
import { EventEmitter2 } from 'eventemitter2';
import { Observable, Subject } from 'rxjs';

interface RankingUpdateEvent {
    type: string;
    player: {
      id: string;
      rank: number;
    };
  }

@Controller('api/ranking')
export class RankController{
    private readonly rankingUpdates = new Subject<RankingUpdateEvent>();

    constructor(
        private readonly playerService: PlayerService,
        private readonly eventEmitter2: EventEmitter2
    ) {
        this.eventEmitter2.on('ranking.update', (ranking) => {
            for (const playerId in ranking) {
              this.rankingUpdates.next({
                type: 'RankingUpdate',
                player: {
                  id: playerId,
                  rank: ranking[playerId],
                },
              });
            }
          });
    }

    @Get()
    async getPlayers(): Promise<Player[]> {
        return await this.playerService.getRanking();
    }

    @Sse('events')
    subscribeToRankingUpdates(): Observable<MessageEvent> {
        return new Observable((subscriber) => {
          const subscription = this.rankingUpdates.subscribe({
            next: (rankingUpdate) => {
              subscriber.next(new MessageEvent('message', {
                data: JSON.stringify(rankingUpdate),
              }));
            },
            error: (err) => {
              subscriber.error({
                type: 'Error',
                message: err.message,
              });
            },
          });
    
          return () => subscription.unsubscribe();
        });
      }
}
