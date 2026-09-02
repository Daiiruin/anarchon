import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseProgress } from './entities/case-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaseProgress])],
  exports: [TypeOrmModule],
})
export class ProgressionModule {}
