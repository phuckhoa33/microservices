import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, UseGuards} from "@nestjs/common";
import {InvestorWalletService} from "../../services/investor-wallet.service";
import {ViewWalletFromUserViewResponseDto} from "../../dtos/view-wallet-from-user-view.response.dto";
import {AccessTokenGuard} from "../../../../common/auth/guards/accessToken.guard";
import {UserIdFromAccessToken} from "../../../../common/request/decorators/user-id.decorator";

@ApiTags('investor.wallet')
@ApiBearerAuth()
@Controller({
    version: '1',
    path: '/wallets',
})
export class InvestorWalletV1Controller {
    constructor(
        private readonly walletService: InvestorWalletService,
    ) {
    }

    // Get wallet by walletId
    @Get('/:walletId')
    @ApiOperation({
        summary: 'Get wallet by walletId',
        description: '### Get wallet by walletId',
    })
    @ApiParam({
        name: 'walletId',
        description: 'Wallet id',
        examples: {
            example1: {
                value: 'cc6403d9-e0ee-45f0-88b7-78ce5c4fff28',
                summary: 'Example 1 which can be expired data or invalid data',
            },
            example2: {
                value: 'dbe1e9e2-d03f-4d5b-917d-672184ab96b8',
                summary: 'Example 2 which can be expired data or invalid data',
            },
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Get wallet by id',
        type: ViewWalletFromUserViewResponseDto,
    })
    @UseGuards(AccessTokenGuard)
    async getWalletByWalletId(
        @UserIdFromAccessToken() userId: string,
        @Param('walletId') walletId: string,
    ): Promise<ViewWalletFromUserViewResponseDto> {
        return await this.walletService.getWalletByUserId(userId, walletId);
    }

}