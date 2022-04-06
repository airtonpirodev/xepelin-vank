import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { InvoiceFiltersDto } from './dto/invoice-filters.dto';
import { ListInvoicesDto } from './dto/list-invoices.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('invoices')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({
    description: 'Lists all invoices',
  })
  @ApiOkResponse({
    type: ListInvoicesDto,
    isArray: true,
  })
  async listInvoices(
    @Query() filters: InvoiceFiltersDto,
  ): Promise<ListInvoicesDto[]> {
    return await this.invoicesService.listInvoices(filters);
  }
}
