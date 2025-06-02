import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/TestSchema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryVideoService } from 'src/cloudinary/cloudinary-video.service';
import { CloudinaryPDFService } from 'src/cloudinary/cloudinary-pdf.service';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name) private readonly testModel: Model<Test>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly cloudinaryVideoService: CloudinaryVideoService,
    private readonly cloudinaryPDFService: CloudinaryPDFService,
  ) {}
  // public async create(
  //   createTestDto: CreateTestDto,
  //   file: Express.Multer.File,
  // ) {

  //   let image: { url: string; public_id: string } | null = null;

  //   if (file) {
      
  //     const result = await this.cloudinaryService.uploadImage(file, 'tests');
  //     image = { url: result.secure_url, public_id: result.public_id };
  //   }

  //   return this.testModel.create({...createTestDto , image});
  // }


  //  public async create(
  //   createTestDto: CreateTestDto,
  //   file: Express.Multer.File,
  // ) {
  //   let image: { url: string; public_id: string } | null = null;
  //   let video: { url: string; public_id: string } | null = null;

  //   if (file) {
  //     // Determine if the file is an image or video based on mimetype
  //     const isVideo = file.mimetype.startsWith('video/');
      
  //     if (isVideo) {
  //       const result = await this.cloudinaryVideoService.uploadVideo(file, 'tests');
  //       video = { url: result.secure_url, public_id: result.public_id };
  //     } else {
  //       const result = await this.cloudinaryService.uploadImage(file, 'tests');
  //       image = { url: result.secure_url, public_id: result.public_id };
  //     }
  //   }

  //   return this.testModel.create({ ...createTestDto, image, video });
  // }


//   public async create(
//   createTestDto: CreateTestDto,
//   files: Express.Multer.File[],
// ) {
//   let image: { url: string; public_id: string } | null = null;
//   let video: { url: string; public_id: string } | null = null;

//   for (const file of files) {
//     if (file.mimetype.startsWith('image/')) {
//       const result = await this.cloudinaryService.uploadImage(file, 'tests');
//       image = { url: result.secure_url, public_id: result.public_id };
//     } else if (file.mimetype.startsWith('video/')) {
//       const result = await this.cloudinaryVideoService.uploadVideo(file, 'tests');
//       video = { url: result.secure_url, public_id: result.public_id };
//     }
//   }

//   return this.testModel.create({
//     ...createTestDto,
//     image,
//     video,
//   });
// }


public async create(
  createTestDto: CreateTestDto,
  files: Express.Multer.File[],
) {
  let image: { url: string; public_id: string } | null = null;
  let video: { url: string; public_id: string } | null = null;
  let pdf: { url: string; public_id: string } | null = null;

  for (const file of files) {
    if (file.mimetype.startsWith('image/')) {
      const result = await this.cloudinaryService.uploadImage(file, 'tests');
      image = { url: result.secure_url, public_id: result.public_id };
    } else if (file.mimetype.startsWith('video/')) {
      const result = await this.cloudinaryVideoService.uploadVideo(file, 'tests');
      video = { url: result.secure_url, public_id: result.public_id };
    } else if (file.mimetype === 'application/pdf') {
      const result = await this.cloudinaryPDFService.uploadPDF(file, 'tests');
      pdf = { url: result.secure_url, public_id: result.public_id };
    }
  }

  return this.testModel.create({
    ...createTestDto,
    image,
    video,
    pdf,
  });
}

  public async findAll() {
    // return this.testRepositry.find();
    return `This action returns a  test`;
  }

  findOne(id: number) {
    return `This action returns a #${id} test`;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  public async remove(id: number) {
    // const test = await this.testRepositry.findOneBy({ id });
    // if (!test) throw new NotFoundException('test not found');
    // if (test.images.length > 0) {
    //   await this.cloudinaryService.removeMultipleImages(
    //     test.images.map((image) => image.public_id),
    //   );
      return `This action returns a  test`;
    }
  //   await this.testRepositry.remove(test);
  //   return { message: 'test deleted succefully' };
  // }
}