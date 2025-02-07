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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("../player/player.service");
const eventemitter2_1 = require("eventemitter2");
let RankingService = class RankingService {
    constructor(playerService, eventEmitter) {
        this.playerService = playerService;
        this.eventEmitter = eventEmitter;
    }
    notifySubscribers() {
        const ranking = this.playerService.getRanking();
        this.eventEmitter.emit('ranking.update', ranking);
    }
    onModuleDestroy() {
        this.eventEmitter.removeAllListeners('ranking.update');
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => player_service_1.PlayerService))),
    __metadata("design:paramtypes", [player_service_1.PlayerService,
        eventemitter2_1.EventEmitter2])
], RankingService);
//# sourceMappingURL=ranking.service.js.map