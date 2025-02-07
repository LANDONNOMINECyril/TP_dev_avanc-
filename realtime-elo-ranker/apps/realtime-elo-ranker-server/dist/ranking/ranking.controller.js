"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankController = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("../player/player.service");
const eventemitter2_1 = require("eventemitter2");
const rxjs_1 = require("rxjs");
let RankController = class RankController {
    constructor(playerService, eventEmitter2) {
        this.playerService = playerService;
        this.eventEmitter2 = eventEmitter2;
        this.rankingUpdates = new rxjs_1.Subject();
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
    async getPlayers() {
        return await this.playerService.getRanking();
    }
    subscribeToRankingUpdates() {
        return new rxjs_1.Observable((subscriber) => {
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
};
exports.RankController = RankController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RankController.prototype, "getPlayers", null);
__decorate([
    (0, common_1.Sse)('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], RankController.prototype, "subscribeToRankingUpdates", null);
exports.RankController = RankController = __decorate([
    (0, common_1.Controller)('api/ranking'),
    __metadata("design:paramtypes", [player_service_1.PlayerService,
        eventemitter2_1.EventEmitter2])
], RankController);
//# sourceMappingURL=ranking.controller.js.map