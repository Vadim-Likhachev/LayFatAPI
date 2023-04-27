const bycript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async (req, res) => {
    const candidat = await User.findOne({email: req.body.email})


    if (candidat) {
        //проверка пароля от клиента и пароля в хэше
        const passwordResult = bycript.compareSync(req.body.password, candidat.password)

        if (passwordResult) {
            // генерируем токен, если пароли совпали
            const token = jwt.sign({
                email: candidat.email,
                userId: candidat._id
            }, keys.jwt, {expiresIn: 60 *60})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте другой.'
            })
        }
    } else {
        res.status(404).json({
            message: 'Пользователь с таким email не найден.'
        })
    }
}

module.exports.register = async (req, res) => {
    const candidat = await User.findOne({email: req.body.email})

    if (candidat) {
        res.status(409).json({
            message: 'Такой email уже зарегестрированю Попробуйте другой'
        })
    } else {
        const salt = bycript.genSaltSync(10)
        const password = req.body.password 
        const user = new User({
            email: req.body.email,
            password: bycript.hashSync(password, salt)
        })

        await user.save()
        try {
            res.status(201).json(user)
        } catch(e) {
            errorHandler(res, e)
        }

    }
}

