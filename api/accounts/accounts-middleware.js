const Accounts = require('./accounts-model')
const db = require('../../data/db-config')

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body
  try {
    if (name === undefined || budget === undefined) {
      next({ status: 400, message: "name and budget are required" })
    }
    else if (typeof name !== 'string') {
      next({ status: 400, message: "name of account must be a string" })
    }
    else if (name.trim().length < 3 || name.trim().length > 100) {
      next({ status: 400, message: "name of account must be between 3 and 100" })
    }
    else if (typeof budget !== 'number') {
      next({ status: 400, message: "must be a number" })
    }
    else if (budget < 0 || budget > 1000000) {
      next({ status: 400, message: "budget of account is too large or too small" })
    }
    else {
      req.name = name.trim()
      next()
    }
  }
  catch (error) {
    next(error)
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  const existing = await db('accounts').where('name', req.body.name.trim()).first()
  try {
    if (existing) {
      next({ status: 400, message: "that name is taken"})
    }
    else {
      next()
    }
  }
  catch (error) {
    next(error)
  }
}

exports.checkAccountId = async (req, res, next) => {
  const account = await Accounts.getById(req.params.id)
    try {
      if (!account) {
        next({ status: 404, message: 'account not found' })
      }
      else {
        req.account = account
        next()
      }
    }
    catch (error) {
      next(error)
    }
}
