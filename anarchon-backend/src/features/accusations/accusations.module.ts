import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accusation } from './entities/accusation.entity';
import { CasesModule } from '../cases/cases.module';
import { ProgressionModule } from '../progression/progression.module';
import { AccusationsService } from './accusations.service';
import { AccusationsController } from './accusations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accusation]),
    CasesModule,
    ProgressionModule,
  ],
  providers: [AccusationsService],
  controllers: [AccusationsController],
})
export class AccusationsModule {}
