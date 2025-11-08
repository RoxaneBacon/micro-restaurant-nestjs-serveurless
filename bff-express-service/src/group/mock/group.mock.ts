import { GroupOrderDto } from "../dto/group-order.dto";

export const MOCK_GROUP_LIST: GroupOrderDto[] = [
  {
    _id: '123456',
    mongodbIdTable: '',
    tableNumber: 10,
    expectedCustomers: 4,
    actualCustomers: 0,
    menuUnitPrice: 25,
    menu: {
      dishShortNameList: ['Wrap Végétarien', 'Saumon fumé', 'Caesar', 'Carbonara', 'Tiramisu', 'Limonade', 'Café'],
    },
    status: 'READY',
  },
  {
    _id: '654321',
    mongodbIdTable: '',
    tableNumber: 11,
    expectedCustomers: 2,
    actualCustomers: 0,
    menuUnitPrice: 30,
    menu: {
      dishShortNameList: ['Guacamole', 'Saumon fumé', 'Burger', 'Bolognese', 'Mousse Chocolat', 'Limonade', 'Jus de Pomme'],
    },
    status: 'IN_PROGRESS',
  },
];