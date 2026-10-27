import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { isValidAnswers } from './validate-answers';
import { PersonaService } from './persona.service';

@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post('calculate')
  async calculate(
    @Body() body: { answers: Record<string, 'A' | 'B'> },
  ) {
    if (!isValidAnswers(body?.answers)) {
      throw new BadRequestException('请完整提交 16 道题，每题只能选择 A 或 B');
    }
    const result = await this.personaService.calculate(body.answers);
    return {
      code: 200,
      msg: 'success',
      data: result,
    };
  }
}
