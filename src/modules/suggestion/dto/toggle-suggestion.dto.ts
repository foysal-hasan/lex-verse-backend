import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class ToggleSuggestionDto {
    @ApiProperty({ description: 'Active status of the suggestion' })
    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;
}