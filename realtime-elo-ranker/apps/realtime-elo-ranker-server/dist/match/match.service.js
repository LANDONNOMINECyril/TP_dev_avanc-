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
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const match_entity_1 = require("./match.entity");
const player_service_1 = require("../player/player.service");
const eventemitter2_1 = require("eventemitter2");
let MatchService = class MatchService {
    constructor(matchRepository, playerService, eventEmitter) {
        this.matchRepository = matchRepository;
        this.playerService = playerService;
        this.eventEmitter = eventEmitter;
    }
    async createMatch(matchData) {
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
        const p = (D) => {
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
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        player_service_1.PlayerService,
        eventemitter2_1.EventEmitter2])
], MatchService);
//# sourceMappingURL=match.service.js.map