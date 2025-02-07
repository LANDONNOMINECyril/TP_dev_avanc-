import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { Player } from './player.entity';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: {
            createPlayer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPlayer', () => {
    it('doit créer un nouveau joueur', async () => {
      const playerData = { id: '1', rank: 1500 };
      const createdPlayer = { ...playerData, id: '1' } as Player;
      jest.spyOn(service, 'createPlayer').mockResolvedValue(createdPlayer);

      const result = await controller.createPlayer(playerData);

      expect(result).toEqual(createdPlayer);
      expect(service.createPlayer).toHaveBeenCalledWith(playerData);
    });
  });
});
