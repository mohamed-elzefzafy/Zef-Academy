import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND,
    credentials: true,
  });

  // app.enableCors({
  //   origin: process.env.FRONTEND,
  //   credentials: true, // Allow cookies to be sent
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

// multer({
//       limits: { fileSize: 10000000 }, // 10MB limit
//       fileFilter: (req, file, cb: multer.FileFilterCallback) => {
//         if (file.mimetype.match(/^(image\/|video\/)/)) {
//           cb(null, true);
//         } else {
//           cb(null, false); // Use Error object
//         }
//       },
//     }).any(),
  
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
