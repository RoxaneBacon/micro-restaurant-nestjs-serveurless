import { categories } from './categories.mocks'
import { ingredients } from './ingredients.mocks'
import { allergens } from './allergens.mocks'
import { DishDto } from '../dto'

export const dishes: DishDto[] = [
    {
        _id: '1',
        fullName: 'Salade Caesar',
        shortName: 'Caesar',
        description:
            'Retrouvez notre salade Caesar : Laitue romaine, poulet grillé, croûtons, parmesan, sauce Caesar',
        price: 12,
        category: categories[1],
        allergens: [allergens[0], allergens[2]],
        ingredients: [
            {
                _id: `1_${ingredients[1]._id}`,
                ingredient: ingredients[1],
                quantity: 'base',
            },
            {
                _id: `1_${ingredients[3]._id}`,
                ingredient: ingredients[3],
                quantity: 'base',
            },
            {
                _id: `1_${ingredients[13]._id}`,
                ingredient: ingredients[13],
                quantity: 'base',
            },
            {
                _id: `1_${ingredients[14]._id}`,
                ingredient: ingredients[14],
                quantity: 'base',
            },
            {
                _id: `1_${ingredients[12]._id}`,
                ingredient: ingredients[12],
                quantity: 'base',
            },
        ],
        image: 'https://cdn.pratico-pratiques.com/app/uploads/sites/2/2018/08/29093306/salade-cesar-au-poulet.jpeg',
    },
    {
        _id: '2',
        fullName: 'Spaghetti Bolognese',
        shortName: 'Bolognese',
        description:
            'Pâtes spaghetti servies avec une sauce bolognaise riche en viande, tomates, oignons et herbes.',
        price: 14,
        category: categories[1],
        ingredients: [
            {
                _id: `2_${ingredients[0]._id}`,
                ingredient: ingredients[0],
                quantity: 'base',
            },
            {
                _id: `2_${ingredients[2]._id}`,
                ingredient: ingredients[2],
                quantity: 'base',
            },
            {
                _id: `2_${ingredients[46]._id}`,
                ingredient: ingredients[46],
                quantity: 'base',
            }
        ],
        allergens: [allergens[1], allergens[3]],
        image: 'https://dxm.dam.savencia.com/api/wedia/dam/variation/fix635d9eidk9muu7yq33zuescmdts13b7bw94o/original/download',
    },
    {
        _id: '3',
        fullName: 'Tiramisu',
        shortName: 'Tiramisu',
        description:
            'Un dessert italien classique à base de mascarpone, café et cacao.',
        price: 6,
        category: categories[2],
        ingredients: [
            {
                _id: `3_${ingredients[20]._id}`,
                ingredient: ingredients[20],
                quantity: 'base',
            },
            {
                _id: `3_${ingredients[22]._id}`,
                ingredient: ingredients[22],
                quantity: 'base',
            },
            {
                _id: `3_${ingredients[26]._id}`,
                ingredient: ingredients[26],
                quantity: 'base',
            }
        ],
        allergens: [allergens[0], allergens[1]],
        image: 'https://images.ctfassets.net/1p5r6txvlxu4/1fixE1EZE9rtTHR8h4zjad/19c20cff2edbe3c729c863197147092a/Galbani_Veritable_Tiramisu_opt2.jpg?w=768&h=541&fm=webp&q=100&fit=fill&f=center',
    },
    {
        _id: '4',
        fullName: 'Limonade Maison',
        shortName: 'Limonade',
        description:
            "Limonade fraîchement préparée avec des citrons, de l'eau pétillante et une touche de sucre.",
        price: 3,
        category: categories[2],
        ingredients: [
            {
                _id: `4_${ingredients[26]._id}`,
                ingredient: ingredients[26],
                quantity: 'base',
            },
            {
                _id: `4_${ingredients[24]._id}`,
                ingredient: ingredients[24],
                quantity: 'base',
            },
            {
                _id: `4_${ingredients[25]._id}`,
                ingredient: ingredients[25],
                quantity: 'base',
            }
        ],
        allergens: [allergens[0]],
        image: 'https://media.soscuisine.com/images/recettes/large/2560.jpg',
    },
    {
        _id: '5',
        fullName: 'Wrap Végétarien',
        shortName: 'Wrap Végétarien',
        description:
            'Un wrap frais et savoureux rempli de légumes croquants, de houmous et de feta.',
        price: 9,
        category: categories[0],
        ingredients: [
            {
                _id: `5_${ingredients[0]._id}`,
                ingredient: ingredients[0],
                quantity: 'base',
            },
            {
                _id: `5_${ingredients[1]._id}`,
                ingredient: ingredients[1],
                quantity: 'base',
            },
            {
                _id: `5_${ingredients[5]._id}`,
                ingredient: ingredients[5],
                quantity: 'base',
            },
            {
                _id: `5_${ingredients[6]._id}`,
                ingredient: ingredients[6],
                quantity: 'base',
            },
            {
                _id: `5_${ingredients[7]._id}`,
                ingredient: ingredients[7],
                quantity: 'base',
            },
            {
                _id: `5_${ingredients[12]._id}`,
                ingredient: ingredients[12],
                quantity: 'base',
            },
        ],
        allergens: [allergens[0], allergens[1]],
        image: 'https://www.fleurymichon.fr/sites/default/files/styles/information_card_desktop/public/telechargements/images/galerie/2024-03/31012024-9K2A6704-Modifier.jpg.webp?itok=twsh406i',
    },
    {
        _id: '6',
        fullName: 'Jus de Pomme Frais',
        shortName: 'Jus de Pomme',
        description:
            'Jus de pomme fraîchement pressé, sucré naturellement et rafraîchissant.',
        price: 3,
        category: categories[2],
        ingredients: [
            {
                _id: `6_${ingredients[27]._id}`,
                ingredient: ingredients[27],
                quantity: 'base',
            },
            {
                _id: `6_${ingredients[48]._id}`,
                ingredient: ingredients[48],
                quantity: 'base',
            }
        ],
        allergens: [allergens[0], allergens[1], allergens[2]],
        image: 'https://img.passeportsante.net/1200x675/2021-03-23/i100668-jus-de-pomme.webp',
    },
    {
        _id: '7',
        fullName: 'Café Expresso',
        shortName: 'Café',
        description:
            'Un café expresso riche et aromatique, préparé avec des grains de café de haute qualité.',
        price: 2,
        category: categories[2],
        ingredients: [
            {
                _id: `7_${ingredients[29]._id}`,
                ingredient: ingredients[29],
                quantity: 'base',
            }
        ],
        allergens: [],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC1NVy-IlqOEqf6JKVgVzmcrWPPs0JeVRSsA&s',
    },
    {
        _id: '8',
        fullName: "Serv'Burger",
        shortName: 'Burger',
        description: 'Un burger juteux servi avec des frites croustillantes.',
        price: 11,
        category: categories[1],
        ingredients: [
            {
                _id: `8_${ingredients[0]._id}`,
                ingredient: ingredients[0],
                quantity: 'base',
            },
            {
                _id: `8_${ingredients[1]._id}`,
                ingredient: ingredients[1],
                quantity: 'base',
            },
            {
                _id: `8_${ingredients[2]._id}`,
                ingredient: ingredients[2],
                quantity: 'base',
            },
            {
                _id: `8_${ingredients[3]._id}`,
                ingredient: ingredients[3],
                quantity: 'base',
            },
            {
                _id: `8_${ingredients[4]._id}`,
                ingredient: ingredients[4],
                quantity: 'base',
            },
            {
                _id: `8_${ingredients[5]._id}`,
                ingredient: ingredients[5],
                quantity: 'base',
            },
            {
                _id: `8_${ingredients[6]._id}`,
                ingredient: ingredients[6],
                quantity: 'base',
            },
            {
                _id: `8_${ingredients[46]._id}`,
                ingredient: ingredients[46],
                quantity: 'base',
            },
        ],
        allergens: [allergens[0], allergens[1]],
        image: 'https://www.socopa.fr/wp-content/uploads/2025/03/smash-burger.jpg',
    },
    {
        _id: '9',
        fullName: 'Pates Carbonara',
        shortName: 'Carbonara',
        description:
            'Des pâtes crémeuses avec du bacon, des œufs et du fromage.',
        price: 12,
        category: categories[1],
        ingredients: [
            {
                _id: `9_${ingredients[4]._id}`,
                ingredient: ingredients[4],
                quantity: 'base',
            },
            {
                _id: `9_${ingredients[15]._id}`,
                ingredient: ingredients[15],
                quantity: 'base',
            },
            {
                _id: `9_${ingredients[6]._id}`,
                ingredient: ingredients[6],
                quantity: 'base',
            },
            {
                _id: `9_${ingredients[45]._id}`,
                ingredient: ingredients[45],
                quantity: 'base',
            },
        ],
        allergens: [],
        image: 'https://www.unileverfoodsolutions.ch/dam/global-ufs/mcos/dach/calcmenu-recipes/ch-recipes/2018/elderly/elderly-top-10/spaghetti-carbonara-f%C3%BCr-grossmengen/main-header.jpg',
    },
    {
        _id: '10',
        fullName: 'Mousse au Chocolat',
        shortName: 'Mousse Chocolat',
        description: 'Une mousse légère et aérienne au chocolat noir riche.',
        price: 5,
        category: categories[2],
        ingredients: [
            {
                _id: `10_${ingredients[20]._id}`,
                ingredient: ingredients[20],
                quantity: 'base',
            },
            {
                _id: `10_${ingredients[45]._id}`,
                ingredient: ingredients[45],
                quantity: 'base',
            },
            {
                _id: `10_${ingredients[26]._id}`,
                ingredient: ingredients[26],
                quantity: 'base',
            }
        ],
        allergens: [],
        image: 'https://assets.afcdn.com/recipe/20200304/108812_w1024h1024c1cx960cy540cxt0cyt0cxb1920cyb1080.jpg',
    },
    {
        _id: '11',
        fullName: 'Saumon fumé',
        shortName: 'Saumon fumé',
        description:
            'Tranches de saumon fumé servies avec du pain grillé et du citron.',
        price: 13,
        category: categories[0],
        ingredients: [
            {
                _id: `11_${ingredients[47]._id}`,
                ingredient: ingredients[47],
                quantity: 'base',
            },
            {
                _id: `11_${ingredients[18]._id}`,
                ingredient: ingredients[18],
                quantity: 'base',
            },
            {
                _id: `11_${ingredients[25]._id}`,
                ingredient: ingredients[25],
                quantity: 'base',
            }
        ],
        allergens: [allergens[3]],
        image: 'https://im.qccdn.fr/node/guide-d-achat-saumon-fume-4323/thumbnail_800x480px-121514.jpg',
    },
    {
        _id: '12',
        fullName: 'Guacamole et Chips',
        shortName: 'Guacamole',
        description:
            'Un guacamole crémeux servi avec des chips de tortilla croustillantes.',
        price: 8,
        category: categories[0],
        ingredients: [
            {
                _id: `12_${ingredients[5]._id}`,
                ingredient: ingredients[5],
                quantity: 'base',
            },
            {
                _id: `12_${ingredients[6]._id}`,
                ingredient: ingredients[6],
                quantity: 'base',
            },
            {
                _id: `12_${ingredients[0]._id}`,
                ingredient: ingredients[0],
                quantity: 'base',
            }
        ],
        allergens: [],
        image: 'https://orangerie-du-chateau.fr/wp-content/uploads/2023/08/Recette-de-Guacamole-Decouvrez-comment-preparer-ce-delicieux-plat.jpg',
    },
]
