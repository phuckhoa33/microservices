import {ApiProperty} from '@nestjs/swagger';

export class AssignRolesToUserRequestDto {
    @ApiProperty({
        type: [String],
        description: 'Role ids',
        example: ['60f1b0b9b3b3f3b3f3b3f3b3', '60f1b0b9b3b3f3b3f3b3f3b4'],
    })
    roleIds: string[];
}