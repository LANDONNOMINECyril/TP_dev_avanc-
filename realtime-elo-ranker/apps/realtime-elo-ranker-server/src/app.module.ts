import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from './player/player.service';
import { PlayerController } from './player/player.controller';
import { Player } from './player/player.entity';
import { RankController } from './ranking/ranking.controller';
import { RankingService } from './ranking/ranking.service';
import { MatchService } from './match/match.service';
import { MatchController } from './match/match.controller';
import { Match } from './match/match.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitter2 } from 'eventemitter2';


@Module({
    imports: [
        EventEmitterModule.forRoot({
            wildcard: false,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 10,
            verboseMemoryLeak: false,
            ignoreErrors: false,
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            entities: [Player, Match],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Player, Match]),
    ],
    controllers: [PlayerController, RankController, MatchController],
    providers: [{provide: EventEmitter2, useValue: new EventEmitter2()},PlayerService, MatchService, RankingService],
    exports: [PlayerService, MatchService, RankingService],
})

export class AppModule {}