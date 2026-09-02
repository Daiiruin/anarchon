import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from './entities/case.entity';
import { CaseElement } from './entities/case-element.entity';
import { MediaModule } from '../media/media.module';
import { ProgressionModule } from '../progression/progression.module';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case, CaseElement]),
    MediaModule,
    ProgressionModule,
  ],
  providers: [CasesService],
  controllers: [CasesController],
})
export class CasesModule {}
