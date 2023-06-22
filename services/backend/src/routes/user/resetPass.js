import { User } from '@poll/mongo'
import restifyErrors from 'restify-errors'
import bcrypt from 'bcrypt'
import { validator } from '../../helpers/index.js'
import Joi from 'joi'
import nodemailer from 'nodemailer'
import generator from 'generate-password'

const { NotFoundError } = restifyErrors
const { EMAIL, EMAIL_PASS } = process.env

export default async (req, res, next) => {
  try {
    const { email } = validator(
      req.body,
      Joi.object().keys({
        email: Joi.string().email(),
      })
    )
    const password = generator.generate({
      length: 30,
      numbers: true,
    })
    const hashPassword = await bcrypt.hash(password, 7)
    const result = await User.updateOne(
      { email },
      {
        $set: {
          password: hashPassword,
        },
      },
      { upsert: true }
    )
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
      },
    })
    const mailOptions = {
      from: `Poll ${EMAIL}`,
      to: email,
      subject: 'Скидання паролю',
      html: `<h3>Новий пароль: ${password}</h3>`,
    }

    if (result.modifiedCount === 0) throw new NotFoundError('User not found')
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) next(error)
      else res.status(200).json({ success: true })
    })
  } catch (error) {
    next(error)
  }
}
