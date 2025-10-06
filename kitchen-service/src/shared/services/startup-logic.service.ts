import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { Recipe } from '../schemas/recipe.schema';
import { PostEnum } from '../schemas/post-enum.schema';

export class StartupLogicService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private connection: Connection) {}

  createRecipe(
    shortName: string,
    post: PostEnum,
    cookingSteps: string[],
    meanCookingTimeInSec: number,
  ): Recipe {
    const recipe: Recipe = new Recipe();
    recipe.shortName = shortName;
    recipe.post = post;
    recipe.cookingSteps = cookingSteps;
    recipe.meanCookingTimeInSec = meanCookingTimeInSec;
    return recipe;
  }

  async addRecipe(
    shortName: string,
    post: PostEnum,
    cookingSteps: string[],
    meanCookingTimeInSec: number,
  ) {
    const recipeModel = this.connection.models['Recipe'];

    const alreadyExists = await recipeModel.find({ shortName });
    if (alreadyExists.length > 0) {
      throw new Error('Recipe already exists.');
    }

    return recipeModel.create(
      this.createRecipe(shortName, post, cookingSteps, meanCookingTimeInSec),
    );
  }

  async onApplicationBootstrap() {
    /* Starters */
    try {
      await this.addRecipe(
        'Saumon fumé',
        PostEnum.COLD_DISH,
        [
          'Placer le saumon fumé sur une assiette',
          'Ajouter des tranches de citron',
          "Décorer avec de l'aneth",
        ],
        5,
      );
    } catch (e) {}
    try {
      await this.addRecipe(
        'Guacamole',
        PostEnum.COLD_DISH,
        [
          ,
          'Écraser les avocats',
          'Ajouter le jus de citron',
          "Incorporer les tomates, l'oignon et la coriandre",
          'Assaisonner avec du sel et du poivre',
          'Servir avec des chips de tortilla',
        ],
        10,
      );
    } catch (e) {}

    /* Main */
    try {
      await this.addRecipe(
        'Caesar',
        PostEnum.COLD_DISH,
        [
          'Take lettuce',
          'Add caesar sauce',
          'Add chicken',
          'Add bacon',
          'Add parmesan cheese',
          'Mix it all',
        ],
        12,
      );
    } catch (e) {}
    try {
      await this.addRecipe(
        'Bolognese',
        PostEnum.HOT_DISH,
        ['Take spaghetti', 'Add bolognese sauce', 'Mix it all'],
        12,
      );
    } catch (e) {}
    try {
      await this.addRecipe(
        'Wrap Végétarien',
        PostEnum.COLD_DISH,
        [
          'Take a tortilla',
          'Add some hummus',
          'Add sliced vegetables',
          'Wrap it up',
        ],
        10,
      );
    } catch (e) {}
    try {
      await this.addRecipe(
        'Carbonara',
        PostEnum.HOT_DISH,
        ['Take spaghetti', 'Add carbonara sauce', 'Mix it all'],
        12,
      );
    } catch (e) {}
    try {
      await this.addRecipe(
        'Burger',
        PostEnum.HOT_DISH,
        [
          'Take a burger bun',
          'Add lettuce',
          'Add tomato',
          'Add patty',
          'Add cheese',
          'Serve it!',
        ],
        12,
      );
    } catch (e) {}
    /* Desserts */
    try {
      await this.addRecipe(
        'Tiramisu',
        PostEnum.COLD_DISH,
        ['Take a prepared tiramisu'],
        10,
      );
    } catch (e) {}
    try {
      await this.addRecipe(
        'Mousse Chocolat',
        PostEnum.COLD_DISH,
        ['Take a prepared mousse au chocolat'],
        10,
      );
    } catch (e) {}

    /* Beverage */

    try {
      await this.addRecipe('Limonade', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {}
    try {
      await this.addRecipe('Jus de Pomme', PostEnum.BAR, ['Serve it!'], 2);
    } catch (e) {}
    try {
      await this.addRecipe('Café', PostEnum.BAR, ['Brew it', 'Serve it!'], 5);
    } catch (e) {}
  }
}
