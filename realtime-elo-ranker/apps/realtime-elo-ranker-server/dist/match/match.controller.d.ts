import { MatchService } from './match.service';
import { Match } from './match.entity';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    createMatch(matchData: Partial<Match>): Promise<Match>;
}
