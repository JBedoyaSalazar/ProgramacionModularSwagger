import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SkillDto {
  @ApiProperty({
    description: 'The name of the skill',
    example: 'JavaScript',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The level of the skill',
    example: 'Advanced',
  })
  @IsString()
  level: string;
}
