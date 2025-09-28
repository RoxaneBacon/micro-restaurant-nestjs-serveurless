import { Module } from '@nestjs/common';
import { OrderModule } from './modules/order/order.module';
import { MenuModule } from './modules/menus/menu.module';

@Module({
  imports: [MenuModule, OrderModule],
})
export class BffModule {}
