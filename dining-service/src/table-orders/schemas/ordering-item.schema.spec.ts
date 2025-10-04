import { OrderingItem } from './ordering-item.schema';

describe('OrderingItem', () => {
  it('build the right ordering item from any object', () => {
    const emptyObject = {};
    const emptyOrderingItem: OrderingItem = {
      _id: null,
      shortName: null,
      quantity: 'base',
    };

    expect(new OrderingItem()).toEqual(emptyOrderingItem);
    expect(new OrderingItem(emptyObject)).toEqual(emptyOrderingItem);

    const anObject = {
      _id: 'item id',
      shortName: 'item shortName',
      quantity: 'base',
      anotherProp: 'anotherValue',
    };
    const anObjectOrderingItem: OrderingItem = {
      _id: 'item id',
      shortName: 'item shortName',
      quantity: 'base',
    };
    expect(new OrderingItem(anObject)).toEqual(anObjectOrderingItem);
  });
});
