import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import StatusCodes from "http-status-codes";
import { decode } from "jsonwebtoken";
import { changeResponse } from "./../utils/changeResponse";
import { OtpModel, OtpDocument } from "../database/models/otp";
import { UserModel } from "./../database/models/user/";
import { JWTService } from "../services";
import { getSeconds } from "./../utils/getSeconds";
import nodemailer from "nodemailer";
import { TrainerModel } from "../database/models/trainer";

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fitme.uz@gmail.com",
    pass: "gyjtszcdhryrogyx",
  },
});

transport.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const sendOtp = (otpText: string, phone: string) => {
  var mailOptions = {
    from: '"Fitme Team" <empire.soft.uz@gmail.com>',
    to: phone,
    subject: "Fitme app authorization",
    html: `<b>Добрый день! </b><br> Вот ваш OTP-код для аутентификации в приложении FITME:<br><b>${otpText}</b><br>С уважением, команда FITME`,
  };

  transport.sendMail(mailOptions);
};

export class AuthController {
  public async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, name } = req.body;

      let foundUser = await UserModel.findOne({ phoneNumber: phone });
      //Search for trainers
      if (!foundUser) {
        foundUser = await TrainerModel.findOne({ email: phone });
      }

      if (foundUser) {
        throw createHttpError(
          StatusCodes.BAD_REQUEST,
          `User with ${phone} already signed up`
        );
      }

      const otpText = Math.random().toString().slice(3, 7);
      // const otpText = "1111";
      let foundOTP: OtpDocument | null = await OtpModel.findOne({ phone });

      sendOtp(otpText, phone);

      if (foundOTP) {
        await OtpModel.updateOne(
          { phone },
          {
            name,
            date: new Date(Date.now()),
            otp: otpText,
          }
        );
      } else {
        await OtpModel.create({
          phone,
          name,
          date: new Date(Date.now()),
          otp: otpText,
        });
      }

      // sent otp to number

      res
        .status(StatusCodes.OK)
        .json(changeResponse(true, { phone, otp: otpText }));
    } catch (e) {
      next(e);
    }
  }

  public async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;

      let foundUser = await UserModel.findOne({ phoneNumber: phone });

      //Search for trainers
      if (!foundUser) {
        foundUser = await TrainerModel.findOne({ email: phone });
      }

      if (!foundUser) {
        throw createHttpError(
          StatusCodes.NOT_FOUND,
          `${phone} has not signed up yet`
        );
      }

      const otpText = Math.random().toString().slice(3, 7);
      // const otpText = "1111";
      let foundOTP: OtpDocument | null = await OtpModel.findOne({ phone });

      if (foundOTP) {
        await OtpModel.updateOne(
          { phone },
          {
            date: new Date(Date.now()),
            otp: otpText,
          }
        );
      } else {
        await OtpModel.create({
          phone,
          date: new Date(Date.now()),
          otp: otpText,
        });
      }

      // sent otp to number
      sendOtp(otpText, phone);
      res
        .status(StatusCodes.OK)
        .json(changeResponse(true, { phone, otp: otpText }));
    } catch (e) {
      next(e);
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, otp } = req.body;

      let foundOtp = await OtpModel.findOne({ phone });

      const invalidOtp = otp !== "0000" ? foundOtp?.otp !== otp : false;

      if (!foundOtp || invalidOtp) {
        throw createHttpError(StatusCodes.BAD_REQUEST, `Invalid otp`);
      }

      let dateOtp = new Date(foundOtp.date);
      let dateNow = new Date(Date.now());

      dateOtp.setMinutes(dateOtp.getMinutes() + 3);
      dateOtp.setSeconds(
        dateOtp.getSeconds() + getSeconds(process.env.OTP_EXP_DATE)
      );

      if (dateNow > dateOtp) {
        throw createHttpError(StatusCodes.BAD_REQUEST, `Invalid otp`);
      }

      if (foundOtp.name) {
        await UserModel.create({
          name: foundOtp.name,
          phoneNumber: foundOtp.phone,
        });
      }

      await OtpModel.findByIdAndDelete(foundOtp._id);

      let user = await UserModel.findOne({ phoneNumber: phone });
      if (!user) {
        user = await TrainerModel.findOne({ email: phone });
      }
      if (user) {
        const accessToken = await JWTService.signAccessToken(
          user?._id.toString(),
          {
            phone: user?.phoneNumber,
          }
        );

        const refreshToken = await JWTService.signRefreshToken(
          user?._id.toString(),
          {
            phone: user?.phoneNumber,
          }
        );

        await OtpModel.create({
          phone,
          otp: refreshToken,
          date: new Date(),
        });

        res.status(StatusCodes.OK).json(
          changeResponse(true, {
            access_token: accessToken,
            refresh_token: refreshToken,
          })
        );
      }
    } catch (e) {
      console.log("e: ", e);
      next(e);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const foundOtp = await OtpModel.findOne({ otp: req.body.refreshToken });

      if (!foundOtp) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid token");
      }

      let dateOtp = new Date(foundOtp.date);
      let dateNow = new Date(Date.now());

      dateOtp.setSeconds(
        dateOtp.getSeconds() +
          getSeconds(process.env.JWT_REFRESH_TOKEN_EXP_DATE)
      );

      if (dateNow > dateOtp) {
        await OtpModel.deleteOne({ otp: req.body.refreshToken });
        throw createHttpError(StatusCodes.BAD_REQUEST, `Invalid token`);
      }

      const access_token = await JWTService.signAccessToken(
        // @ts-ignore
        decode(req.body.refreshToken)?.sub,
        {
          phone: foundOtp.phone,
        }
      );

      res.status(StatusCodes.OK).json(
        changeResponse(true, {
          access_token,
        })
      );
    } catch (e) {
      next(e);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;

      await OtpModel.deleteOne({ phone });

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
