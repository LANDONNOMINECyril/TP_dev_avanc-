import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchService } from './match.service';
import { Match } from './match.entity';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from 'eventemitter2';
import { Player } from '../player/player.entity';

describe('MatchService', () => {
  let service: MatchService;
  let matchRepository: Repository<Match>;
  let playerService: PlayerService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: getRepositoryToken(Match),
          useClass: Repository,
        },
        {
          provide: PlayerService,
          useValue: {
            getPlayerById: jest.fn(),
            updateRanking: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: new EventEmitter2(),
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
    playerService = module.get<PlayerService>(PlayerService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('createMatch', () => {
    it('doit créer un nouveau match et mettre à jour le rang des joueurs', async () => {
      const matchData = { winner: '1', loser: '2', draw: false };
      const savedMatch = { id: 1, ...matchData } as Match;
      const winner = { id: '1', rank: 1500 } as Player;
      const loser = { id: '2', rank: 1400 } as Player;

      jest.spyOn(matchRepository, 'create').mockReturnValue(matchData as Match);
      jest.spyOn(matchRepository, 'save').mockResolvedValue(savedMatch);
      jest.spyOn(playerService, 'getPlayerById').mockResolvedValueOnce(winner).mockResolvedValueOnce(loser);
      jest.spyOn(playerService, 'updateRanking').mockResolvedValueOnce(winner).mockResolvedValueOnce(loser);
      jest.spyOn(eventEmitter, 'emit');

      const result = await service.createMatch(matchData);

      expect(result).toEqual(savedMatch);
      expect(playerService.getPlayerById).toHaveBeenCalledWith('1');
      expect(playerService.getPlayerById).toHaveBeenCalledWith('2');
      expect(playerService.updateRanking).toHaveBeenCalledWith('1', expect.any(Number));
      expect(playerService.updateRanking).toHaveBeenCalledWith('2', expect.any(Number));
      expect(eventEmitter.emit).toHaveBeenCalledWith('match.result', { winner, loser, match: savedMatch });
      expect(eventEmitter.emit).toHaveBeenCalledWith('match.created', savedMatch);
    });

    it('doit renvoyer une erreur si la création du match échoue', async () => {
      const matchData = { winner: '1', loser: '2', draw: false };

      jest.spyOn(matchRepository, 'create').mockReturnValue(matchData as Match);
      jest.spyOn(matchRepository, 'save').mockRejectedValue(new Error('Pas réussi à créer un match'));

      await expect(service.createMatch(matchData)).rejects.toThrow('Pas réussi à créer un match');
    });

    it('devrait gérer les matchs dont le résultat est une égalité correctement', async () => {
      const matchData = { winner: '1', loser: '2', draw: true };
      const savedMatch = { id: 1, ...matchData } as Match;
      const winner = { id: '1', rank: 1500 } as Player;
      const loser = { id: '2', rank: 1400 } as Player;

      jest.spyOn(matchRepository, 'create').mockReturnValue(matchData as Match);
      jest.spyOn(matchRepository, 'save').mockResolvedValue(savedMatch);
      jest.spyOn(playerService, 'getPlayerById').mockResolvedValueOnce(winner).mockResolvedValueOnce(loser);
      jest.spyOn(playerService, 'updateRanking').mockResolvedValueOnce(winner).mockResolvedValueOnce(loser);
      jest.spyOn(eventEmitter, 'emit');

      const result = await service.createMatch(matchData);

      expect(result).toEqual(savedMatch);
      expect(playerService.getPlayerById).toHaveBeenCalledWith('1');
      expect(playerService.getPlayerById).toHaveBeenCalledWith('2');
      expect(playerService.updateRanking).toHaveBeenCalledWith('1', expect.any(Number));
      expect(playerService.updateRanking).toHaveBeenCalledWith('2', expect.any(Number));
      expect(eventEmitter.emit).toHaveBeenCalledWith('match.created', savedMatch);
    });
  });
});
