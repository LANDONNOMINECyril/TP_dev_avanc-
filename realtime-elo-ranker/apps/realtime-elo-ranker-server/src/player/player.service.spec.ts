import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { EventEmitter2 } from 'eventemitter2';
import { NotFoundException } from '@nestjs/common';
import { RankingService } from '../ranking/ranking.service';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: Repository<Player>;
  let eventEmitter: EventEmitter2;
  let rankingService: RankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
        {
          provide: EventEmitter2,
          useValue: new EventEmitter2(),
        },
        {
          provide: RankingService,
          useValue: {
            notifySubscribers: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    rankingService = module.get<RankingService>(RankingService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('createPlayer', () => {
    it('doit créer un nouveau joueur', async () => {
      const playerData = { id: '1', rank: 1500 };
      jest.spyOn(repository, 'create').mockReturnValue(playerData as Player);
      jest.spyOn(repository, 'save').mockResolvedValue(playerData as Player);

      const result = await service.createPlayer(playerData);

      expect(result).toEqual(playerData);
      expect(rankingService.notifySubscribers).toHaveBeenCalled();
    });

    it('doit renvoyer une erreur si la création d\'un joueur échoue', async () => {
      const playerData = { id: '1', rank: 1500 };
      jest.spyOn(repository, 'create').mockReturnValue(playerData as Player);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Échec de la création du joueur'));

      await expect(service.createPlayer(playerData)).rejects.toThrow('Échec de la création du joueur');
    });
  });

  describe('getRanking', () => {
    it('doit renvoyer le rang des joueurs', async () => {
      const players = [
        { id: '1', rank: 1500 },
        { id: '2', rank: 1400 },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(players as Player[]);

      const result = await service.getRanking();

      expect(result).toEqual(players);
    });
  });

  describe('updateRanking', () => {
    it('doit mettre à jour le rang des joueurs', async () => {
      const player = { id: '1', rank: 1500 };
      jest.spyOn(repository, 'findOne').mockResolvedValue(player as Player);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...player, rank: 1600 } as Player);

      const result = await service.updateRanking('1', 1600);

      expect(result).toEqual({ id: '1', rank: 1600 });
      expect(rankingService.notifySubscribers).toHaveBeenCalled();
    });

    it('renvoie une erreur si le joueur n\'est pas trouvé', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateRanking('1', 1600)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPlayerById', () => {
    it('doit renvoyer un joueur par ID', async () => {
      const player = { id: '1', rank: 1500 };
      jest.spyOn(repository, 'findOne').mockResolvedValue(player as Player);

      const result = await service.getPlayerById('1');

      expect(result).toEqual(player);
    });

    it('renvoie une erreur si le joueur n\'est pas trouvé', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getPlayerById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('onModuleDestroy', () => {
    it('doit supprimer tous les écouteurs d\'événements', () => {
      jest.spyOn(eventEmitter, 'removeAllListeners');

      service.onModuleDestroy();

      expect(eventEmitter.removeAllListeners).toHaveBeenCalled();
    });
  });
});
