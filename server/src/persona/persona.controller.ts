import { Controller, Post, Body } from '@nestjs/common';
import { PersonaService } from './persona.service';

@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post('calculate')
  async calculate(
    @Body() body: { answers: Record<string, 'A' | 'B'> },
  ) {
    console.log('[PersonaController] POST /api/persona/calculate', JSON.stringify(body.answers));
    const result = await this.personaService.calculate(body.answers);
    return {
      code: 200,
      msg: 'success',
      data: result,
    };
  }
}
