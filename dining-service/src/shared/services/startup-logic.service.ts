import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { AddTableDto } from '../../tables/dto/add-table.dto';

export class StartupLogicService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private connection: Connection) {}

  createTable(number: number): AddTableDto {
    const table: AddTableDto = new AddTableDto();
    table.number = number;
    return table;
  }

  async addTable(number: number) {
    const tableModel = this.connection.models['Table'];

    const alreadyExists = await tableModel.find({ number });
    if (alreadyExists.length > 0) {
      throw new Error('Table already exists.');
    }

    return tableModel.create(this.createTable(number));
  }

  async onApplicationBootstrap() {
    for (let i = 1; i < 31; i++) {
      try {
        await this.addTable(i);
      } catch (e) {}
    }
  }
}
