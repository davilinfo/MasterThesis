import 
{ BaseModule,
  AfterBlockApplyContext,
  TransactionApplyContext,
  BeforeBlockApplyContext,
  AfterGenesisBlockApplyContext } from "lisk-sdk";

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
      
    public async beforeBlockApply(_input: BeforeBlockApplyContext) {
        // Get any data from stateStore using block info, below is an example getting a generator
        // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
    }

    public async afterBlockApply(_input: AfterBlockApplyContext) {
        // Get any data from stateStore using block info, below is an example getting a generator
        // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
    }

    public async beforeTransactionApply(_input: TransactionApplyContext) {
        // Get any data from stateStore using transaction info, below is an example
        // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
    }

    public async afterTransactionApply(_input: TransactionApplyContext) {
        // Get any data from stateStore using transaction info, below is an example
        // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
    }

    public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
        // Get any data from genesis block, for example get all genesis accounts
        // const genesisAccoounts = genesisBlock.header.asset.accounts;
    }
}

module.exports = { RestaurantModule };