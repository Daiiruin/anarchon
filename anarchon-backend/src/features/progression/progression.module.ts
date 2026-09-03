import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseProgress } from './entities/case-progress.entity';
import { PlayerDiscovery } from './entities/player-discovery.entity';
import { ProgressionService } from './progression.service';

@Module({
  imports: [TypeOrmModule.forFeature([CaseProgress, PlayerDiscovery])],
  providers: [ProgressionService],
  exports: [TypeOrmModule, ProgressionService],
})
export class ProgressionModule {}
