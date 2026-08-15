import { Controller, Get, Param, Query, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SyllabusService } from '../syllabus.service';
import { QuerySyllabusDto } from '../dto/query-syllabus.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { Storage } from 'src/common/lib/Disk/Storage';

@ApiTags('User - Syllabuses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('syllabuses')
export class SyllabusUserController {
    constructor(private readonly syllabusService: SyllabusService) { }

    @Get()
    @ApiOperation({ summary: 'Get all syllabuses for a specific package with filter, search, sort, pagination (User)' })
    async findAllForUser(@Query() query: QuerySyllabusDto, @Req() req: Request) {
        const userId = req.user.userId;
        const data = await this.syllabusService.findAllForUser(userId, query);
        data.items.forEach(item => {
            if (item?.file_path) {
                item['file_url'] = Storage.url(item.file_path);
            }
        })
        return data;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get single syllabus with active package subscription check (User)' })
    async findOneForUser(@Param('id') id: string, @Req() req: Request) {
        const userId = req.user.userId;
        const syllabus = await this.syllabusService.findOneForUser(id, userId);
        if (syllabus?.file_path) {
            syllabus['file_url'] = Storage.url(syllabus.file_path);
        }
        return syllabus;
    }
}