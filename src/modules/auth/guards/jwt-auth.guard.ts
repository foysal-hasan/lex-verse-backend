import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Redis } from 'ioredis';
import { redisKeys } from 'src/common/redis/redis-keys';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(@InjectRedis() private readonly redis: Redis) {
    super();
  }


  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isValidJwt = await super.canActivate(context);
    if (!isValidJwt) {
      return false;
    }


    const request = context.switchToHttp().getRequest();
    const user = request.user;


    if (user && user.sessionId) {
      console.log(user);

      const isBlacklisted = await this.redis.get(redisKeys.getBlacklistKey(user.sessionId));
      console.log(isBlacklisted);

      if (isBlacklisted) {
        console.log('Session is blacklisted.');
        throw new UnauthorizedException('This session has been revoked.');
      }
    }

    return true;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
