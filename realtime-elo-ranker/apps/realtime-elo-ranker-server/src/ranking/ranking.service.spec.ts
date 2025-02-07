import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from 'eventemitter2';

describe('RankingService', () => {
  let service: RankingService;
  let playerService: PlayerService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        {
          provide: PlayerService,
          useValue: {
            getRanking: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: new EventEmitter2(),
        },
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
    playerService = module.get<PlayerService>(PlayerService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('notifySubscribers', () => {
    it('devrait émettre un événement de mise à jour du classement', () => {
      const ranking = {
        '1': 1500,
        '2': 1400,
      };
      jest.spyOn(playerService, 'getRanking').mockResolvedValue([
        { id: '1', rank: 1500 },
        { id: '2', rank: 1400 },
      ]);
      const emitSpy = jest.spyOn(eventEmitter, 'emit');

      service.notifySubscribers();

      expect(emitSpy).toHaveBeenCalledWith('ranking.update', ranking);
    });
  });

  describe('onModuleDestroy', () => {
    it('devrait supprimer tous les écouteurs d\'événements', () => {
      const removeAllListenersSpy = jest.spyOn(eventEmitter, 'removeAllListeners');

      service.onModuleDestroy();

      expect(removeAllListenersSpy).toHaveBeenCalledWith('ranking.update');
    });
  });
});
