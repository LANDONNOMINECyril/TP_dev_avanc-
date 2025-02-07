"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const player_service_1 = require("./player/player.service");
const player_controller_1 = require("./player/player.controller");
const player_entity_1 = require("./player/player.entity");
const ranking_controller_1 = require("./ranking/ranking.controller");
const ranking_service_1 = require("./ranking/ranking.service");
const match_service_1 = require("./match/match.service");
const match_controller_1 = require("./match/match.controller");
const match_entity_1 = require("./match/match.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
const eventemitter2_1 = require("eventemitter2");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            event_emitter_1.EventEmitterModule.forRoot({
                wildcard: false,
                delimiter: '.',
                newListener: false,
                removeListener: false,
                maxListeners: 10,
                verboseMemoryLeak: false,
                ignoreErrors: false,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'db.sqlite',
                entities: [player_entity_1.Player, match_entity_1.Match],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([player_entity_1.Player, match_entity_1.Match]),
        ],
        controllers: [player_controller_1.PlayerController, ranking_controller_1.RankController, match_controller_1.MatchController],
        providers: [{ provide: eventemitter2_1.EventEmitter2, useValue: new eventemitter2_1.EventEmitter2() }, player_service_1.PlayerService, match_service_1.MatchService, ranking_service_1.RankingService],
        exports: [player_service_1.PlayerService, match_service_1.MatchService, ranking_service_1.RankingService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map