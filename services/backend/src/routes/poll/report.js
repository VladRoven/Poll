import { Poll } from '@poll/mongo'
import restifyErrors from 'restify-errors'
import excel from 'exceljs'
import path from 'path'
import dayjs from 'dayjs'

const { ForbiddenError, NotFoundError, InvalidArgumentError } = restifyErrors

const countPercent = (countRespondents, variant, answers) => {
  const variantCount = answers.reduce(
    (acc, { answer }) => acc + (answer === variant.toString() ? 1 : 0),
    0
  )
  return {
    respondents: variantCount,
    percent: Math.round((variantCount / countRespondents) * 100) || 0,
  }
}
const outputQuestion = async poll => {
  let row = 1
  const { id, respondents, questions, status, dateOpen, dateClose } = poll
  const workbook = new excel.Workbook()
  const worksheet = workbook.addWorksheet('Звіт')
  const name = id.toString()
  const __path = `${path.resolve('../../reports')}/${name}.xlsx`

  questions.map(question => {
    const answers = respondents.length
      ? respondents.reduce((acc, respondent) => {
          acc.push({
            user: `${respondent.user.firstName} ${respondent.user.lastName}`,
            answer: respondent.answers[question.id],
          })
          return acc
        }, [])
      : []

    switch (question.type) {
      case 'variants':
        {
          const b = worksheet.getCell(`B${row}`)
          const c = worksheet.getCell(`C${row}`)
          worksheet.mergeCells(`A${row}:B${row}`)
          b.value = question.title
          b.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            shrinkToFit: true,
            wrapText: true,
          }
          b.font = {
            bold: true,
          }
          c.value = 'Кіл-ть голосів'
          c.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            shrinkToFit: true,
            wrapText: true,
          }
          c.font = {
            bold: true,
          }
          worksheet.getRow(row).height = 35
          worksheet.getColumn('A').width = 30
          worksheet.getColumn('C').width = 12
          ++row

          question.variants.map(variant => {
            const a = worksheet.getCell(`A${row}`)
            const b = worksheet.getCell(`B${row}`)
            const c = worksheet.getCell(`C${row}`)
            const { respondents: countResp, percent } = countPercent(
              respondents.length,
              variant.id,
              answers
            )

            a.value = variant.variant
            b.alignment = {
              wrapText: true,
            }
            b.value = `${percent}%`
            b.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            }
            c.value = countResp
            c.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            }
            ++row
          })
        }
        break
      case 'scale':
        {
          const b = worksheet.getCell(`B${row}`)
          worksheet.mergeCells(`A${row}:B${row}`)
          b.value = question.title
          b.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            shrinkToFit: true,
            wrapText: true,
          }
          b.font = {
            bold: true,
          }
          worksheet.getRow(row++).height = 35
          worksheet.getColumn('A').width = 30

          const a = worksheet.getCell(`A${row}`)
          const c = worksheet.getCell(`C${row}`)
          a.value = 'Середня відповідь'
          c.value = answers.length
            ? answers.reduce((acc, { answer }) => acc + answer, 0) /
              answers.length
            : 0
          c.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          }
          ++row
        }
        break
    }
  })
  let b = worksheet.getCell(`B${row}`)
  let c = worksheet.getCell(`C${row}`)
  worksheet.mergeCells(`A${row}:B${row++}`)
  b.value = 'Дата початку/завершення'
  b.alignment = {
    horizontal: 'center',
    vertical: 'middle',
    shrinkToFit: true,
    wrapText: true,
  }
  b.font = {
    bold: true,
  }
  c.value = 'Учасників'
  c.alignment = {
    horizontal: 'center',
    vertical: 'middle',
    shrinkToFit: true,
    wrapText: true,
  }
  c.font = {
    bold: true,
  }
  worksheet.mergeCells(`C${row}:C${row + 1}`)
  let a = worksheet.getCell(`A${row}`)
  a.value = `Розпочато: ${dayjs(dateOpen).format('DD.MM.YYYY')}`
  c = worksheet.getCell(`C${row++}`)
  c.value = respondents.length
  c.alignment = {
    horizontal: 'center',
    vertical: 'middle',
    shrinkToFit: true,
    wrapText: true,
  }
  a = worksheet.getCell(`A${row}`)
  a.value = `Закінчено: ${dayjs(dateClose).format('DD.MM.YYYY')}`

  await workbook.xlsx.writeFile(__path)
  return {
    __path,
    name,
  }
}

export default async (req, res, next) => {
  try {
    const { _id } = req.user
    const { id } = req.query

    if (!id) throw new InvalidArgumentError('No poll id')
    const [poll] = await Poll.find({ _id: id })
      .populate({
        path: 'respondents.user',
        model: 'User',
        select: { firstName: 1, lastName: 1 },
      })
      .lean()
    if (!poll) throw new NotFoundError('Not Found')
    if (_id.toString() !== poll.user.toString())
      throw new ForbiddenError(`You aren't creater`)

    const { name, __path } = await outputQuestion(Poll.dumpCreator(poll))
    res.setHeader('Content-Disposition', `attachment; filename=${name}.xlsx`)
    res.download(__path)
  } catch (error) {
    next(error)
  }
}
