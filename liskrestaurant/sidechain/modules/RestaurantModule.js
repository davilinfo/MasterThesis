const { BaseModule } = require("lisk-sdk");

const FoodAsset = require("../transactions/FoodAsset");
const MenuAsset = require("../transactions/MenuAsset");
const ProfileAsset = require("../transactions/ProfileAsset");

class RestaurantModule extends BaseModule{
    name = "restaurant";
    id = 1000;
    transactionAssets = [new FoodAsset(), new MenuAsset(), new ProfileAsset()];

    accountSchema = {
        type: "object",
        required: ["foodRequests"],
        properties: {
            foodRequests: {
            type: "array",
            fieldNumber: 4,
            items: {
              dataType: "bytes",
            },
          },
        },
        default: {
            foodRequests: [],
        },
      };

    async beforeTransactionApply({transaction, stateStore, reducerHandler}) { 
        // Code in here is applied before each transaction is applied.
    };
}

module.exports = RestaurantModule;