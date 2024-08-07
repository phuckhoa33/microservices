import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Param, Patch, Post, Query, UseGuards} from "@nestjs/common";
import {InvestorTransactionService} from "../../services/investor-transaction.service";
import {GetAllTransactionsRequestDto} from "../../dtos/get-all-transactions.request.dto";
import {PageDto} from "../../../../common/pagination/dtos/page.dto";
import {ViewTransactionFromUserViewResponseDto} from "../../dtos/view-transaction-from-user-view.response.dto";
import {AccessTokenGuard} from "../../../../common/auth/guards/accessToken.guard";
import {UserIdFromAccessToken} from "../../../../common/request/decorators/user-id.decorator";
import {DepositTransactionRequestDto} from "../../dtos/deposit-transaction.request.dto";
import {ViewBuyTransactionFromUserViewResponseDto} from "../../dtos/view-buy-transaction-from-user-view.response.dto";
import {BuyTransactionRequestDto} from "../../dtos/buy-transaction.request.dto";
import {DepositTransactionResponseDto} from "../../dtos/deposit-transaction.response.dto";
import {WithdrawTransactionResponseDto} from "../../dtos/withdraw-transaction.response.dto";

@ApiTags('transactions.management')
@ApiBearerAuth()
@Controller({
    version: '1',
    path: '/transactions',
})
export class InvestorTransactionV1Controller {
    constructor(
        private readonly transactionService: InvestorTransactionService,
    ) {
    }

    // Get all transactions
    @Get('/')
    @ApiOperation({
        summary: 'Get all transactions',
        description: '### Get all transactions',
    })
    @ApiResponse({
        status: 200,
        description: 'Get all transactions',
        type: PageDto<ViewTransactionFromUserViewResponseDto>,
    })
    @UseGuards(AccessTokenGuard)
    async getAllTransactions(
        @Query() dto: GetAllTransactionsRequestDto,
        @UserIdFromAccessToken() userId: string,
    ): Promise<PageDto<ViewTransactionFromUserViewResponseDto>> {
        return await this.transactionService.getAllTransactions(userId, dto);
    }

    // Get transaction by id
    @Get('/:transactionId')
    @ApiOperation({
        summary: 'Get transaction by id',
        description: '### Get transaction by id',
    })
    @ApiResponse({
        status: 200,
        description: 'Return transaction detail',
        type: ViewTransactionFromUserViewResponseDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Return buy transaction detail',
        type: ViewBuyTransactionFromUserViewResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Transaction not found',
    })
    @UseGuards(AccessTokenGuard)
    async getTransactionById(
        @UserIdFromAccessToken() userId: string,
        @Param('transactionId') transactionId: string,
    ): Promise<ViewTransactionFromUserViewResponseDto> {
        return await this.transactionService.getTransactionDetail(userId, transactionId);
    }

    // Deposit money
    @Post('/deposit')
    @ApiOperation({
        summary: 'Deposit money',
        description: '### Deposit money',
    })
    @ApiResponse({
        status: 200,
        description: 'Deposit money successfully',
        type: DepositTransactionResponseDto,
    })
    @UseGuards(AccessTokenGuard)
    async depositMoney(
        @UserIdFromAccessToken() userId: string,
        @Body() dto: DepositTransactionRequestDto,
    ): Promise<DepositTransactionResponseDto> {
        return await this.transactionService.depositMoney(userId, dto);
    }

    // Confirm deposit transaction from banking
    @Patch('/:transactionId/deposit/confirm')
    @ApiOperation({
        summary: 'Confirm deposit transaction',
        description: '### Confirm deposit transaction',
    })
    @ApiResponse({
        status: 200,
        description: 'Confirm deposit transaction successfully',
    })
    @UseGuards(AccessTokenGuard)
    async confirmDepositTransaction(
        @UserIdFromAccessToken() userId: string,
        @Param('transactionId') transactionId: string,
    ): Promise<void> {
        return await this.transactionService.confirmDepositTransaction(userId, transactionId);
    }

    // Withdraw money
    @Post('/withdraw')
    @ApiOperation({
        summary: 'Withdraw money',
        description: '### Withdraw money',
    })
    @ApiResponse({
        status: 200,
        description: 'Withdraw money successfully',
        type: WithdrawTransactionResponseDto
    })
    @UseGuards(AccessTokenGuard)
    async withdrawMoney(
        @UserIdFromAccessToken() userId: string,
        @Body() dto: DepositTransactionRequestDto,
    ): Promise<WithdrawTransactionResponseDto> {
        return await this.transactionService.withdrawMoney(userId, dto);
    }

    // Confirm withdraw transaction from banking
    @Patch('/:transactionId/withdraw/confirm')
    @ApiOperation({
        summary: 'Confirm withdraw transaction',
        description: '### Confirm withdraw transaction',
    })
    @ApiResponse({
        status: 200,
        description: 'Confirm withdraw transaction successfully',
    })
    @UseGuards(AccessTokenGuard)
    async confirmWithdrawTransaction(
        @UserIdFromAccessToken() userId: string,
        @Param('transactionId') transactionId: string,
    ): Promise<void> {
        return await this.transactionService.confirmWithdrawTransaction(userId, transactionId);
    }
    
    // Buy NFT
    @Post('/buy')
    @ApiOperation({
        summary: 'Buy NFT',
        description: '### Buy NFT',
    })
    @ApiResponse({
        status: 200,
        description: 'Buy NFT successfully',
    })
    @UseGuards(AccessTokenGuard)
    async buyNFT(
        @UserIdFromAccessToken() userId: string,
        @Body() dto: BuyTransactionRequestDto,
    ): Promise<void> {
        await this.transactionService.buyNFT(userId, dto);
    }
}
