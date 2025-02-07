import { Controller, Post, Body } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from './match.entity';

@Controller('api/match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Post()
    async createMatch(@Body() matchData: Partial<Match>): Promise<Match> {
        return await this.matchService.createMatch(matchData);
    }
}