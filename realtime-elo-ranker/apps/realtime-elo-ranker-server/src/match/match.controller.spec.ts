import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Match } from './match.entity';

describe('MatchController', () => {
  let controller: MatchController;
  let service: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: {
            createMatch: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    service = module.get<MatchService>(MatchService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('createMatch', () => {
    it('doit créer un nouveau match', async () => {
      const matchData = { winner: '1', loser: '2', draw: false };
      const createdMatch = { id: 1, ...matchData } as Match;
      jest.spyOn(service, 'createMatch').mockResolvedValue(createdMatch);

      const result = await controller.createMatch(matchData);

      expect(result).toEqual(createdMatch);
      expect(service.createMatch).toHaveBeenCalledWith(matchData);
    });

    it('doit renvoyer une erreur si la création des matchs échouent', async () => {
      const matchData = { winner: '1', loser: '2', draw: false };
      jest.spyOn(service, 'createMatch').mockRejectedValue(new Error('Pas réussi à créer un match'));

      await expect(controller.createMatch(matchData)).rejects.toThrow('Pas réussi à créer un match');
      expect(service.createMatch).toHaveBeenCalledWith(matchData);
    });
  });
});
