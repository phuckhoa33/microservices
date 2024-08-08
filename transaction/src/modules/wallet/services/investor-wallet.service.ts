import {DatabaseModel} from "../../../common/database/decorators/database.decorator";
import {WalletEntity} from "../entities/wallet.entity";
import {Model} from "mongoose";
import {NotFoundException} from "@nestjs/common";
import {ViewWalletFromUserViewResponseDto} from "../dtos/view-wallet-from-user-view.response.dto";
import {InjectMapper} from "@automapper/nestjs";
import {Mapper} from "@automapper/core";
import { InvestorEntity } from "src/shared/entities/investor.entity";

export class InvestorWalletService {
    constructor(
        @DatabaseModel(WalletEntity.name) private readonly walletModel: Model<WalletEntity>,
        @DatabaseModel(InvestorEntity.name) private readonly investorModel: Model<InvestorEntity>,
        @InjectMapper() private readonly mapper: Mapper,
    ) {
    }

    /**
     * Get wallet by user id
     * @param {String} userId
     * @param {String} walletId
     * @return {ViewWalletFromUserViewResponseDto}
     * */
    async getWalletByUserId(userId: string, walletId: string): Promise<ViewWalletFromUserViewResponseDto> {
        // Check user
        const user = await this.investorModel.findOne({_id: userId, walletId}).exec();
        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // Check wallet is existed
        const wallet = await this.walletModel.findById(user.walletId).exec();
        if (!wallet) {
            throw new NotFoundException('WALLET_NOT_FOUND');
        }
        return this.mapper.map(wallet, WalletEntity, ViewWalletFromUserViewResponseDto);
    }
}