import { Test, TestingModule } from '@nestjs/testing';
import { RankController } from './ranking.controller';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from 'eventemitter2';
import { Player } from '../player/player.entity';

describe('RankController', () => {
  let controller: RankController;
  let service: PlayerService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankController],
      providers: [
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

    controller = module.get<RankController>(RankController);
    service = module.get<PlayerService>(PlayerService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('getPlayers', () => {
    it('doit renvoyer le rang des joueurs', async () => {
      const players = [
        { id: '1', rank: 1500 },
        { id: '2', rank: 1400 },
      ] as Player[];
      jest.spyOn(service, 'getRanking').mockResolvedValue(players);

      const result = await controller.getPlayers();

      expect(result).toEqual(players);
      expect(service.getRanking).toHaveBeenCalled();
    });
  });

  describe('subscribeToRankingUpdates', () => {
    it('devrait créer des événements lorsque des joueurs sont créés ou mis à jour', (done) => {
      const rankingUpdate = { type: 'RankingUpdate', player: { id: '1', rank: 1500 } };
      const observable = controller.subscribeToRankingUpdates();

      const nextSpy = jest.fn();
      const subscription = observable.subscribe({
        next: nextSpy,
        complete: () => {
          expect(nextSpy).toHaveBeenCalledTimes(1);
          expect(nextSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'message',
              data: JSON.stringify(rankingUpdate),
            })
          );
          done();
        },
      });

      eventEmitter.emit('ranking.update', { '1': 1500 });

      subscription.unsubscribe();
    });

    it('devrait supprimer les écouteurs lors de la désinscription', (done) => {
      const rankingUpdate = { type: 'RankingUpdate', player: { id: '1', rank: 1500 } };
      const observable = controller.subscribeToRankingUpdates();

      const nextSpy = jest.fn();
      const subscription = observable.subscribe({
        next: nextSpy,
        complete: () => {
          expect(nextSpy).toHaveBeenCalledTimes(1);
          done();
        },
      });

      eventEmitter.emit('ranking.update', { '1': 1500 });

      setTimeout(() => {
        subscription.unsubscribe();
        eventEmitter.emit('ranking.update', { '1': 1500 });

        expect(nextSpy).toHaveBeenCalledTimes(1);
      }, 100);
    });
  });
});
