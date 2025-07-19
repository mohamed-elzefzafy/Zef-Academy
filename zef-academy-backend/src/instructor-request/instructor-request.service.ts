import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminResultStatuDto } from './dto/createAdminResultStatu.dto';
import { JwtPayloadType } from 'src/shared/types';
import { InjectModel } from '@nestjs/mongoose';
import { InstructorRequest } from './entities/instructor-request.entity';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { RequestStatue } from 'src/shared/enums/instructorRequest.enums';

@Injectable()
export class InstructorRequestService {
  constructor(
    @InjectModel(InstructorRequest.name)
    private readonly instructorRequestModel: Model<InstructorRequest>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}
  async create(user: JwtPayloadType) {
    let instructorRequest = await this.instructorRequestModel.findOne({
      user: user.id,
    });

    if (!instructorRequest) {
      instructorRequest = await this.instructorRequestModel.create({
        requestStatueTitle: RequestStatue.SENT,
        user: user.id,
      });
      return instructorRequest;
    } else {
      instructorRequest.requestStatueTitle = RequestStatue.SENT;
      await instructorRequest.save();
      return instructorRequest;
    }
  }

  public async findAll(
    page: number,
    limit: number,
    category?: string,
    user?: string,
  ) {
    // Ensure page and limit are positive integers
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);

    // Calculate skip (offset) for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Build query object
    const query = this.instructorRequestModel.find();

    // Apply category filter if provided
    if (user) {
      query.where('user').equals(user);
    }

    const instructorRequest = await query
      .sort({ role: 1, createdAt: 1 }) // ASC sorting
      .skip(skip)
      .limit(limitNumber)
      .exec();

    // Count total documents (with filter if applied)
    const total = await this.instructorRequestModel
      .countDocuments(user ? { user } : {})
      .exec();

    // Calculate total pages
    const pagesCount = Math.ceil(total / limitNumber);

    // Return paginated result
    return {
      instructorRequest,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pagesCount,
      },
    };
  }

  async findOne(id: string) {
    const instructorRequest = await this.instructorRequestModel.findById(id);
    if (!instructorRequest) {
      throw new NotFoundException(`no requset with this id ${id}`);
    }
    return instructorRequest;
  }

  async findCurrentUserInstructorRequest(user: JwtPayloadType) {
    const instructorRequest = await this.instructorRequestModel.findOne({
      user: user.id,
    });
    if (!instructorRequest) {
      throw new NotFoundException(`no requset with this user`);
    }
    return instructorRequest;
  }

  async accessResultStatu(id: string, user: JwtPayloadType, res: Response) {
    const instructorRequest = await this.findOne(id);
    if (instructorRequest.user.toString() !== user.id.toString()) {
      throw new UnauthorizedException("you can't access this route");
    }

    if (instructorRequest.requestStatueTitle !== RequestStatue.ACCEPT) {
      throw new BadRequestException(
        'your instructor request has been rejected',
      );
    }
    await instructorRequest.deleteOne();

    const payLoad: JwtPayloadType = {
      id: user.id.toString(),
      email: user.email,
      role: UserRoles.INSTRUCTOR,
      isAccountVerified: user.isAccountVerified,
    };
    const token = await this.jwtService.signAsync(payLoad, {
      secret: this.config.get<string>('JWT_SECRET_KEY'),
      // noTimestamp: true,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    const currentUser = await this.usersService.findOne(user.id);
    return currentUser;
  }

  async adminUpdateResultStatu(
    id: string,
    createAdminResultStatuDto: CreateAdminResultStatuDto,
  ) {
    const instructorRequest = await this.findOne(id);

    const user = await this.usersService.findOne(instructorRequest.user);
    if (instructorRequest.user.toString() !== user._id.toString()) {
      throw new BadRequestException("you can't access this route");
    }

    if (createAdminResultStatuDto.requestStatueTitle === RequestStatue.ACCEPT) {
      instructorRequest.requestStatueTitle = RequestStatue.ACCEPT;
      user.role = UserRoles.INSTRUCTOR;
      await user.save();
      await instructorRequest.save();
      return { message: 'your instructor request has accepted' };
    }

    instructorRequest.requestStatueTitle = RequestStatue.REJECT;
    await instructorRequest.save();
    return { message: 'your instructor request has been rejected' };
  }
  // update(id: number, updateInstructorRequestDto: UpdateInstructorRequestDto) {
  //   return `This action updates a #${id} instructorRequest`;
  // }

  remove(id: number) {
    return `This action removes a #${id} instructorRequest`;
  }
}
