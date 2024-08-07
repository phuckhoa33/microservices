import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {InvestorEntity} from '../entities/investor.entity';
import {Model} from 'mongoose';
import {InjectMapper} from '@automapper/nestjs';
import {Mapper} from '@automapper/core';
import {AuthService} from '../../../common/auth/services/auth.service';
import {ChangePasswordRequestDto} from '../dtos/change-password.request.dto';
import {PRIMARY_DATABASE_CONNECTION_NAME} from '../../../common/database/constants/database-name.constant';
import {UpdateShortNameRequestDto} from '../dtos/update-shortName.request.dto';
import {MinioClientService} from '../../../common/minio-client/services/minio-client.service';
import {UpdateUserV2RequestDto} from '../dtos/update-user.v2.request.dto';
import {ViewUserProfileV2ResponseDto} from '../dtos/view-user-profile.v2.response.dto';
import {UpdateUserProfileImageNameRequestDto} from '../dtos/update-user-profile-image-name.request.dto';
import {MinioFolderEnum} from '../../../shared/enum/minio-folder-enum';

@Injectable()
export class UserMyService {
    constructor(
        @InjectModel(InvestorEntity.name, PRIMARY_DATABASE_CONNECTION_NAME)
        private readonly userModel: Model<InvestorEntity>,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly authService: AuthService,
        private readonly minioClientService: MinioClientService,
        // TODO: This service use for notifying for user about all of change
        // private readonly notificationService: NotificationService,
    ) {
    }

    /**
     * Update short name
     * @param {UpdateShortNameRequestDto} dto
     * @param {String} userId
     * */
    async updateShortName(dto: UpdateShortNameRequestDto, userId: string) {
        // Check user
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new NotFoundException('NOT_FOUND_USER');

        // Update shortname
        await this.userModel.updateOne({_id: userId}, {shortName: dto.shortName}).exec();
    }


    /**
     * Remove image
     * @param {String} userId
     * */
    async removeImage(userId: string) {
        // Get user
        const user = await this.userModel.findById(userId).exec();
        if (!user)
            throw new NotFoundException('USER_NOT_FOUND');

        // Remove in minio
        await this.minioClientService.removeObject(`${MinioFolderEnum.INVESTOR_FOLDER}/${userId}/${user.imageProfile}`);

        // Update image of user
        await this.userModel.updateOne({_id: user._id}, {image: null});
    }

    /**
     * Change password
     * @param {String} userId
     * @param {ChangePasswordRequestDto} dto
     * */
    // Change password
    async changePassword(
        userId: string,
        dto: ChangePasswordRequestDto,
    ): Promise<void> {
        const {oldPassword, newPassword} = dto;

        // Check old password
        const user = await this.userModel
            .findOne({
                _id: userId,
            })
            .exec();

        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        const isOldPasswordCorrect = await this.authService.comparePassword(
            oldPassword,
            user.password,
        );

        if (!isOldPasswordCorrect) {
            throw new NotFoundException('INCORRECT_PASSWORD');
        }

        // Hash new password
        const hashedNewPassword = await this.authService.hashData(newPassword);

        // Update new password
        await this.userModel
            .updateOne(
                {
                    _id: userId,
                },
                {
                    $set: {
                        password: hashedNewPassword,
                    },
                },
            )
            .exec();
    }

    /**
     * Get PUT pre signed URL
     * @param {String} objectName
     * @param {String} userId
     * @return {String}
     * */
    async getPresignedPutUrlForUpdateUserProfile(objectName: string, userId: string) {
        return await this.minioClientService.getPresignedPutUrl(`${MinioFolderEnum.INVESTOR_FOLDER}/${userId}/${objectName}`);
    }

    // New update user information
    /**
     * Update user information without image
     * @param {UpdateUserRequestDto} dto
     * @param {String} userId
     */
    async updateUserV2(dto: UpdateUserV2RequestDto, userId: string): Promise<any> {
        // Check user exist
        const user = await this.userModel.findOne({_id: userId}).exec();
        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // Complete address string
        let address = null;
        if (dto.addressWard && dto.addressDistrict && dto.addressProvince)
            address = dto.addressWard + ', ' + dto.addressDistrict + ', ' + dto.addressProvince;

        // Update user
        await this.userModel.updateOne({_id: userId}, {...dto, address});
    }

    /**
     * View user profile
     * @param {String} userId
     * @return {any}
     * */
    async viewUserProfile(userId: string): Promise<any> {
        // Get user profile and select only some fields in ViewUserFromManageViewResponseDto
        const user: InvestorEntity = await this.userModel
            .findOne({
                _id: userId,
            })
            .populate('roles')
            .exec();

        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        return this.mapper.map(user, InvestorEntity, ViewUserProfileV2ResponseDto);
    }

    /**
     * Update image profile (name only)
     * @param {String} userId
     * @param {UpdateUserProfileImageNameRequestDto} dto
     * */
    async updateImageProfile(userId: string, dto: UpdateUserProfileImageNameRequestDto) {
        // Get user
        const user = await this.userModel.findById(userId).exec();

        if (!user)
            throw new NotFoundException('USER_NOT_FOUND');

        // Remove image from minio
        await this.minioClientService.removeObject(`${MinioFolderEnum.INVESTOR_FOLDER}/${userId}/${user.imageProfile}`);
        // Update image profile
        await this.userModel.updateOne({_id: user._id}, {imageProfile: dto.imageProfile});
    }
}
