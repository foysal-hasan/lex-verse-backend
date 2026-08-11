import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Req,
    UseInterceptors,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuggestionService } from '../suggestion.service';
import { CreateSuggestionDto } from '../dto/create-suggestion.dto';
import { UpdateSuggestionDto } from '../dto/update-suggestion.dto';
import { QuerySuggestionDto } from '../dto/query-suggestion.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Roles } from 'src/common/guard/role/roles.decorator';
import { UserRole } from 'src/generated/prisma/enums';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ToggleSuggestionDto } from '../dto/toggle-suggestion.dto';

@ApiTags('Admin - Suggestions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@UseInterceptors(TransformResponseInterceptor)
@Controller('admin/suggestions')
export class SuggestionAdminController {
    constructor(private readonly suggestionService: SuggestionService) { }

    @Post()
    @ApiOperation({ summary: 'Create suggestion hierarchy with sub-suggestions and package links (Admin)' })
    create(@Body() dto: CreateSuggestionDto, @Req() req: Request) {
        const userId = req.user.userId;
        return this.suggestionService.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'List all suggestions and hierarchies (Admin)' })
    findAll(@Query() query: QuerySuggestionDto) {
        return this.suggestionService.findAllAdmin(query);
    }

    
    @Get(':id')
    @ApiOperation({ summary: 'Get single suggestion details (Admin)' })
    findOne(@Param('id') id: string) {
        return this.suggestionService.findOneAdmin(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update suggestion or sub-suggestion (Admin)' })
    update(@Param('id') id: string, @Body() dto: UpdateSuggestionDto) {
        return this.suggestionService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete suggestion and cascade delete children (Admin)' })
    remove(@Param('id') id: string) {
        return this.suggestionService.remove(id);
    }

    @Patch(':suggestionId/packages/:packageId/attach')
    @HttpCode(HttpStatus.OK)
    async attachPackage(
        @Param('suggestionId') suggestionId: string,
        @Param('packageId') packageId: string,
    ) {
        return this.suggestionService.attachPackage(suggestionId, packageId);
    }

    @Patch(':suggestionId/packages/:packageId/detach')
    @HttpCode(HttpStatus.OK)
    async detachPackage(
        @Param('suggestionId') suggestionId: string,
        @Param('packageId') packageId: string,
    ) {
        return this.suggestionService.detachPackage(suggestionId, packageId);
    }
}