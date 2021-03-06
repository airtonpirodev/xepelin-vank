import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RawInvoicesInterface } from '../common/interfaces/raw-invoices.interface';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { InvoiceEntity } from './invoice.entity';
import { CurrencyEnum } from '../common/enums/currency.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse } from 'csv-parse/sync';
import { Cache } from 'cache-manager';
import axios from 'axios';

@Injectable()
export class InvoicesTask {
  private readonly invoiceCsvUrl: string;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(InvoiceEntity)
    private readonly invoicesRepository: Repository<InvoiceEntity>,
    private readonly configService: ConfigService,
  ) {
    this.invoiceCsvUrl = this.configService.get<string>('INVOICE_CSV_URL');
  }

  @Timeout(1000)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateInvoices(): Promise<void> {
    const rawInvoices = await this.getParsedRawInvoices();
    const mappedInvoices = this.mapInvoices(rawInvoices);
    await this.invoicesRepository.save(mappedInvoices);
    await this.cacheManager.reset();
  }

  private async getParsedRawInvoices(): Promise<RawInvoicesInterface[]> {
    const { data: result } = await axios.get(this.invoiceCsvUrl);

    const rawInvoices = parse(result, {
      trim: true,
      columns: true,
      delimiter: ',',
      skip_empty_lines: true,
    });

    return rawInvoices;
  }

  private mapInvoices(rawInvoices: RawInvoicesInterface[]): InvoiceEntity[] {
    return rawInvoices.map((rawInvoice) => ({
      invoiceId: parseInt(rawInvoice.INVOICE_ID),
      invoiceNumber: rawInvoice.INVOICE_NUMBER,
      invoiceDate: new Date(rawInvoice.INVOICE_DATE),
      vendorId: parseInt(rawInvoice.VENDOR_ID),
      invoiceTotal: parseFloat(rawInvoice.INVOICE_TOTAL),
      paymentTotal: parseFloat(rawInvoice.PAYMENT_TOTAL),
      creditTotal: parseFloat(rawInvoice.CREDIT_TOTAL),
      bankId: parseInt(rawInvoice.BANK_ID),
      invoiceDueDate: new Date(rawInvoice.INVOICE_DUE_DATE),
      paymentDate: rawInvoice.PAYMENT_DATE
        ? new Date(rawInvoice.PAYMENT_DATE)
        : null,
      currency: CurrencyEnum[rawInvoice.CURRENCY],
    }));
  }
}
