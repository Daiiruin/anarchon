import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from './entities/case.entity';
import { MediaModule } from '../media/media.module';
import { ProgressionModule } from '../progression/progression.module';
import { CasesService } from './cases.service';
import { CaseContentService } from './case-content.service';
import { CasesController } from './cases.controller';
import { DiscoveriesController } from './discoveries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Case]), MediaModule, ProgressionModule],
  providers: [CasesService, CaseContentService],
  controllers: [CasesController, DiscoveriesController],
  exports: [CasesService, CaseContentService],
})
export class CasesModule {}
