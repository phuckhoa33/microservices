import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {DatabaseModel} from "../../../common/database/decorators/database.decorator";
import {TransactionEntity} from "../entities/transaction.entity";
import {Model} from "mongoose";
import {TransactionStatusEnum} from "../constants/transaction-status.enum.constant";
import {TransactionTypeEnum} from "../constants/transaction-type.enum.constant";
import {InvestorEntity} from "../../user/entities/investor.entity";
import {WalletEntity} from "../../wallet/entities/wallet.entity";
import {DepositTransactionRequestDto} from "../dtos/deposit-transaction.request.dto";
import {WithdrawTransactionRequestDto} from "../dtos/withdraw-transaction.request.dto";
import {GetAllTransactionsRequestDto} from "../dtos/get-all-transactions.request.dto";
import {PageDto} from "../../../common/pagination/dtos/page.dto";
import {ViewTransactionFromUserViewResponseDto} from "../dtos/view-transaction-from-user-view.response.dto";
import {PaginationService} from "../../../common/pagination/services/pagination.service";
import {InjectMapper} from "@automapper/nestjs";
import {Mapper} from "@automapper/core";
import {ViewBuyTransactionFromUserViewResponseDto} from "../dtos/view-buy-transaction-from-user-view.response.dto";
import {BuyTransactionRequestDto} from "../dtos/buy-transaction.request.dto";
import {DepositTransactionResponseDto} from "../dtos/deposit-transaction.response.dto";
import {WithdrawTransactionResponseDto} from "../dtos/withdraw-transaction.response.dto";

@Injectable()
export class InvestorTransactionService {
    constructor(
        @DatabaseModel(TransactionEntity.name) private readonly transactionModel: Model<TransactionEntity>,
        @DatabaseModel(WalletEntity.name) private readonly walletModel: Model<WalletEntity>,
        @DatabaseModel(InvestorEntity.name) private readonly investorModel: Model<InvestorEntity>,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly paginationService: PaginationService,
    ) {
    }

    /**
     * Deposit money to investor account
     * @param {String} userId
     * @param {DepositTransactionRequestDto} dto
     * @return {Promise<DepositTransactionResponseDto>}
     * */
    async depositMoney(userId: string, dto: DepositTransactionRequestDto): Promise<DepositTransactionResponseDto> {
        // Check investor account
        const investor = await this.investorModel.findById(userId).exec();
        if (!investor) {
            throw new NotFoundException('INVESTOR_NOT_FOUND');
        }

        // Create transaction
        const newTransaction = await this.transactionModel.create({
            userId,
            amount: dto.amount,
            transactionType: TransactionTypeEnum.DEPOSIT,
            fromSource: dto.fromSource,
            toDestination: dto.toDestination,
            status: TransactionStatusEnum.PENDING,
            transactionDate: new Date(),
            transactionDescription: dto.transactionDescription,
            transactionMethod: dto.transactionMethod,
            currency: dto.currency,
            transactionFee: dto.transactionFee,
        });
        
        // return 
        return {transactionId: newTransaction._id}
    }
    
    /**
     * Buy NFTs
     * @param {String} userId
     * @param {BuyTransactionRequestDto} dto
     * */
    async buyNFT(userId: string, dto: BuyTransactionRequestDto) {
        // Check investor account
        const investor = await this.investorModel.findById(userId).exec();
        if (!investor) {
            throw new NotFoundException('INVESTOR_NOT_FOUND');
        }
        

        // Create transaction
        await this.transactionModel.create({
            userId,
            amount: dto.amount,
            transactionType: TransactionTypeEnum.BUY,
            fromSource: userId,
            toDestination: dto.toDestination,
            status: TransactionStatusEnum.PENDING,
            transactionDate: new Date(),
            transactionDescription: dto.transactionDescription,
            transactionMethod: dto.transactionMethod,
            currency: dto.currency,
            transactionFee: dto.transactionFee,
        });
    }

    /**
     * Banking transaction confirm success
     * @param {String} userId
     * @param {String} transactionId
     * */
    async confirmDepositTransaction(userId: string, transactionId: string) {
        const transactionSession = await this.transactionModel.startSession();
        transactionSession.startTransaction();
        // Get transaction
        const transaction = await this.transactionModel.findOne({
            userId,
            _id: transactionId,
            status: TransactionStatusEnum.PENDING,
        }).exec();

        // Check transaction
        if (!transaction) {
            await transactionSession.abortTransaction();
            await transactionSession.endSession();
            throw new NotFoundException('TRANSACTION_NOT_FOUND');
        }

        // Update transaction status
        await this.transactionModel.updateOne(
            {
                _id: transactionId,
            },
            {
                status: TransactionStatusEnum.SUCCESS,
            },
        );

        // Check user
        const user = await this.investorModel.findById(userId).exec();
        if (!user) {
            await transactionSession.abortTransaction();
            await transactionSession.endSession();
            throw new NotFoundException('INVESTOR_NOT_FOUND');
        }

        // Check wallet
        const wallet = await this.walletModel.findOne({
            _id: user.walletId
        }).exec();
        if (!wallet) {
            await transactionSession.abortTransaction();
            await transactionSession.endSession();
            throw new NotFoundException('WALLET_NOT_FOUND');
        }

        // Update wallet balance
        await this.walletModel.updateOne(
            {
                _id: user.walletId,
            },
            {
                $inc: {
                    balance: transaction.amount,
                },
            },
        );

        // Commit transaction
        await transactionSession.commitTransaction();
        await transactionSession.endSession();
    }

    /**
     * Withdraw money from investor account
     * @param {String} userId
     * @param {WithdrawTransactionRequestDto} dto
     * @return {Promise<WithdrawTransactionResponseDto>}
     * */
    async withdrawMoney(userId: string, dto: WithdrawTransactionRequestDto) : Promise<WithdrawTransactionResponseDto>{
        // Check investor account
        const investor = await this.investorModel.findById(userId).exec();
        if (!investor) {
            throw new NotFoundException('INVESTOR_NOT_FOUND');
        }
        
        // Check wallet
        const wallet = await this.walletModel.findOne({_id: investor.walletId}).exec();
        if (!wallet) {
            throw new NotFoundException('WALLET_NOT_FOUND');
        }
        
        // Check balance of wallet
        if(wallet.balance <= 0) 
            throw new BadRequestException("BALANCE_NOT_ENOUGH")
        
        
        // Create transaction
         const newTransaction = await this.transactionModel.create({
            userId,
            amount: dto.amount,
            fromSource: dto.fromSource,
            toDestination: dto.toDestination,
            transactionType: TransactionTypeEnum.WITHDRAW,
            status: TransactionStatusEnum.PENDING,
            transactionDate: new Date(),
            transactionDescription: dto.transactionDescription,
            transactionMethod: dto.transactionMethod,
            currency: dto.currency,
            transactionFee: dto.transactionFee,
        });
        
        // return
        return {transactionId: newTransaction._id}
    }

    /**
     * Confirm withdraw transaction
     * @param {String} userId
     * @param {String} transactionId
     * */
    async confirmWithdrawTransaction(userId: string, transactionId: string) {
        const transactionSession = await this.transactionModel.startSession();
        transactionSession.startTransaction();
        // Get transaction
        const transaction = await this.transactionModel.findOne({
            userId,
            _id: transactionId,
            status: TransactionStatusEnum.PENDING,
        }).exec();

        // Check transaction
        if (!transaction) {
            await transactionSession.abortTransaction();
            await transactionSession.endSession();
            throw new NotFoundException('TRANSACTION_NOT_FOUND');
        }

        // Update transaction status
        await this.transactionModel.updateOne(
            {
                _id: transactionId,
            },
            {
                status: TransactionStatusEnum.SUCCESS,
            },
        );

        // Check user
        const user = await this.investorModel.findById(userId).exec();
        if (!user) {
            await transactionSession.abortTransaction();
            await transactionSession.endSession();
            throw new NotFoundException('INVESTOR_NOT_FOUND');
        }

        // Check wallet
        const wallet = await this.walletModel.findOne({
            _id: user.walletId
        }).exec();
        if (!wallet) {
            await transactionSession.abortTransaction();
            await transactionSession.endSession();
            throw new NotFoundException('WALLET_NOT_FOUND');
        }

        // Update wallet balance
        await this.walletModel.updateOne(
            {
                _id: user.walletId,
            },
            {
                $inc: {
                    balance: -transaction.amount,
                },
            },
        );

        // Commit transaction
        await transactionSession.commitTransaction();
        await transactionSession.endSession();
    }

    /**
     * Get account balance fluctuation history
     * @param {String} userId
     * @param {GetAllTransactionsRequestDto} dto
     * @return {Promise<PageDto<ViewTransactionFromUserViewResponseDto>>}
     * */
    async getAllTransactions(userId: string, dto: GetAllTransactionsRequestDto): Promise<PageDto<ViewTransactionFromUserViewResponseDto>> {
        // Check user
        const user = await this.investorModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException('INVESTOR_NOT_FOUND');
        }

        // Initialize filter
        const filter = {
            $and: [
                {userId},
                dto.status === TransactionStatusEnum.ALL ? {} : {status: dto.status},
                dto.transactionType === TransactionTypeEnum.ALL ? {} : {transactionType: dto.transactionType},
            ]
        };

        // Get transactions
        const resultOfPagination = await this.paginationService.paginateWithFilterAndSearch(dto, filter, TransactionEntity.name, []);
        const result = this.mapper.mapArray(resultOfPagination.entities, TransactionEntity, ViewTransactionFromUserViewResponseDto);
        return new PageDto<ViewTransactionFromUserViewResponseDto>(result, resultOfPagination.pageMetaDto);
    }

    /**
     * Get transaction detail
     * @param {String} userId
     * @param {String} transactionId
     * @return {Promise<ViewTransactionFromUserViewResponseDto>}
     * */
    async getTransactionDetail(userId: string, transactionId: string): Promise<ViewTransactionFromUserViewResponseDto> {
        // Check user
        const user = await this.investorModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException('INVESTOR_NOT_FOUND');
        }

        // Get transaction
        const transaction = await this.transactionModel.findOne({
            userId,
            _id: transactionId,
        }).exec();

        if (!transaction) {
            throw new NotFoundException('TRANSACTION_NOT_FOUND');
        }


        return this.mapper.map(transaction, TransactionEntity, ViewTransactionFromUserViewResponseDto);
    }
}